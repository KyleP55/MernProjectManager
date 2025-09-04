const Task = require('../models/Task');
const Checklist = require('../models/Checklist');

const getProjectAccess = require('../utils/projectAccess');

// Create task + checklists
exports.createTask = async (req, res) => {
    try {
        const access = await getProjectAccess(req.body.projectId, req.user._id);
        if (access != 'owner' && access != 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { name, description, projectId, checklist = [] } = req.body;

        const task = new Task({ name, description, projectId, owner: req.user._id });

        const checklistDocs = await Checklist.insertMany(
            checklist.map(item => ({
                description: item,
                projectId,
                taskId: task._id,
                owner: req.body._id
            }))
        );
        await task.save();

        res.status(201).json({ task, checklist: checklistDocs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all tasks 
exports.getTasks = async (req, res) => {
    try {
        // TODO: add admin view all projects when no id provided

        const { projectId } = req.query;

        let filter = {};
        if (projectId) {
            const access = await getProjectAccess(projectId, req.user._id);
            if (!access) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            filter = { projectId: projectId }
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        for (const task of tasks) {
            const checklistItems = await Checklist.find({ taskId: task._id });
            task._doc.checklistItems = checklistItems;
        }

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const access = await getProjectAccess(task.projectId, req.user._id);
        if (!access) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const checklist = await Checklist.find({ taskId: task._id });
        res.json({ task, checklist });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task + optional checklist items
exports.updateTask = async (req, res) => {
    try {
        const { name, description, checklist = [] } = req.body;

        const taskCheck = await Task.findById(req.params.id);
        if (!taskCheck) return res.status(404).json({ error: 'Task not found' });

        const access = await getProjectAccess(taskCheck.projectId, req.user._id);
        if (access !== "owner" && access !== "admin") {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Optional: replace existing checklist items
        let checklistItems;
        if (checklist.length > 0) {

            await Checklist.deleteMany({ taskId: task._id });
            checklistItems = await Checklist.insertMany(
                checklist.map(item => ({
                    ...item,
                    taskId: task._id,
                    projectId: task.projectId,
                    date: item.date,
                    dateCompleted: item.dateCompleted
                }))
            );
        }

        res.json({ task, checklistItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Complete Task

exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const wasCompleted = !!task.completedDate;

        task.completedDate = wasCompleted ? null : new Date();
        await task.save();

        res.json({ message: wasCompleted ? 'Task marked as completed' : 'Task marked as uncompleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Delete task + all related checklists
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await Checklist.deleteMany({ taskId: task._id });

        res.json({ message: 'Task and related checklist items deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
