const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');
const Log = require('../models/Log');

const getProjectAccess = require('../utils/projectAccess');
const { ROLES, ROLE_MAP } = require('../utils/roles');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({
            name,
            description,
            members: [{
                role: 'owner',
                user: req.user._id
            }]
        });
        await project.save();
        await project.populate('members.user', 'name');
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { "members.user": req.user._id }
            ]
        }).populate('members.user', 'name');

        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const access = await getProjectAccess(req.params.id, req.user._id);

        const project = await Project.findById(req.params.id)
            .populate('members.user', 'name');

        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const access = await getProjectAccess(req.params.id, req.user._id, ROLES.ADMIN);

        const { name, description } = req.body;

        const updated = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            { name, description },
            { new: true }
        ).populate('members.user', 'name');

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
        const access = await getProjectAccess(req.params.id, req.user._id, ROLES.OWNER);

        const deleted = await Project.findOneAndDelete({
            _id: req.params.id,
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


        const projectObjectId = new mongoose.Types.ObjectId(projectId);

        const [taskStats] = await Task.aggregate([
            { $match: { projectId: projectObjectId } },
            {
                $group: {
                    _id: null,
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: { $cond: [{ $ne: ["$completedDate", null] }, 1, 0] }
                    }
                }
            }
        ]);

        const completedChecklistItems = await Checklist.countDocuments({
            projectId,
            dateCompleted: { $ne: null }
        });

        const [checklistStats] = await Checklist.aggregate([
            { $match: { projectId: projectObjectId } },
            {
                $group: {
                    _id: null,
                    totalCheckListItems: { $sum: 1 },
                    completedCheckListItems: {
                        $sum: { $cond: [{ $ne: ["$dateCompleted", null] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            totalHours,
            totalLogs,
            dailyAvgHours,
            completedTasks: taskStats?.completedTasks || 0,
            completedChecklistItems: checklistStats?.completedCheckListItems || 0,
            totalTasks: taskStats?.totalTasks || 0,
            totalChecklist: checklistStats?.totalCheckListItems || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err.message)
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
        const access = await getProjectAccess(req.params.id, req.user._id, ROLES.ADMIN);

        const { user, role } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        //Check if user exists
        const userExists = await User.findOne({
            name: { $regex: `^${user}$`, $options: "i" }
        });
        if (!userExists) return res.status(404).json({ error: "User Not Found" });

        // Check if user already exists in members
        const existingMember = project.members.find(m => m.user.equals(userExists._id));

        if (existingMember) return res.status(409).json({ error: "User already a member." });

        project.members.push({ user: userExists._id, role });

        let newProject = await project.save();
        newProject = await newProject.populate('members.user', 'name');

        res.json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Edit Members
exports.editMember = async (req, res) => {
    try {
        const accessLevel = await getProjectAccess(req.params.id, req.user._id, ROLES.ADMIN);

        const { userId, newRole } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        //Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ error: "User Not Found" });

        const member = project.members.find(m => m.user.equals(userId));
        if (!member) return res.status(404).json({ error: "Member not found" });

        if (ROLE_MAP[member.role] > accessLevel) return res.status(401).json({ error: 'Unauthorized to edit this member' });

        member.role = newRole;

        const updatedProject = await project.save();
        await updatedProject.populate('members.user', 'name');

        res.json(updatedProject);

    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}

// Delete Member
exports.deleteMember = async (req, res) => {
    try {
        const accessLevel = await getProjectAccess(req.params.id, req.user._id, ROLES.ADMIN);

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const member = project.members.find(m => m.user.equals(req.params.userId));
        if (!member) return res.status(404).json({ error: "Member not found" });

        if (ROLE_MAP[member.role] > accessLevel) return res.status(401).json({ error: 'Unauthorized to delete this member' });

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { $pull: { members: { user: req.params.userId } } },
            { new: true }
        ).populate('members.user', 'name');

        res.json(updatedProject)
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}

exports.transferOwnership = async (req, res) => {
    try {
        const accessLevel = await getProjectAccess(req.params.id, req.user._id, ROLES.OWNER);

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        const newOwner = project.members.find(m => m.user.equals(req.params.userId));

        const oldOwner = project.members.find(m => m.user.equals(req.user._id));
        if (!oldOwner || !newOwner) return res.status(404).json({ error: "Member not found" });

        newOwner.role = 'owner';
        oldOwner.role = 'admin';

        const updatedProject = await project.save();

        await updatedProject.populate('members.user', 'name');

        res.json(updatedProject)
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}