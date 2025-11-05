import { useState } from "react";
import { useApi } from '../util/api';
import "../css/AddMemberModal.css";

function AddMemberModal({ onClose, projectId, onAddMember }) {
    const api = useApi();
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("editor");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.put(`/projects/${projectId}/member`, { user: query, role: role });
            console.log(res.data)
            const newMember = res.data.members[res.data.members.length - 1];
            onAddMember(res.data);
            alert("Member Added!");
            onClose();
        } catch (err) {
            console.error('Failed to add member:', err.response.data.error || err.message);
            setError(err.response.data.error || err.message)
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add Member</h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="text"
                        placeholder="Search for member by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="role-select"
                    >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="logger">Logger</option>
                    </select>

                    <button type="submit" className="submit-button">
                        Add
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

export default AddMemberModal;
