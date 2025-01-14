import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProjectCard.css';

function ProjectCard({ project, isManage, isAdmin }) {
    const route = isAdmin ? 'admin/project' : 'project';
    const [status, setStatus] = useState(project.status);
    const [creator, setCreator] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:5000/api/projects/${project.id}/creator`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                setCreator(response.data);
                console.log('Creator:', response.data);
            })
            .catch((error) => console.error('Error:', error));
    }, [project.id]);

    const handleDelete = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const confirmDelete = window.confirm('Are you sure you want to delete this project?');
        if (confirmDelete) {
            axios.delete(`http://localhost:5000/api/projects/${project.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    console.log('Success:', response.data);
                    window.location.reload();
                })
                .catch((error) => console.error('Error:', error));
        }
    }

    const handleRejected = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const confirmRejected = window.confirm('Are you sure you want to reject this project?');
        if (confirmRejected) {
            axios.put(`http://localhost:5000/api/admin/projects/${project.id}/reject`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    console.log('Success:', response.data);
                    setStatus(response.data.status);
                })
                .catch((error) => console.error('Error:', error));

        }
    }

    const handleAccepted = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const confirmAccepted = window.confirm('Are you sure you want to accept this project?');

        if (confirmAccepted) {
            axios.put(`http://localhost:5000/api/admin/projects/${project.id}/approve`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    console.log('Success:', response.data);
                    setStatus(response.data.status);
                })
                .catch((error) => console.error('Error:', error));
        }

    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'status-pending';
            case 'Approved':
                return 'status-approved';
            case 'Closed':
                return 'status-closed';
            case 'Rejected':
                return 'status-rejected';
            default:
                return '';
        }
    };

    return (
        <Link to={`/${route}/${project.id}`} className="project-link" >
            <div key={project.id} className="project-card">
                <img src={`http://localhost:5000/img/${project.projectPicture}`} className="card-image" />
                <div className="title-funding">
                    <h2 className="project-title">{project.name}</h2>
                    <span className={`project-status ${getStatusClass(status)}`}>{status}</span>
                </div>
                <div className="project-creator">
                    <div className="creator-wrapper">
                        {creator?.profilePicture ?
                            <img
                                src={`http://localhost:5000/img/${creator.profilePicture}`}
                                alt={creator.username}
                                className="creator-image"
                            />
                            :
                            <i className="material-icons">account_circle</i>
                        }
                        <span className='creatorLabel'>&nbsp; {creator.username}</span>
                    </div>
                </div>
                <p className="project-description">{project.description.substring(0, 100)}...</p>
                <div className="project-date-wrapper">
                    <span id="project-date">Funds:$ {project.currentFunding}/ {project.fundingGoal}</span>
                    {isManage && (
                        <div className="manage-icons">
                            <Link to={`/manage/${project.id}`} className="edit-icon">
                                <i className="material-icons">edit</i>
                            </Link>

                        </div>
                    )}
                    {isAdmin && (
                        <div className="manage-icons">
                            <div onClick={handleRejected} className="disable-icon">
                                <i
                                    style={{ cursor: 'pointer' }}
                                    className="material-icons">block</i>
                            </div>
                            <div onClick={handleAccepted} className="disable-icon">
                                <i
                                    style={{ cursor: 'pointer' }}
                                    className="material-icons">check_circle</i>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link >
    );
}

export default ProjectCard;