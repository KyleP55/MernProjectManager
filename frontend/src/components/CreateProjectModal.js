import React, { useState } from 'react';
import '../css/CreateProjectModal.css';

const BACKEND_URL = 'http://localhost:5000';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Project name is required.');
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to create project');
            const created = await res.json();
            onProjectCreated(created);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Something went wrong.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Create New Project</h2>

                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={5}
                    />
                </label>

                {error && <p className="error">{error}</p>}

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-create" onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
