import { useState } from "react";
import { useApi } from '../util/api';
import "../css/AddMemberModal.css";

import { ROLES } from "../util/roles";

function EditMemberModal({ member, onClose, projectId, onEditMember, onDeleteMember, onTransferProject, projectRole }) {
    const api = useApi();
    const [newRole, setNewRole] = useState(member.role);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.patch(`/projects/${projectId}/member`, {
                userId: member.user._id, newRole: newRole
            });

            onEditMember(res.data);
            onClose();
        } catch (err) {
            setError(err.response.data.error || err.message);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await api.delete(`/projects/${projectId}/member/delete/${member.user._id}`);

            onDeleteMember(res.data);
            onClose();
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    const handleTransferOwnership = async () => {
        try {
            const res = await api.patch(`/projects/${projectId}/transferOwnership/${member.user._id}`);

            onTransferProject(res.data);
            onClose();
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Member</h2>
                <form onSubmit={handleSubmit} className="form">
                    <h2>{member.user.name}</h2>

                    <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="logger">Logger</option>
                        <option value="viewer">Viewer</option>
                    </select>

                    <button type="submit" className="submit-button">
                        Update
                    </button>
                    <div className="buttonRow">
                        {projectRole === ROLES.OWNER &&
                            <button type="button" className="greenButton" onClick={handleTransferOwnership}>
                                Transfer Ownership
                            </button>
                        }
                        <button type="button" className="redButton" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </form>

                <p className="error-text">{error}</p>

                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default EditMemberModal;