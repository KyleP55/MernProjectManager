const express = require('express');
const router = express.Router();
const {
    createChecklistItem,
    getChecklistItem,
    getManyChecklistItems,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistCompletion
} = require('../controllers/checklistController');

router.post('/', createChecklistItem);
router.get('/', getManyChecklistItems);
router.get('/:id', getChecklistItem);
router.put('/:id', updateChecklistItem);
router.delete('/:id', deleteChecklistItem);
router.patch('/:id/complete', toggleChecklistCompletion);

module.exports = router;
