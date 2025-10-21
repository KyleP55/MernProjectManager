const User = require('../models/User.js');

const { createToken, createRefreshToken, verifyToken } = require('../utils/jwt.js');
const { setCookie, clearCookie } = require('../utils/cookies.js');

const accessTokenTime = 15; //mins
const refreshTokenTime = 60 * 24 * 7; //mins

// Register
const register = async (req, res) => {
    const { email, password, name, dob } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already used.' });

        const user = new User({ email, password, name, dob });
        await user.save();

        const token = createToken(user);
        const refreshToken = createRefreshToken(user);

        setCookie(res, 'token', token, accessTokenTime, true);
        setCookie(res, 'loggedin', 'true', refreshTokenTime, false);
        setCookie(res, 'refreshToken', refreshToken, refreshTokenTime, true);

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) return res.status(400).json({ message: 'Invalid login.' });

        const valid = await user.comparePassword(password);
        if (!valid) return res.status(400).json({ message: 'Invalid login.' });

        const token = createToken(user);
        const refreshToken = createRefreshToken(user);

        setCookie(res, 'token', token, accessTokenTime, true);
        setCookie(res, 'loggedin', 'true', refreshTokenTime, false);
        setCookie(res, 'refreshToken', refreshToken, refreshTokenTime, true);

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Refresh
const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    try {
        const payload = verifyToken(refreshToken, true);
        const user = await User.findById(payload.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        const newAccessToken = createToken(user);
        setCookie(res, 'token', newAccessToken, accessTokenTime, true);
        setCookie(res, 'loggedin', 'true', refreshTokenTime, false);
        setCookie(res, 'refreshToken', refreshToken, refreshTokenTime, true);

        res.status(200).json({ message: 'Refreshed Token' });
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

///////////////////////////// Authed Stuff //////////////////////////////

// Logout
const logout = (req, res) => {
    clearCookie(res, 'token', true);
    clearCookie(res, 'refreshToken', true);
    clearCookie(res, 'loggedin', false);

    res.status(200).json({ message: 'Logged out successfully' });
};

// Get current user
const profile = async (req, res) => {
    const safeUser = {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        provider: req.user.provider
    }
    res.json({ user: safeUser });
};

// Set Password
const setPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const account = await User.findById(req.user.id);
        if (!account) {
            return res.status(404).json({ message: 'User not found' });
        }

        account.password = password;

        if (!account.provider.includes('local')) {
            account.provider.push('local');
        }

        await account.save();
        res.status(200).json({ message: 'Password set successfully' });
    } catch (err) {
        console.error('Set Password Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const account = await User.findByIdAndDelete(req.user.id);
        if (!account) {
            return res.status(404).json({ message: 'User not found' });
        }

        clearCookie(res, 'token');
        clearCookie(res, 'refreshToken');

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete Failed:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    profile,
    setPassword,
    deleteAccount
};