import React, { useState, useEffect } from 'react';
import '../css/CreateTaskModal.css';

const BACKEND_URL = 'http://localhost:5000';

const EditTaskModal = ({ info, onEdit, onClose, onDelete, projectId }) => {
    const [name, setName] = useState(info.name);
    const [description, setDescription] = useState(info.description);
    const [checklistInput, setChecklistInput] = useState('');
    const [checklistItems, setChecklistItems] = useState(info.checklistItems);

    useEffect(() => {
        setName(info.name);
        setDescription(info.description);
        setChecklistItems(info.checklistItems);
    }, [info]);

    const handleAddChecklistItem = () => {
        if (checklistInput.trim()) {
            setChecklistItems(prev => [...prev, { description: checklistInput.trim() }]);
            setChecklistInput('');
        }
    };

    const handleDeleteChecklistItem = (index) => {
        setChecklistItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleEdit = async () => {
        if (!name.trim()) return alert('Task name is required.');

        try {
            const res = await fetch(`${BACKEND_URL}/tasks/${info._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    checklist: checklistItems
                }),
            });
            console.log(checklistItems)

            if (!res.ok) throw new Error('Failed to create project');
            const created = await res.json();

            onEdit({
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

    const handleDelete = async () => {

    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Task</h2>

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
                            {item.description}{item.dateCompleted ? "yes" : "no"}
                            <button onClick={() => handleDeleteChecklistItem(index)}>Delete</button>
                        </li>
                    ))}
                </ul>

                <div className="modal-actions">
                    <button onClick={handleEdit} className="create-btn">Update</button>
                    <button onClick={handleDelete} className="delete-btn">Delete</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
