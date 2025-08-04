import React, { useEffect, useState } from 'react';
import '../css/LandingHub.css';

import ProjectHub from '../components/ProjectHub';

const LandingHubPage = () => {
    const [selectedProjectId, setSelectedProjectId] = useState('');

    function onSelectedProject(id) {
        setSelectedProjectId(id);
    }

    return (
        <div className="hub-container">

            <ProjectHub setProjectId={onSelectedProject} />

            <div className="main-content">
                <h2>Project Dashboard</h2>
                <p>Select a project to see more data or begin working.</p>
            </div>
        </div>
    );
};

export default LandingHubPage;
