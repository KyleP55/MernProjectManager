import React, { useEffect, useState } from 'react';
import '../css/TaskHub.css';

import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';

const BACKEND_URL = 'http://localhost:5000';

const TaskHub = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [selectedEditTask, setSelectedEditTask] = useState(null);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!projectId) {
            setTasks([]);
            return;
        }

        const fetchTasks = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/tasks?projectId=${projectId}`);
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
        };

        fetchTasks();
    }, [projectId]);

    const toggleEdit = (taskId) => {

    }

    const toggleAccordion = (taskId) => {
        setExpandedTaskId(prev => prev === taskId ? null : taskId);
    };

    const toggleCompletedChecklistItem = async (checklistId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/checklists/${checklistId}/complete`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            console.log(data)
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    }

    const handleCreateTask = (newTask) => {
        setTasks(prev => [...prev, newTask]);
    };

    const handleEditTask = (updatedTask) => {
        alert('TODO: Update Tasks');
    };

    const handleDeleteTask = (deletedTask) => {
        alert('TODO: Remove Task');
    };

    return (
        <div className="task-section">
            <div className="sidebar-header">
                <h2>Tasks</h2>
                <button onClick={() => setShowModal(true)}>New Task</button>

                {showModal && (
                    <CreateTaskModal
                        onCreate={handleCreateTask}
                        onClose={() => setShowModal(false)}
                        projectId={projectId}
                    />
                )}
            </div>

            {showEditModal && (
                <EditTaskModal
                    info={showEditModal}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onClose={() => setShowEditModal(false)}
                    projectId={projectId}
                />
            )}

            {tasks.map(task => (
                <div key={task._id} className="task-card">
                    <div className="task-header">
                        <h3>{task.name}</h3>
                        <button
                            className="edit-btn"
                            onClick={() => setShowEditModal(task)}
                        >
                            ✏️
                        </button>
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
                                        <input
                                            type="checkbox"
                                            checked={item.dateCompleted}
                                            onChange={() => toggleCompletedChecklistItem(item._id)}
                                            readOnly
                                        />
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
