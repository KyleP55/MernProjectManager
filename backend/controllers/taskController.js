const Task = require('../models/Task');
const Checklist = require('../models/Checklist');

// Create task + checklists
exports.createTask = async (req, res) => {
    try {
        const { name, description, projectId, checklist = [] } = req.body;

        const task = new Task({ name, description, projectId });

        const checklistDocs = await Checklist.insertMany(
            checklist.map(item => ({
                description: item,
                projectId,
                taskId: task._id
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
        const { projectId } = req.query;
        const filter = projectId ? { projectId } : {};

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

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Optional: replace existing checklist items
        if (checklist.length > 0) {
            console.log(checklist)
            await Checklist.deleteMany({ taskId: task._id });
            await Checklist.insertMany(
                checklist.map(item => ({
                    ...item,
                    taskId: task._id,
                    projectId: task.projectId,
                    date: task.date,
                    dateCompleted: task.dateCompleted
                }))
            );
        }

        res.json({ task });
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
