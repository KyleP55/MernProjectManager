const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({ name, description });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
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
