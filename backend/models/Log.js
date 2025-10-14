const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeIn: { type: Date, required: true, default: Date.now },
    timeOut: { type: Date, default: null },
    notes: { type: String, default: "" },
    projectsWorkedOn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    tasksWorkedOn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    checklistsWorkedOn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checklist'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
