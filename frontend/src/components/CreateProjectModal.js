import { useState } from 'react';
import { useApi } from '../util/api';
import '../css/CreateProjectModal.css';

const CreateProjectModal = ({ onClose, onProjectCreated, onProjectEdit, createModal, data }) => {
    const api = useApi();
    const [name, setName] = useState(createModal ? '' : data.name);
    const [description, setDescription] = useState(createModal ? '' : data.description);
    const [error, setError] = useState('');

    // Handles createtion and edits
    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Project name is required.');
            return;
        }

        try {
            const body = { name, description }
            let res;
            if (createModal) {
                res = await api.post('/projects', body);
                onProjectCreated(res.data);
            } else {
                res = await api.patch(`/projects/${data._id}`, body);
                onProjectEdit(res.data);
            }

            onClose();
        } catch (err) {
            console.error(err);
            setError('Something went wrong.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                {createModal ?
                    <h2>Create New Project</h2> : <h2>Edit Project</h2>}

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
                    <button className="btn-create" onClick={handleCreate}>{createModal ? 'Create' : 'Update'}</button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
