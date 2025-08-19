const express = require('express');
const {
    register,
    login,
    refresh,
    logout,
    profile,
    setPassword,
    deleteAccount
} = require('../controllers/authController.js');

const authMiddleware = require('../middleware/auth.js');
const router = express.Router();

router.route('/')
    .post(register)
    .delete(authMiddleware, deleteAccount)

router.route('/login')
    .post(login);

router.route('/refresh')
    .get(refresh);

router.route('/logout')
    .post(logout);

router.route('/profile')
    .get(authMiddleware, profile);

module.exports = router;