// config/roles.js
const STATUS = {
    BACKLOG: 1,
    ACTIVE: 2,
    REVIEW: 3,
    COMPLETED: 4,
};

const STATUS_MAP = {
    backlog: STATUS.BACKLOG,
    active: STATUS.ACTIVE,
    review: STATUS.REVIEW,
    completed: STATUS.COMPLETED,
};

module.exports = { STATUS, STATUS_MAP };