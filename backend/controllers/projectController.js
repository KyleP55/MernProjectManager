const Project = require('../models/Project');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');
const Log = require('../models/Log');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({ name, description, owner: req.user._id });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Project not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectStats = async (req, res) => {
    const { id: projectId } = req.params;

    try {
        // Fetch logs for this project
        const logs = await Log.find({ projectsWorkedOn: projectId });

        let totalMs = 0;
        for (const log of logs) {
            if (log.timeIn && log.timeOut) {
                totalMs += new Date(log.timeOut) - new Date(log.timeIn);
            }
        }

        const totalHours = formatDuration(totalMs);
        const totalLogs = logs.length;

        // Calculate date range for daily average
        let days = 1;
        let dailyAvgHours
        if (logs.length > 1) {
            const times = logs.map(log => new Date(log.timeIn).getTime());
            const min = Math.min(...times);
            const max = Math.max(...times);
            days = Math.max(1, Math.ceil((max - min) / (1000 * 60 * 60 * 24)));
            dailyAvgHours = formatDuration(totalMs / days);
        } else {
            dailyAvgHours = formatDuration(totalMs);
        }

        const completedTasks = await Task.countDocuments({
            projectId,
            completedDate: { $ne: null }
        });

        const completedChecklistItems = await Checklist.countDocuments({
            projectId,
            dateCompleted: { $ne: null }
        });

        res.json({
            totalHours,
            totalLogs,
            dailyAvgHours,
            completedTasks,
            completedChecklistItems
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

function formatDuration(ms) {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const hourLabel = hours === 1 ? 'hr' : 'hrs';
    const minuteLabel = minutes === 1 ? 'min' : 'mins';

    return `${hours} ${hourLabel} ${minutes} ${minuteLabel}`;
}