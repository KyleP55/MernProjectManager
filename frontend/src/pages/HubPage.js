import { useState } from 'react';
import { ROLES, ROLE_MAP } from '../util/roles';
import '../css/LandingHub.css';

import ProjectHub from '../components/ProjectHub';
import TaskHub from '../components/TaskHub';

const LandingHubPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [projectRole, setProjectRole] = useState(null);
    const [refreshStats, setRefreshStats] = useState(0);
    const [refreshProjects, setRefreshProjects] = useState(0);

    const setEnum = (role) => {
        if (ROLE_MAP[role]) setProjectRole(ROLE_MAP[role]);
        console.log(ROLE_MAP[role])
    }

    return (
        <div className="hub-container">

            <ProjectHub
                setProjectId={setSelectedProjectId}
                setProjectRole={setEnum}
                projectRole={projectRole}
                refreshStats={refreshStats}
                refreshProjects={() => setRefreshProjects(prev => prev + 1)}
            />
            <TaskHub
                projectId={selectedProjectId}
                projectRole={projectRole}
                refreshStats={() => setRefreshStats(prev => prev + 1)}
                refreshProjects={refreshProjects}
            />

        </div>
    );
};

export default LandingHubPage;
