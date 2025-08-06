import React, { useState } from 'react';
import '../css/CreateTaskModal.css';

const CreateTaskModal = ({ onCreate, onCancel }) => {
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

    const handleCreate = () => {
        if (!name.trim()) return alert('Task name is required.');
        onCreate({
            name,
            description,
            checklistItems,
        });
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
                    <button onClick={onCancel} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
