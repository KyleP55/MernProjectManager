const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
            type: String,
            enum: ['viewer', 'logger', 'editor', 'admin', 'owner'],
            default: 'logger'
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
