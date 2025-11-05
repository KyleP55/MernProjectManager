// config/roles.js
const ROLES = {
    VIEWER: 1,
    EDITOR: 2,
    ADMIN: 3,
    OWNER: 4,
};

const ROLE_MAP = {
    viewer: ROLES.VIEWER,
    editor: ROLES.EDITOR,
    admin: ROLES.ADMIN,
    owner: ROLES.OWNER,
};

module.exports = { ROLES, ROLE_MAP };
