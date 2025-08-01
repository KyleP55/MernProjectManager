const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const checklistSchema = new Schema({
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    dateCompleted: { type: Date, default: null },
    taskId: { type: Types.ObjectId, ref: 'Task' },
    projectId: { type: Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = mongoose.model('Checklist', checklistSchema);
