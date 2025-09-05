import { useState } from "react";
import "../css/MembersSection.css";

import AddMemberModal from './AddMemberModal';

export default function MembersSection({ members, projectId, onAddMember, onEditMember }) {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    return (
        <div className="members-section">
            <div className="members-header">
                <h2>Members</h2>
                <button className="add-btn" onClick={() => setShowAddMemberModal(true)}>
                    Add Member
                </button>
            </div>

            <div className="members-list">
                {showAddMemberModal && (
                    <AddMemberModal
                        onClose={() => setShowAddMemberModal(false)}
                        projectId={projectId}
                    />
                )}
                {members.length > 0 ? (
                    members.map((member) => (
                        <div key={member._id} className="member-row">
                            <div className="member-info">
                                <span className="member-name">{member.user.name}</span>
                                <span className="member-role">{member.role}</span>
                            </div>
                            <button
                                className="edit-btn"
                                onClick={() => onEditMember(member)}
                            >
                                Edit
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-members">No members yet.</p>
                )}
            </div>
        </div>
    );
}
