import { useState } from 'react';
import { useApi } from '../util/api';
import '../css/CreateTaskModal.css';


const CreateTaskModal = ({ onCreate, onClose, projectId }) => {
    const api = useApi();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(3);
    const [checklistInput, setChecklistInput] = useState('');
    const [checklistItems, setChecklistItems] = useState([]);
    const [error, setError] = useState('');

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
            const body = { name, description, projectId, checklist: checklistItems, priority };
            const res = await api.post('/tasks/', body)
            const created = await res.data;

            onCreate({
                _id: created.task._id,
                name,
                description,
                priority,
                status: 'Backlog',
                checklistItems: created.checklist,
                date: created.task.createdAt
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Something went wrong.');
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

                <label>Priority</label>
                <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>
                            {n === 1 && n + " High"}
                            {n === 5 && n + " Low"}
                            {n !== 1 && n !== 5 && n}
                        </option>
                    ))}
                </select>

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
