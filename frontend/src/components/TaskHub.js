import { useEffect, useState } from 'react';
import '../css/TaskHub.css';

import TaskLogger from './TaskLogger';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';

import { useApi } from '../util/api';
import { ROLES } from '../util/roles';
import { STATUS, STATUS_MAP } from '../util/taskStatus';
import LoadingSpinner from './LoadingSpinner';


const TaskHub = ({ projectId, projectRole }) => {
    const api = useApi();
    const [tasks, setTasks] = useState([]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!projectId) {
            setTasks([]);
            return;
        }

        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/tasks?projectId=${projectId}`);
                setTasks(res.data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
            setLoading(false);
        };

        fetchTasks();
    }, [projectId]);

    const toggleAccordion = (taskId) => {
        setExpandedTaskId(prev => prev === taskId ? null : taskId);
    };

    const toggleCompletedChecklistItem = async (checklistId) => {
        try {
            const res = await api.patch(`/checklists/${checklistId}/complete`);

            setTasks(prevTasks =>
                prevTasks.map(task => ({
                    ...task,
                    checklistItems: task.checklistItems.map(item =>
                        item._id === checklistId
                            ? { ...item, dateCompleted: res.data.checklistItem.dateCompleted }
                            : item
                    )
                }))
            );
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            alert('Failed to fetch tasks:', err);
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

    // Sorting
    const handleSort = (sort) => {
        if (sort === 'date') {
            setTasks(tasks => [...tasks].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else if (sort === 'priority') {
            setTasks(tasks => [...tasks].sort((a, b) => a.priority - b.priority));
        } else if (sort === 'status') {
            setTasks(tasks => [...tasks].sort((a, b) => STATUS_MAP[b.status] - STATUS_MAP[a.status]));
        }
    }

    return (
        <div className="task-section">
            <TaskLogger projectId={projectId} />
            {projectId && <>
                <div className="sidebar-header">
                    <h2>Tasks</h2>
                    {!loading && projectRole >= ROLES.EDITOR && <button onClick={() => setShowModal(true)}>New Task</button>}

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

                <div className='buttonRow bottomPad'>
                    <button
                        onClick={() => handleSort('date')}
                        className="greenButton"
                    >Date</button>
                    <button onClick={() => handleSort('priority')} className="greenButton">Priority</button>
                    <button onClick={() => handleSort('status')} className="greenButton">Status</button>
                </div>

                {!loading ? (tasks.length > 0 ? (tasks.map(task => (
                    <div key={task._id} className="task-card">
                        <div className="task-header">
                            <h3>{task.name}</h3>
                            <div>
                                <span>PR: {task.priority}</span>
                                {projectRole >= ROLES.EDITOR && <button
                                    className="edit-btn"
                                    onClick={() => setShowEditModal(task)}
                                >
                                    ✏️
                                </button>}
                            </div>
                        </div>
                        <p className="task-desc">{task.description}</p>
                        <div className="task-dates">
                            <span>Start: {task.date?.slice(0, 10)}</span>
                            <span>Status: {task.status}</span>
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
                                                disabled={projectRole < ROLES.EDITOR}
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
                ))) : (<h4>No Tasks Currently</h4>)) : (<LoadingSpinner />)}
            </>}
        </div>
    );
};

export default TaskHub;
