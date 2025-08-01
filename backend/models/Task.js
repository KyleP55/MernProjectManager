const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    date: { type: Date, default: Date.now },
    completedDate: { type: Date, default: null },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
