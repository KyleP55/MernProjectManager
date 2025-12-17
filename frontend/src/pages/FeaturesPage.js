import "../css/features.css";

export default function FeaturesPage() {

    return (<div className="features-container">
        <a href='/'>Back to Home</a>
        <section className="features-section">
            <h2>Core Features</h2>
            <ul>
                <li>User authentication with secure login and encrypted password storage</li>
                <li>Create and manage projects, tasks, and subtasks</li>
                <li>Clock in/out time tracking with contextual logging and notes</li>
                <li>Project statistics displaying duration, total time spent, and completion metrics</li>
            </ul>
        </section>


        <section className="features-section">
            <h2>Collaboration & Access Control</h2>
            <ul>
                <li>Add team members to projects with role-based permissions</li>
                <li>Defined roles including Viewer, Logger, Editor, Admin, and Owner</li>
                <li>Frontend UI elements conditionally rendered based on user authorization</li>
                <li>Backend authorization checks enforced on all protected API routes</li>
            </ul>
        </section>


        <section className="features-section">
            <h2>Data & Insights</h2>
            <ul>
                <li>Aggregated project stats showing days active and total logged time</li>
                <li>Task and subtask completion tracking for progress visibility</li>
            </ul>
        </section>


        <section className="features-section">
            <h2>Planned Enhancements</h2>
            <ul className="upcoming">
                <li>User account page for profile and preference management</li>
                <li>Analytics dashboard to break down logs and visualize time allocation</li>
            </ul>
        </section>


        <section className="features-section learnings">
            <h2>What I Learned</h2>
            <ul>
                <li>Designing role-based access control across frontend and backend</li>
                <li>Modeling relational data for projects, tasks, subtasks, and logs</li>
                <li>Building time-tracking workflows with meaningful analytics</li>
            </ul>
        </section>
    </div>
    );
}