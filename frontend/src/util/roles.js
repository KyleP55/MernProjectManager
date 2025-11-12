// config/roles.js
const ROLES = {
    VIEWER: 1,
    LOGGER: 2,
    EDITOR: 3,
    ADMIN: 4,
    OWNER: 5,
};

const ROLE_MAP = {
    viewer: ROLES.VIEWER,
    logger: ROLES.LOGGER,
    editor: ROLES.EDITOR,
    admin: ROLES.ADMIN,
    owner: ROLES.OWNER,
};

module.exports = { ROLES, ROLE_MAP };