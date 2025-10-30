// config/roles.js
const ROLES = {
    VIEWER: 1,
    EDITOR: 2,
    OWNER: 3,
};

const ROLE_MAP = {
    viewer: ROLES.VIEWER,
    editor: ROLES.EDITOR,
    owner: ROLES.OWNER,
};

module.exports = { ROLES, ROLE_MAP };
