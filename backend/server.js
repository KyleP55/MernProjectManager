require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mernProjectManager';

app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());

// routes
const authMiddleware = require('./middleware/auth.js');
const projectRoutes = require('./routes/projectRoutes.js');
const tasksRoutes = require('./routes/taskRoutes.js');
const checklistRoutes = require('./routes/checklistRoutes.js');
const logRoutes = require('./routes/logRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

app.use('/auth', userRoutes);
app.use(authMiddleware);
app.use('/projects', projectRoutes);
app.use('/tasks', tasksRoutes);
app.use('/checklists', checklistRoutes);
app.use('/logs', logRoutes);

// mongo/server
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(MONGO_URI, {
        dbName: "projectManager",
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('MongoDB connected');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => {
            console.error('MongoDB connection failed:', err.message);
        });
}

module.exports = app;