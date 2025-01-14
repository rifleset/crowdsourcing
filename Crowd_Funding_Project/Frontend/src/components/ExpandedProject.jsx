import React, { useEffect, useState } from "react";
import useUserStore from '../states/userStore';
import axios from 'axios';
import { Link } from "react-router-dom";

function ExpandedProject({ project }) {
    const token = localStorage.getItem('token');
    const { user, updateUser } = useUserStore();
    const [creator, setCreator] = useState(null);
    const [fundings, setFundings] = useState([]);
    useEffect(() => {
        console.log('Project:', project);
        if (project) {
            axios.get(`http://localhost:5000/api/projects/${project.id}/creator`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setCreator(response.data);
                })
                .catch(error => console.error('Error:', error));

            axios.get(`http://localhost:5000/api/projects/${project.id}/fundings`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log('Success:', response.data);
                    setFundings(response.data);
                    //Create a set to find total funded amount by each username
                    const backers = new Set();
                    response.data.forEach(funding => backers.add(funding.backerName));
                    console.log('Backers:', backers);
                    //Create a new array to store the total amount funded by each backer
                    const totalAmounts = [];
                    backers.forEach(backer => {
                        let totalAmount = 0;
                        response.data.forEach(funding => {
                            if (funding.backerName === backer) {
                                totalAmount += funding.amount;
                            }
                        });
                        totalAmounts.push({ backerName: backer, amount: totalAmount });
                    });

                    setFundings(totalAmounts);
                })
                .catch(error => console.error('Error:', error));


        }

    }, [project])

    if (!project || !creator) return null;

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
    const fundingProgress = (project.currentFunding / project.fundingGoal) * 100;

    return (
        <>
            <img src={`http://localhost:5000/img/${project.projectPicture}`} alt={project.name} className="project-image" />
            <div className="title-funding">
                <h2 className="project-title">{project.name}</h2>
                <span className={`project-status ${getStatusClass(project.status)}`}>{project.status}</span>
            </div>
            <Link className="project-author navbar-link" to={`/users/${creator.id}`}>
                <div className="author-info">
                    <div className="author-wrapper">
                        {creator.profilePicture != null ?
                            <img src={`http://localhost:5000/img/${creator.profilePicture}`} alt={creator.username} className="author-image" />
                            : <i className="material-icons ">account_circle</i>}
                        <span className='authorLabel'>{creator.username}</span>
                    </div>
                </div>
                <span className="project-content">{project.category}</span>
            </Link>
            <p className="project-description">{project.description}</p>
            <div className="funding-progress">
                <h3>Funding Progress:</h3>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${fundingProgress}%` }}></div>
                </div>
                <p>${project.currentFunding} raised of ${project.fundingGoal} goal</p>
            </div>
            <div className="backers-section">

                <h3>Backers:</h3>
                {fundings.length === 0 ?
                    <p className="project-backers-null">No backers yet :(</p>
                    :
                    <ul className="backers-list">
                        {fundings.map((funding, index) => (
                            <li key={index}>
                                <span className="backer-name">{funding.backerName}</span>
                                <span className="backer-amount">Amount Pledged: ${funding.amount}</span>
                            </li>
                        ))}
                    </ul>}
            </div>
            <span className="project-date">Uploaded: {new Date(project.creationDate).toLocaleDateString()}</span>
        </>
    );
}

export default ExpandedProject;