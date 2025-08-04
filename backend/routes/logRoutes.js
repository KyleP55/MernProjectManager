const express = require('express');
const {
    createLog,
    getLogs,
    getLogById,
    updateLog,
    deleteLog,
    toggleLogComplete,
    getTime
} = require('../controllers/logController.js');

const router = express.Router();

router.post('/', createLog);
router.get('/', getLogs);
router.get('/getTime', getTime)
router.get('/:id', getLogById);
router.put('/:id', updateLog);
router.delete('/:id', deleteLog);
router.patch('/:id/complete', toggleLogComplete);

module.exports = router;
