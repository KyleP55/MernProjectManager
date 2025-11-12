import { useState } from 'react';
import { ROLES, ROLE_MAP } from '../util/roles';
import '../css/LandingHub.css';

import ProjectHub from '../components/ProjectHub';
import TaskHub from '../components/TaskHub';

const LandingHubPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [projectRole, setProjectRole] = useState(null);

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
            />
            <TaskHub
                projectId={selectedProjectId}
                projectRole={projectRole}
            />

        </div>
    );
};

export default LandingHubPage;
