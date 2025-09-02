const Project = require("../models/Project");

async function getProjectAccess(projectId, userId) {
    const project = await Project.findById(projectId);
    if (!project) return null;

    if (project.owner.equals(userId)) return "owner";

    const member = project.members.find(m => m.user.equals(userId));
    if (member) return member.role;

    return null;
}

module.exports = getProjectAccess;