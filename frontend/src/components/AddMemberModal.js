import React, { useState } from "react";
import "../css/AddMemberModal.css";

const BACKEND_URL = 'http://localhost:5000';

function AddMemberModal({ onClose, projectId }) {
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("editor");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BACKEND_URL}/projects/${projectId}/addMember`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ user: query, role: role })
            });
            const data = await res.json();

            if (data.error) {
                return setError(data.error);
            }
        } catch (err) {
            console.error('Failed to fetch projects:', err);
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

                <p>{error}</p>

                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default AddMemberModal;
