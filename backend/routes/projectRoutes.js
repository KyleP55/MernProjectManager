const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectStats,
    addMember
} = require('../controllers/projectController');

router.route('/')
    .get(getProjects)
    .post(createProject);

router.route('/:id/stats')
    .get(getProjectStats);

router.route('/:id/addMember')
    .put(addMember);

router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
