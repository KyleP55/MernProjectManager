import { useEffect, useState } from 'react';

import CreateProjectModal from '../components/CreateProjectModal';

const BACKEND_URL = 'http://localhost:5000';

function ProjectHub({ setProjectId }) {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [stats, setStats] = useState(null);

    // on Load
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/projects`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await res.json();

                setProjects(data);
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
                const res = await fetch(`${BACKEND_URL}/projects/${selectedProjectId}/stats`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await res.json();
                setStats(data);
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
                        <ul>
                            <li>Total Hours: {stats.totalHours}</li>
                            <li>Total Logs: {stats.totalLogs}</li>
                            <li>Daily Avg Hours: {stats.dailyAvgHours}</li>
                            <li>Completed Tasks: {stats.completedTasks}</li>
                            <li>Completed Subtasks: {stats.completedSubtasks}</li>
                        </ul>
                    ) : (
                        <p>Loading stats...</p>
                    )}
                </div>
            </>
        )}
    </div>);
}

export default ProjectHub;