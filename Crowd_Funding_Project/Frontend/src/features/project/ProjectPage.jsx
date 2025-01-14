import React, { useEffect, useState } from 'react';
import './ProjectPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import useUserStore from '../../states/userStore';
import ExpandedProject from '../../components/ExpandedProject';
import axios from 'axios';

function ProjectPage({ isView }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [creator, setCreator] = useState(null);
    const [newUpdate, setNewUpdate] = useState('');
    const token = localStorage.getItem('token');
    const { user } = useUserStore();
    const [isBacker, setIsBacker] = useState(false);

    useEffect(() => {
        if (!user) return;
        if (user.accountType == 'BACKER') {
            setIsBacker(true);
        }


        axios.get(`http://localhost:5000/api/projects/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log('Success:', response.data);
                setProject(response.data);
            })
            .catch(error => console.error('Error:', error));

        axios.get(`http://localhost:5000/api/projects/${id}/creator`, {
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
    }, [id, user]);

    const handleUpdateChange = (event) => {
        setNewUpdate(event.target.value);
    };

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        if (!user) return alert('You must be logged in to send updates');
        if (!newUpdate.trim()) return alert('Update cannot be empty');

        axios.post(`http://localhost:5000/api/projects/${id}/update`, newUpdate, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log('Success sending update:', response.data);
                setProject(prevProject => ({
                    ...prevProject,
                    notifications: response.data.notifications,
                }));
                setNewUpdate('');
            })
            .catch(error => console.error('Error:', error));
    };

    const toggleFunding = () => {
        const confirmToggle = window.confirm(`Are you sure you want to ${project.status === 'Closed' ? 'open' : 'close'} funding?`);
        if (confirmToggle) {
            const endpoint = project.status === 'Closed' ? 'open-funding' : 'close-funding';
            axios.put(`http://localhost:5000/api/projects/${id}/${endpoint}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log('Success:', response.data);
                    setProject(prevProject => ({
                        ...prevProject,
                        status: project.status === 'Closed' ? 'Approved' : 'Closed',
                    }));
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const handleFundProject = () => {
        navigate(`/projects/${id}/fund`);
    };

    if (!project || !creator) return <div>Loading...</div>;

    return (
        <div className="project-page">
            <ExpandedProject project={project} />
            {!isView && user.id === creator.id && project.status !== 'Rejected' && project.status !== 'Pending' && (
                <button onClick={toggleFunding} className="toggle-funding-btn">
                    {project.status === 'Closed' ? 'Open Funding' : 'Close Funding'}
                </button>
            )}
            {isBacker && project.status == 'Approved' && (
                <button onClick={handleFundProject} className="fund-project-btn">
                    Fund Project
                </button>
            )}
            <div className="updates-section">
                {!isView && user.id === creator.id && (
                    <>
                        <h3>Send Updates:</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            <textarea
                                value={newUpdate}
                                onChange={handleUpdateChange}
                                placeholder="Write an update..."
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </>
                )}
                {project.notifications.length > 0 &&
                    <div className="updates-list">
                        <h3>Updates:</h3>
                        <ul>
                            {project.notifications.map((update, index) => {
                                const [timestamp, message] = update.split(';');
                                return (
                                    <li key={index}>
                                        <span className="update-timestamp">{timestamp}: </span>
                                        <span className="update-message">{message?.trim()}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
}

export default ProjectPage;