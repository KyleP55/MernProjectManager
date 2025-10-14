const express = require('express');
const {
    checkIfLogging,
    createLog,
    startLog,
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
router.post('/start', startLog);
router.get('/checkIfLogging', checkIfLogging);
router.get('/getTime', getTime)
router.get('/:id', getLogById);
router.patch('/:id', updateLog);
router.delete('/:id', deleteLog);
router.patch('/:id/complete', toggleLogComplete);

module.exports = router;
