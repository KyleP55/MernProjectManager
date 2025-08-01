const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timeIn: { type: Date, required: true },
    timeOut: { type: Date, required: true },
    notes: String,
    tasksWorkedOn: [{ type: String }],
    checklistsWorkedOn: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
