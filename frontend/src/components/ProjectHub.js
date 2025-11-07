import { useEffect, useState } from 'react';
import { useApi } from '../util/api';

import MembersSection from './MembersSection';
import CreateProjectModal from '../components/CreateProjectModal';

function ProjectHub({ setProjectId }) {
    const api = useApi();
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [stats, setStats] = useState(null);

    // on Load
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };

        fetchProjects();
    }, []);

    // Fetch Selected Project Data
    useEffect(() => {
        if (!selectedProjectId) return;
        const fetchStats = async () => {
            setProjectId(selectedProjectId);
            try {
                const res = await api.get(`/projects/${selectedProjectId}/stats`);
                setStats(res.data);
                console.log(res.data)
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
    }, [selectedProjectId]);

    // Create Project
    const handleProjectCreated = (newProject) => {
        setProjects(prev => [...prev, newProject]);
        setSelectedProjectId(newProject._id);
        setProjectId(newProject._id);
    };

    // Add Memeber
    const onAddMemeber = (newMember) => {
        setProjects(projects =>
            projects.map(project =>
                project._id === selectedProjectId ?
                    newMember :
                    project
            )
        );
    }

    // Edit Member
    const onEditMember = (updatedProject) => {
        setProjects(projects => projects.map(project =>
            project._id === selectedProjectId ?
                updatedProject : project
        ))
        alert('Member Updated!');
    }

    // Delete Member
    const onDeleteMember = (updatedProject) => {
        setProjects(projects => projects.map(project =>
            project._id === selectedProjectId ?
                updatedProject : project
        ))
        alert('Member Deleted!');
    }

    const selectedProject = projects.find(p => p._id === selectedProjectId);

    return (<div className="sidebar">
        <div className="sidebar-header">
            <h2>Projects</h2>
            <button onClick={() => setShowProjectModal(true)}>New Project</button>

            {showProjectModal && (
                <CreateProjectModal
                    onClose={() => setShowProjectModal(false)}
                    onProjectCreated={handleProjectCreated}
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
                    <h3>Description</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{selectedProject.description || 'No description provided.'}</p>
                </div>

                <div className="card">
                    <h3>Stats</h3>
                    {stats ? (
                        <ul className="stats-list">
                            <li><span className="label">Total Hours:</span><span className="value">{stats.totalHours}</span></li>
                            <li><span className="label">Total Logs:</span><span className="value">{stats.totalLogs}</span></li>
                            <li><span className="label">Daily Avg Hours:</span><span className="value">{stats.dailyAvgHours}</span></li>
                            <li><span className="label">Completed Tasks:</span><span className="value">{stats.completedTasks}/{stats.totalTasks}</span></li>
                            <li><span className="label">Completed Subtasks:</span><span className="value">{stats.completedChecklistItems}/{stats.totalChecklist}</span></li>
                        </ul>
                    ) : (
                        <p>Loading stats...</p>
                    )}
                </div>

                <MembersSection
                    members={selectedProject.members}
                    projectId={selectedProjectId}
                    onAddMember={onAddMemeber}
                    onEditMember={onEditMember}
                    onDeleteMember={onDeleteMember}
                />
            </>
        )}
    </div>);
}

export default ProjectHub;