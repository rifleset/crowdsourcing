// AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ProjectList from '../../components/ProjectList';
import './AdminPage.css';
import useUserStore from '../../states/userStore';
import UserList from '../../components/UserList';

function AdminPage() {
    const [activeList, setActiveList] = useState('users');
    const { user } = useUserStore();
    const navigate = useNavigate();

    return (
        <div className="admin-page">
            <nav className="admin-nav">
                <Link to="#" onClick={() => setActiveList('users')} className={activeList === 'users' ? 'active' : ''}>
                    <i className="material-icons">people</i> Users
                </Link>
                <Link to="#" onClick={() => setActiveList('projects')} className={activeList === 'projects' ? 'active' : ''}>
                    <i className="material-icons">book</i> Projects
                </Link>
            </nav>

            {activeList === 'users' && <UserList />}
            {activeList === 'projects' && <ProjectList endpoint="admin/projects" isManage={false} isAdmin={true} />}
        </div>
    );
}

export default AdminPage;