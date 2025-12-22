import { useEffect, useState } from 'react';
import { useAuth } from "../util/AuthContext";
import { useApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

import MembersSection from './MembersSection';
import CreateProjectModal from '../components/CreateProjectModal';

import { ROLES } from '../util/roles';
import LoadingSpinner from './LoadingSpinner';

function ProjectHub({ setProjectId, setProjectRole, projectRole, refreshStats, refreshProjects }) {
    const nav = useNavigate();
    const api = useApi();
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [createModal, setCreateModal] = useState(true);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // on Load
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
            setLoading(false);
        };

        fetchProjects();
    }, []);

    // Get project role
    const selectedProject = projects.find(p => p._id === selectedProjectId);
    useEffect(() => {
        if (selectedProject) {
            let role = null;

            let member = selectedProject.members.find(m => m.user._id === user._id);
            role = member?.role;
            if (role) {
                setProjectRole(role);
            } else {
                alert('TODO: add function to not display project as role is not found');
            }
        }
    }, [selectedProject]);

    // Fetch Selected Project Data
    useEffect(() => {
        if (!selectedProjectId) return;

        const fetchStats = async () => {
            setProjectId(selectedProjectId);
            try {
                const res = await api.get(`/projects/${selectedProjectId}/stats`);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
    }, [selectedProjectId, refreshStats]);

    // Projects CRUD
    const handleProjectCreated = (newProject) => {
        setProjects(prev => [...prev, newProject]);
        setSelectedProjectId(newProject._id);
        setProjectId(newProject._id);
    };

    const handleProjectEdit = (updatedProject) => {
        setProjects(prev => prev.map(project =>
            project._id === updatedProject._id ?
                updatedProject :
                project
        ));
    }

    const handleTransferOwnership = (updatedProject) => {
        setProjects(prev => prev.map(project =>
            project._id === updatedProject._id ?
                updatedProject :
                project
        ))
    }

    const deleteProjectPrompt = async () => {
        if (window.confirm("Delete this project?")) {
            try {
                const res = await api.delete(`/projects/${selectedProjectId}`);

                setProjects(prev => prev.filter(project => project._id !== selectedProjectId));
            } catch (error) {
                alert(error.response.data.error || error.message);
            }
            setSelectedProjectId('');
        }
    }

    // Update projects in task component
    useEffect(() => {
        refreshProjects();
    }, [projects]);

    // Members CRUD
    const onAddMemeber = (newMember) => {
        setProjects(projects =>
            projects.map(project =>
                project._id === selectedProjectId ?
                    newMember :
                    project
            )
        );
    }

    const onEditMember = (updatedProject) => {
        setProjects(projects => projects.map(project =>
            project._id === selectedProjectId ?
                updatedProject : project
        ))
        alert('Member Updated!');
    }

    const onDeleteMember = (updatedProject) => {
        setProjects(projects => projects.map(project =>
            project._id === selectedProjectId ?
                updatedProject : project
        ))
        alert('Member Deleted!');
    }


    return (<div className="sidebar">
        <div className="sidebar-header">
            <h2>Projects</h2>
            <button onClick={() => {
                setShowProjectModal(true);
                setCreateModal(true);
            }}>New Project</button>

            {showProjectModal && (
                <CreateProjectModal
                    onClose={() => setShowProjectModal(false)}
                    onProjectCreated={handleProjectCreated}
                    onProjectEdit={handleProjectEdit}
                    createModal={createModal}
                    data={selectedProject}
                />
            )}
        </div>

        <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
        >
            {!selectedProjectId &&
                <option value="">Select a project</option>
            }
            {projects.map(project => (
                <option key={project._id} value={project._id}>
                    {project.name}
                </option>
            ))}
        </select>

        {selectedProject && (
            <>
                <div className="card">
                    <div className="cardHeader">
                        <h3>Description</h3>
                        {projectRole >= ROLES.ADMIN &&
                            <div className="headerButtons">
                                <button onClick={() => {
                                    nav(`/logs?projectId=${selectedProjectId}`)
                                }}>View Logs</button>
                                <button onClick={() => {
                                    setShowProjectModal(true);
                                    setCreateModal(false);
                                }}>Edit</button>
                                {projectRole === ROLES.OWNER &&
                                    <button
                                        onClick={deleteProjectPrompt}
                                        className="redButton"
                                    >Delete</button>
                                }
                            </div>
                        }
                    </div>
                    <p style={{ whiteSpace: 'pre-line' }}>{selectedProject.description || 'No description provided.'}</p>
                </div>

                <div className="card">
                    <h3>Stats</h3>
                    {!loading ? (
                        stats && (
                            <ul className="stats-list">
                                <li><span className="label">Total Hours:</span><span className="value">{stats.totalHours}</span></li>
                                <li><span className="label">Total Logs:</span><span className="value">{stats.totalLogs}</span></li>
                                <li><span className="label">Daily Avg Hours:</span><span className="value">{stats.dailyAvgHours}</span></li>
                                <li><span className="label">Completed Tasks:</span><span className="value">{stats.completedTasks}/{stats.totalTasks}</span></li>
                                <li><span className="label">Completed Subtasks:</span><span className="value">{stats.completedChecklistItems}/{stats.totalChecklist}</span></li>
                            </ul>
                        )
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>

                <MembersSection
                    members={selectedProject.members}
                    projectId={selectedProjectId}
                    projectRole={projectRole}
                    onAddMember={onAddMemeber}
                    onEditMember={onEditMember}
                    onDeleteMember={onDeleteMember}
                    onTransferProject={handleTransferOwnership}
                />
            </>
        )}
    </div>);
}

export default ProjectHub;