import { useState, useEffect } from 'react';
import { useApi } from '../util/api';

import "../css/TaskLogger.css"

const TaskLogger = ({ projectId, onLogSaved, refreshProjects }) => {
    const api = useApi();
    const [isLogging, setIsLogging] = useState(false);
    const [currentLog, setCurrentLog] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    // Clock-out modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(projectId ? projectId : null);
    const [selectedTask, setSelectedTask] = useState('');
    const [selectedChecklistItems, setSelectedChecklistItems] = useState([]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const checkIfLogging = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);

                const res2 = await api.get('/logs/checkIfLogging');
                if (res2.data.loggedIn) {
                    setIsLogging(true);
                    setCurrentLog(res2.data.activeLog._id);
                }
            } catch (err) {
                console.error('Failed to fetch projects/logging status:', err);
            }
        };
        checkIfLogging();
    }, [refreshProjects]);

    useEffect(() => {
        const updateTasks = async () => {
            try {
                const res = await api.get(`/tasks?projectId=${projectId}`);
                setTasks(res.data);
            } catch (err) {
                alert('Failed to fetch Tasks:', err.message);
            }
        }

        if (selectedProject !== '') updateTasks();
    }, [selectedProject]);

    const handleClockIn = async () => {
        try {
            const res = await api.post('/logs/start');
            setIsLogging(true);
            setCurrentLog(res.data.LogId);
        } catch (err) {
            alert('error logging');
        }
    }

    const handleClockOut = () => {
        setShowModal(true); // Always prompt
    };

    const handleSaveLog = async (skipDetails = false) => {
        const logData = {
            timeOut: new Date(),
            projectsWorkedOn: selectedProject,
            tasksWorkedOn: skipDetails ? null : selectedTask || null,
            checklistsWorkedOn: skipDetails ? [] : selectedChecklistItems,
            notes: skipDetails ? '' : notes
        };

        try {
            const res = await api.patch(`/logs/${currentLog}`, logData);
            const savedLog = await res.data;

            // Remember last-used selections
            if (!skipDetails) {
                localStorage.setItem('lastTaskId', selectedTask);
                localStorage.setItem('lastChecklistIds', JSON.stringify(selectedChecklistItems));
            }

            setIsLogging(false);
            setShowModal(false);
            setSelectedChecklistItems([]);
            setNotes('');

            if (onLogSaved) onLogSaved();
            alert('Log Saved!');
        } catch (err) {
            console.error(err);
            alert('Error saving log.');
        }
    };

    const toggleChecklistSelection = (id) => {
        setSelectedChecklistItems(prev =>
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    return (
        <div className="task-logger">
            <div className="logger-controls">
                {!isLogging ? (
                    <button onClick={handleClockIn} className="start-btn">Clock In</button>
                ) : (
                    <button onClick={handleClockOut} className="stop-btn">Clock Out</button>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Clock Out</h2>

                        <label>Project</label>
                        <select
                            value={selectedProject}
                            onChange={e => setSelectedProject(e.target.value)}
                        >
                            <option value="">No specific project</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>

                        <label>Task</label>
                        <select
                            value={selectedTask}
                            onChange={e => setSelectedTask(e.target.value)}
                        >
                            <option value="">No specific task</option>
                            {tasks.map(task => (
                                <option key={task._id} value={task._id}>
                                    {task.name}
                                </option>
                            ))}
                        </select>

                        {selectedTask && (
                            <>
                                <label>Checklist Items</label>
                                <div className="checklist">
                                    {tasks
                                        .find(t => t._id === selectedTask)
                                        ?.checklistItems
                                        .filter(item => !item.dateCompleted)
                                        .map(item => (
                                            <div className="checklist-row" key={item._id}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedChecklistItems.includes(item._id)}
                                                    onChange={() => toggleChecklistSelection(item._id)}
                                                />
                                                <span>{item.description}</span>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}

                        <label>Notes</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Optional notes..."
                        />

                        <div className="modal-actions">
                            <button onClick={() => handleSaveLog(false)} className="start-btn">Save</button>
                            <button onClick={() => handleSaveLog(true)} className="start-btn">Skip Details</button>
                            <button onClick={() => setShowModal(false)} className="stop-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskLogger;
