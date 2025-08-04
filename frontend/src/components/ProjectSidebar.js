import React, { useEffect, useState } from 'react';

const LandingHubPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/projects');
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProjectId) return;

        const fetchStats = async () => {
            try {
                const res = await fetch(`/projects/${selectedProjectId}/stats`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
    }, [selectedProjectId]);

    const handleCreateProject = async () => {
        const name = prompt('Enter project name:');
        if (!name) return;

        try {
            const res = await fetch('/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            const newProject = await res.json();
            setProjects(prev => [...prev, newProject]);
            setSelectedProjectId(newProject._id);
        } catch (err) {
            console.error('Failed to create project:', err);
        }
    };

    const selectedProject = projects.find(p => p._id === selectedProjectId);

    return (
        <div className="flex min-h-screen bg-gray-50 p-6">
            <div className="w-full md:w-1/2 pr-6 space-y-6 border-r border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <button
                        onClick={handleCreateProject}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        New Project
                    </button>
                </div>

                <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>

                {selectedProject && (
                    <>
                        <div className="bg-white p-4 shadow rounded">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p>{selectedProject.description || 'No description provided.'}</p>
                        </div>

                        <div className="bg-white p-4 shadow rounded">
                            <h3 className="text-lg font-semibold mb-2">Stats</h3>
                            {stats ? (
                                <ul className="space-y-1">
                                    <li>Total Hours: {stats.totalHours}</li>
                                    <li>Total Logs: {stats.totalLogs}</li>
                                    <li>Daily Avg Hours: {stats.avgDailyHours}</li>
                                    <li>Completed Tasks: {stats.completedTasks}</li>
                                    <li>Completed Subtasks: {stats.completedSubtasks}</li>
                                </ul>
                            ) : (
                                <p>Loading stats...</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="flex-1 p-4">
                {/* Placeholder for additional widgets or content */}
                <h2 className="text-xl font-semibold mb-4">Project Dashboard</h2>
                <p>Select a project to see more data or begin working.</p>
            </div>
        </div>
    );
};

export default LandingHubPage;
