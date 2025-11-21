import { useState, useEffect } from 'react';
import { useApi } from '../util/api';
import '../css/CreateTaskModal.css';

const statusArr = ['Backlog', 'Active', 'Review', 'Completed'];

const EditTaskModal = ({ info, onEdit, onClose, onDelete, projectId }) => {
    const api = useApi();
    const [error, setError] = useState('');
    const [name, setName] = useState(info.name);
    const [description, setDescription] = useState(info.description);
    const [priority, setPriority] = useState(info.priority);
    const [status, setStatus] = useState(info.status);
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
            const body = { name, description, checklist: checklistItems, priority, status };
            const res = await api.put(`/tasks/${info._id}`, body);
            const edited = res.data;

            onEdit({
                _id: edited.task._id,
                name,
                description,
                priority,
                status,
                checklistItems: edited.checklistItems,
                date: edited.task.date
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Something went wrong.');
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                const res = await api.delete(`/tasks/${info._id}`);
                if (res) {
                    onDelete(info._id);
                }
            } catch (err) {
                console.error(err);
            }
            onClose();
        }
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

                <div className='buttonRow'>
                    <div>
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
                    </div>

                    <div>
                        <label>Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            {statusArr.map((n, i) => (
                                <option key={i} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

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
                            {item.description}
                            <button onClick={() => handleDeleteChecklistItem(index)}>Delete</button>
                        </li>
                    ))}
                </ul>

                <div className="modal-actions">
                    <button onClick={handleEdit} className="create-btn">Update</button>
                    <button onClick={handleDeleteTask} className="delete-btn">Delete</button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
