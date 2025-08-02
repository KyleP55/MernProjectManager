const Log = require('../models/Log');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');

const createLog = async (req, res) => {
    try {
        const log = await Log.create(req.body);
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const { projectId, taskId, checklistId, startDate, endDate } = req.query;
        const filter = {};

        if (taskId) filter.tasksWorkedOn = taskId;
        if (checklistId) filter.checklistsWorkedOn = checklistId;

        if (startDate || endDate) {
            filter.timeIn = {};
            if (startDate) filter.timeIn.$gte = new Date(startDate);
            if (endDate) filter.timeIn.$lte = new Date(endDate);
        }

        // Filter by project indirectly via Task
        if (projectId) {
            const tasks = await Task.find({ projectId }, '_id');
            const taskIds = tasks.map(t => t._id);
            filter.tasksWorkedOn = { $in: taskIds };
        }

        const logs = await Log.find(filter).sort({ timeIn: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getLogById = async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        if (!log) return res.status(404).json({ error: 'Log not found' });
        res.json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateLog = async (req, res) => {
    try {
        const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!log) return res.status(404).json({ error: 'Log not found' });
        res.json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteLog = async (req, res) => {
    try {
        const log = await Log.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({ error: 'Log not found' });
        res.json({ message: 'Log deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const toggleLogComplete = async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        if (!log) return res.status(404).json({ error: 'Log not found' });

        log.timeOut = log.timeOut ? null : new Date();
        await log.save();

        res.json({ message: log.timeOut ? 'Log marked as complete' : 'Log marked as incomplete' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createLog,
    getLogs,
    getLogById,
    updateLog,
    deleteLog,
    toggleLogComplete
};
