import React, { useEffect, useState } from 'react';
import '../css/TaskHub.css';

import TaskLogger from './TaskLogger';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';

const BACKEND_URL = 'http://localhost:5000';

const TaskHub = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
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

            setTasks(prevTasks =>
                prevTasks.map(task => ({
                    ...task,
                    checklistItems: task.checklistItems.map(item =>
                        item._id === checklistId
                            ? { ...item, dateCompleted: data.checklistItem.dateCompleted }
                            : item
                    )
                }))
            );
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    }

    const handleCreateTask = (newTask) => {
        setTasks(prev => [...prev, newTask]);
    };

    const handleEditTask = (updatedTask) => {
        setTasks(prev => prev.map(task =>
            task._id === updatedTask._id
                ? updatedTask
                : task
        ));
    };

    const handleDeleteTask = (deletedTaskId) => {
        setTasks(prev => prev.filter((val) => val._id !== deletedTaskId));
    };

    return (
        <div className="task-section">
            {projectId && <>
                <TaskLogger tasks={tasks} />
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
                                                checked={!!item.dateCompleted}
                                                onChange={() => toggleCompletedChecklistItem(item._id)}
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
            </>}
        </div>
    );
};

export default TaskHub;
