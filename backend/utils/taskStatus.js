// config/roles.js
const STATUS = {
    BACKLOG: 1,
    ACTIVE: 2,
    REVIEW: 3,
    COMPLETED: 4,
};

const STATUS_MAP = {
    Backlog: STATUS.BACKLOG,
    Active: STATUS.ACTIVE,
    Review: STATUS.REVIEW,
    Completed: STATUS.COMPLETED,
};

module.exports = { STATUS, STATUS_MAP };