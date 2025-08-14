const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || "1d3gsr6jfgh675ty";
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "9fjfjf7f7fhfhf6s";

// Token
const createToken = (user) => {
    return jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '1h' }
    );
};

// Refresh Token
const createRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id.toString() },
        jwtRefreshSecret,
        { expiresIn: '7d' }
    );
};

// Verify
const verifyToken = (token, isRefresh = false) => {
    const secret = isRefresh ? jwtRefreshSecret : jwtSecret;
    return jwt.verify(token, secret);
};

module.exports = { createToken, createRefreshToken, verifyToken };
