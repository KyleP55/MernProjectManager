// utils/checkProjectAccess.js
const Project = require("../models/Project");
const { ROLE_MAP, ROLES } = require("./roles");

async function checkProjectAccess(projectId, userId, minRole = ROLES.VIEWER) {
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
        const err = new Error("Project not found");
        err.status = 404;
        throw err;
    }

    let roleLevel = null;

    const member = project.members.find(m => m.user.equals(userId));
    if (member && ROLE_MAP[member.role]) roleLevel = ROLE_MAP[member.role];


    if (!roleLevel || roleLevel < minRole) {
        const err = new Error("Unauthorized: insufficient permissions");
        err.status = 403;
        throw err;
    }

    return roleLevel;
}

module.exports = checkProjectAccess;
