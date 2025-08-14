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
    .delete(deleteAccount, authMiddleware)

router.route('/login')
    .post(login);

router.route('/refresh')
    .post(refresh);

router.route('/logout')
    .post(logout);

router.route('/profile')
    .get(profile, authMiddleware);

module.exports = router;