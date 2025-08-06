import React, { useEffect, useState } from 'react';
import '../css/TaskHub.css';

import CreateTaskModal from './CreateTaskModal';

const BACKEND_URL = 'http://localhost:5000';

const TaskHub = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [showModal, setShowModal] = useState(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchTasks = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/tasks?projectId${projectId}`);
                const data = await res.json();

                setTasks(data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
        };

        fetchTasks();
    }, [projectId]);

    const toggleAccordion = (taskId) => {
        setExpandedTaskId(prev => prev === taskId ? null : taskId);
    };

    const handleCreateTask = () => {
        alert('TODO: Show create task modal or form');
    };

    return (
        <div className="">
            <div className="sidebar-header">
                <h2>Tasks</h2>
                <button onClick={() => setShowModal(true)}>New Task</button>

                {showModal && (
                    <CreateTaskModal
                        onCreate={handleCreateTask}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </div>

            {tasks.map(task => (
                <div key={task._id} className="task-card">
                    <div className="task-header">
                        <h3>{task.name}</h3>
                        <button className="edit-btn">✏️</button>
                    </div>
                    <p className="task-desc">{task.description}</p>
                    <div className="task-dates">
                        <span>Start: {task.date?.slice(0, 10)}</span>
                        <span>End: {task.dateCompleted ? task.dateCompleted?.slice(0, 10) : 'In Progress'}</span>
                    </div>

                    <button
                        className="accordion-toggle"
                        onClick={() => toggleAccordion(task._id)}
                    >
                        {expandedTaskId === task._id ? 'Hide Checklist ▲' : 'Show Checklist ▼'}
                    </button>

                    {expandedTaskId === task._id && (
                        <ul className="checklist">
                            {task.checklistItems && task.checklistItems.length > 0 ? (
                                task.checklistItems.map(item => (
                                    <li key={item._id}>
                                        <input type="checkbox" checked={item.completed} readOnly />
                                        {item.description}
                                    </li>
                                ))
                            ) : (
                                <li>No checklist items.</li>
                            )}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TaskHub;
