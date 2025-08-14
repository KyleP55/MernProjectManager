import React, { useState, useEffect } from 'react';

import "../css/TaskLogger.css"

const BACKEND_URL = 'http://localhost:5000';

const TaskLogger = ({ projectId, tasks, onLogSaved }) => {
    const [isLogging, setIsLogging] = useState(false);
    const [logStartTime, setLogStartTime] = useState(null);

    // Clock-out modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState('');
    const [selectedChecklistItems, setSelectedChecklistItems] = useState([]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        // Optional: restore last-used selections from localStorage
        const lastTask = localStorage.getItem('lastTaskId');
        const lastChecklist = JSON.parse(localStorage.getItem('lastChecklistIds') || '[]');
        if (lastTask) setSelectedTask(lastTask);
        if (lastChecklist) setSelectedChecklistItems(lastChecklist);
    }, []);

    const handleClockIn = () => {
        setIsLogging(true);
        setLogStartTime(new Date());
    };

    const handleClockOut = () => {
        setShowModal(true); // Always prompt
    };

    const handleSaveLog = async (skipDetails = false) => {
        const endTime = new Date();
        const logData = {
            projectId,
            startTime: logStartTime,
            endTime,
            taskId: skipDetails ? null : selectedTask || null,
            checklistItemIds: skipDetails ? [] : selectedChecklistItems,
            notes: skipDetails ? '' : notes
        };

        try {
            const res = await fetch(`${BACKEND_URL}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            });

            if (!res.ok) throw new Error('Failed to save log');
            const savedLog = await res.json();

            // Remember last-used selections
            if (!skipDetails) {
                localStorage.setItem('lastTaskId', selectedTask);
                localStorage.setItem('lastChecklistIds', JSON.stringify(selectedChecklistItems));
            }

            setIsLogging(false);
            setShowModal(false);
            setSelectedChecklistItems([]);
            setNotes('');

            if (onLogSaved) onLogSaved(savedLog);
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
