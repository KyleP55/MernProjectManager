const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');
const Log = require('../models/Log');

const getProjectAccess = require('../utils/projectAccess');

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
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { "members.user": req.user._id }
            ]
        });


        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        });

        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const updated = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { owner: req.user._id },
                    { members: req.user._id }
                ]
            },
            { name, description },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteProject = async (req, res) => {
    try {
        const deleted = await Project.findOneAndDelete({
            _id: req.params.id,
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getProjectStats = async (req, res) => {
    const { id: projectId } = req.params;

    try {
        const access = await getProjectAccess(projectId, req.user._id);
        if (!access) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const project = await Project.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

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
        let dailyAvgHours;
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
    if (!ms || ms <= 0) return "0.00 hr";
    const hours = ms / (1000 * 60 * 60); // convert ms → hours
    return `${hours.toFixed(2)} hr`;
}

// Add member
exports.addMember = async (req, res) => {
    try {
        const { user, role } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        //Check if user exists
        const userExists = await User.findOne({ name: user });
        if (!userExists) return res.status(404).json({ error: "User Not Found" });

        // Check if user already exists in members
        const existingMember = project.members.find(m => m.user.equals(userExists._id));

        console.log(existingMember)

        if (existingMember) {
            // Update their role
            existingMember.role = role;
        } else {
            // Add new member
            project.members.push({ user: userExists._id, role });
        }

        await project.save();

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};