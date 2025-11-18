import { useState } from "react";
import "../css/MembersSection.css";

import AddMemberModal from './AddMemberModal';
import EditMemberModal from "./EditMemberModal";

import LoadingSpinner from "./LoadingSpinner";
import { ROLES } from "../util/roles";

export default function MembersSection({ members, projectId, projectRole, onAddMember, onEditMember, onDeleteMember }) {
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(members);

    const onOpenEditMember = (member) => {
        setSelectedMember(member);
        setShowEditMemberModal(true);
    }

    return (
        <div className="members-section">
            <div className="members-header">
                <h2>Members</h2>
                {projectRole >= ROLES.ADMIN &&
                    <button className="add-btn" onClick={() => setShowAddMemberModal(true)}>
                        Add Member
                    </button>
                }
            </div>

            <div className="members-list">
                {showAddMemberModal && (
                    <AddMemberModal
                        onClose={() => setShowAddMemberModal(false)}
                        projectId={projectId}
                        onAddMember={onAddMember}
                    />
                )}
                {showEditMemberModal && (
                    <EditMemberModal
                        member={selectedMember}
                        onClose={() => setShowEditMemberModal(false)}
                        projectId={projectId}
                        onEditMember={onEditMember}
                        onDeleteMember={onDeleteMember}
                    />
                )}
                {members.length > 0 ? (
                    members.map((member) => (
                        <div key={member._id} className="member-row">
                            <div className="member-info">
                                <span className="member-name">{member.user ? member.user.name : 'Account Deleted'}</span>
                                <span className="member-role">{member.role}</span>
                            </div>
                            {projectRole >= ROLES.ADMIN &&
                                <button
                                    className="edit-btn"
                                    onClick={() => onOpenEditMember(member)}
                                >
                                    Edit
                                </button>
                            }
                        </div>
                    ))
                ) : (
                    <p className="no-members">No members yet.</p>
                )}
            </div>
        </div>
    );
}
