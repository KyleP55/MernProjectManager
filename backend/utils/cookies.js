function setCookie(res, name, value, mins, http) {
    res.cookie(name, value, {
        httpOnly: http,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: mins * 60 * 1000,
    });
}

function clearCookie(res, name, http) {
    res.clearCookie(name, {
        httpOnly: http,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
    });
}

module.exports = { setCookie, clearCookie };
