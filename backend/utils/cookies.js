function setCookie(res, name, value, mins) {
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: mins * 60 * 1000,
    });
}

function clearCookie(res, name) {
    res.clearCookie(name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
}

module.exports = { setCookie, clearCookie };
