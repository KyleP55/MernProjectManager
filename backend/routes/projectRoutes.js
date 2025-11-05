const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectStats,
    addMember,
    editMember
} = require('../controllers/projectController');

router.route('/')
    .get(getProjects)
    .post(createProject);

router.route('/:id/stats')
    .get(getProjectStats);

router.route('/:id/member')
    .put(addMember)
    .patch(editMember);

router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
