import { useState } from "react";
import { useApi } from '../util/api';
import "../css/AddMemberModal.css";

function EditMemberModal({ member, onClose, projectId, onEditMember }) {
    const api = useApi();
    const [newRole, setNewRole] = useState(member.role);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.patch(`/projects/${projectId}/member`, { userId: member.user._id, newRole: member.roll });

            console.log(res.data.members)
            onEditMember();
        } catch (err) {

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
                    </select>

                    <button type="submit" className="submit-button">
                        Update
                    </button>
                    <button type="button" className="close-button">
                        Delete
                    </button>
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