const Log = require('../models/Log');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');

const checkIfLogging = async (req, res) => {
    try {
        const log = await Log.findOne({ owner: req.user._id, timeOut: null });
        return res.status(200).json({
            loggedIn: !!log,
            activeLog: log || null
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const startLog = async (req, res) => {
    try {
        const log = await Log.create({ owner: req.user._id, timeIn: new Date });
        return res.status(200).json({ LogId: log._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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

        if (projectId) filter.projectsWorkedOn = projectId;
        if (taskId) filter.tasksWorkedOn = taskId;
        if (checklistId) filter.checklistsWorkedOn = checklistId;

        if (startDate || endDate) {
            filter.timeIn = {};
            if (startDate) filter.timeIn.$gte = new Date(startDate);
            if (endDate) filter.timeIn.$lte = new Date(endDate);
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

const getTime = async (req, res) => {
    try {
        const { projectId, taskId, checklistId, startDate, endDate } = req.query;
        const filter = {};

        if (projectId) filter.projectsWorkedOn = projectId;
        if (taskId) filter.tasksWorkedOn = taskId;
        if (checklistId) filter.checklistsWorkedOn = checklistId;

        if (startDate || endDate) {
            filter.timeIn = {};
            if (startDate) filter.timeIn.$gte = new Date(startDate);
            if (endDate) filter.timeIn.$lte = new Date(endDate);
        }

        const logs = await Log.find(filter).sort({ timeIn: -1 });

        let totalMs = 0;

        for (const log of logs) {
            if (log.timeIn && log.timeOut) {
                totalMs += new Date(log.timeOut) - new Date(log.timeIn);
            }
        }

        res.json({ timeSpent: formatMsToTime(totalMs) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    checkIfLogging,
    startLog,
    createLog,
    getLogs,
    getLogById,
    updateLog,
    deleteLog,
    toggleLogComplete,
    getTime
};

const formatMsToTime = ms => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};