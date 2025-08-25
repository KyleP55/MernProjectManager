import React, { useState } from 'react';
import '../css/CreateTaskModal.css';

const BACKEND_URL = 'http://localhost:5000';

const CreateTaskModal = ({ onCreate, onClose, projectId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [checklistInput, setChecklistInput] = useState('');
    const [checklistItems, setChecklistItems] = useState([]);

    const handleAddChecklistItem = () => {
        if (checklistInput.trim()) {
            setChecklistItems(prev => [...prev, checklistInput.trim()]);
            setChecklistInput('');
        }
    };

    const handleDeleteChecklistItem = (index) => {
        setChecklistItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreate = async () => {
        if (!name.trim()) return alert('Task name is required.');

        try {
            const res = await fetch(`${BACKEND_URL}/tasks/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, projectId, checklist: checklistItems }),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to create project');
            const created = await res.json();

            onCreate({
                _id: created.task._id,
                name,
                description,
                checklistItems: created.checklist,
                date: created.task.createdAt
            });
            onClose();
        } catch (err) {
            console.error(err);
            //setError('Something went wrong.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create Task</h2>

                <label>Task Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label>Description</label>
                <textarea
                    rows="4"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <label>Add Checklist Item</label>
                <div className="checklist-input-row">
                    <input
                        type="text"
                        value={checklistInput}
                        onChange={e => setChecklistInput(e.target.value)}
                        placeholder="Enter checklist item"
                    />
                    <button onClick={handleAddChecklistItem}>Add</button>
                </div>

                <ul className="checklist-items">
                    {checklistItems.map((item, index) => (
                        <li key={index}>
                            {item}
                            <button onClick={() => handleDeleteChecklistItem(index)}>Delete</button>
                        </li>
                    ))}
                </ul>

                <div className="modal-actions">
                    <button onClick={handleCreate} className="create-btn">Create</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
