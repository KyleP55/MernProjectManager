import { useState } from 'react';
import { useApi } from '../util/api';
import '../css/CreateProjectModal.css';

const BACKEND_URL = 'http://localhost:5000';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
    const api = useApi();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Project name is required.');
            return;
        }

        try {
            const body = { name, description }
            const res = await api.post('/projects', body);

            onProjectCreated(res.data);
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
