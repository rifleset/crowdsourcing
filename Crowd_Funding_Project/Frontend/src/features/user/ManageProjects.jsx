import React, { useEffect, useState } from 'react';
import './ManageProjects.css';
import '../project/Filter.css';
import ProjectList from '../../components/ProjectList';
import useUserStore from '../../states/userStore';
import UserCard from '../../components/UserCard';

function ManageProjects() {

    const { user } = useUserStore();
    const [endpoint, setEndpoint] = useState('projects/created');
    const [isCreator, setIsCreator] = useState(false);
    useEffect(() => {
        if (!user) return;

        if (user.accountType == 'BACKER') {
            setEndpoint('projects/pledged');
        } else if (user.accountType == 'CREATOR') {
            setEndpoint('projects/created');
            setIsCreator(true);
        } else {
            alert('You must be logged in as a creator or backer to manage projects');
        }
    }, [user]);

    return (
        <div>
            <UserCard user={user} />
            <ProjectList endpoint={endpoint} isManage={isCreator} isAdmin={false} />
        </div>
    );
}

export default ManageProjects;