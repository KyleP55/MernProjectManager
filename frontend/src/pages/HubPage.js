import React, { useEffect, useState } from 'react';
import '../css/LandingHub.css';

import ProjectHub from '../components/ProjectHub';
import TaskHub from '../components/TaskHub';

const LandingHubPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState('');

    function onSelectedProject(id) {
        console.log(selectedProjectId)
        setSelectedProjectId(id);
    }

    return (
        <div className="hub-container">

            <ProjectHub setProjectId={onSelectedProject} />
            <TaskHub projectId={selectedProjectId} />

        </div>
    );
};

export default LandingHubPage;
