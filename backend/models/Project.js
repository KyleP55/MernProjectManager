const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        roll: {
            type: String,
            enum: ['logger', 'editor', 'admin'],
            default: 'logger'
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
