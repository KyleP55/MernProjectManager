import React, { useEffect, useState } from 'react';
import '../css/TaskHub.css';

const BACKEND_URL = 'http://localhost:5000';

const TaskHub = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    useEffect(() => {
        console.log(projectId)
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
        <div className="task-section">
            <div className="task-header-row">
                <h2 className="section-title">Tasks</h2>
                <button className="create-btn" onClick={handleCreateTask}>
                    + New Task
                </button>
            </div>

            {tasks.map(task => (
                <div key={task._id} className="task-card">
                    <div className="task-header">
                        <h3>{task.name}</h3>
                        <button className="edit-btn">✏️</button>
                    </div>
                    <p className="task-desc">{task.description}</p>
                    <div className="task-dates">
                        <span>Start: {task.startDate?.slice(0, 10)}</span>
                        <span>End: {task.endDate?.slice(0, 10)}</span>
                    </div>

                    <button
                        className="accordion-toggle"
                        onClick={() => toggleAccordion(task._id)}
                    >
                        {expandedTaskId === task._id ? 'Hide Checklist ▲' : 'Show Checklist ▼'}
                    </button>

                    {expandedTaskId === task._id && (
                        <ul className="checklist">
                            {task.checklist && task.checklist.length > 0 ? (
                                task.checklist.map(item => (
                                    <li key={item._id}>
                                        <input type="checkbox" checked={item.completed} readOnly />
                                        {item.title}
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
