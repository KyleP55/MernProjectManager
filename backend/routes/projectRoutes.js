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
    editMember,
    deleteMember
} = require('../controllers/projectController');

router.route('/')
    .get(getProjects)
    .post(createProject);

router.route('/:id/stats')
    .get(getProjectStats);

router.route('/:id/member')
    .put(addMember)
    .patch(editMember);

router.route('/:id/member/delete/:userId')
    .delete(deleteMember);

router.route('/:id')
    .get(getProjectById)
    .patch(updateProject)
    .delete(deleteProject);

module.exports = router;
