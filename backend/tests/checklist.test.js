const request = require('supertest');
const app = require('../server');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');
const Log = require('../models/Log');

describe('Checklist API - Complete logic', () => {
    let project;
    let task;
    let log;

    beforeEach(async () => {
        project = await Project.create({
            name: 'Test Project',
            description: 'Project with task with checklist'
        });

        task = await Task.create({
            name: 'Test Task',
            description: 'Task with checklist',
            projectId: project._id,
        });

        await Checklist.insertMany([
            { description: 'Item 1', taskId: task._id, projectId: project._id },
            { description: 'Item 2', taskId: task._id, projectId: project._id },
        ]);
    });

    it('should complete task if all checklist items are completed', async () => {
        const checklistItems = await Checklist.find({ taskId: task._id });

        // Complete both checklist items
        for (const item of checklistItems) {
            await request(app).patch(`/checklists/${item._id}/complete`);
        }

        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.completedDate).not.toBeNull();
    });

    it('should uncomplete task if one item is unchecked again', async () => {
        const checklistItems = await Checklist.find({ taskId: task._id });

        // First complete both
        for (const item of checklistItems) {
            await request(app).patch(`/api/checklists/${item._id}/complete`);
        }

        // Then uncheck one
        await request(app).patch(`/api/checklists/${checklistItems[0]._id}/complete`);

        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.completedDate).toBeNull();
    });
});
