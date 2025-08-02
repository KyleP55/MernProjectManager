const Checklist = require('../models/Checklist');
const Task = require('../models/Task');

// Create
exports.createChecklistItem = async (req, res) => {
    try {
        const checklist = await Checklist.create(req.body);
        res.status(201).json(checklist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read All, Optional Filters
exports.getManyChecklistItems = async (req, res) => {
    try {
        const { taskId, projectId } = req.query;
        const filter = {};

        if (taskId) filter.taskId = taskId;
        if (projectId) filter.projectId = projectId;

        const items = await Checklist.find(filter);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read One
exports.getChecklistItem = async (req, res) => {
    try {
        const item = await Checklist.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Checklist item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateChecklistItem = async (req, res) => {
    try {
        const updated = await Checklist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Checklist item not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete
exports.deleteChecklistItem = async (req, res) => {
    try {
        const deleted = await Checklist.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Checklist item not found' });
        res.json({ message: 'Checklist item deleted', item: deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Toggle Complete
exports.toggleChecklistCompletion = async (req, res) => {
    try {
        const item = await Checklist.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Checklist item not found' });

        const wasCompleted = !!item.dateCompleted;
        item.dateCompleted = wasCompleted ? null : new Date();
        await item.save();

        // After toggling, check if all checklist items for the task are completed
        const taskId = item.taskId;
        const checklistItems = await Checklist.find({ taskId });

        const allCompleted = checklistItems.length > 0 && checklistItems.every(i => i.dateCompleted);
        const task = await Task.findById(taskId);

        if (task) {
            task.completedDate = allCompleted ? new Date() : null;
            await task.save();
        }

        res.json({
            message: wasCompleted
                ? 'Checklist item marked as uncompleted'
                : 'Checklist item marked as completed',
            checklistItem: item,
            taskUpdated: task
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
