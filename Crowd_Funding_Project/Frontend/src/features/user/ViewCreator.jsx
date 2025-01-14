import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageProjects.css';
import '../project/Filter.css';
import ProjectList from '../../components/ProjectList';
import useUserStore from '../../states/userStore';
import UserCard from '../../components/UserCard';
import { useParams } from 'react-router-dom';

function ViewCreator() {
    const { id } = useParams();
    const endpoint = 'projects/user/' + id;
    const [creator, setCreator] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`http://localhost:5000/api/users/id/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log('Success:', response.data);
                setCreator(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    return (
        <div>
            <UserCard user={creator} />
            <ProjectList endpoint={endpoint} isManage={false} isAdmin={false} />
        </div>
    );
}


export default ViewCreator;