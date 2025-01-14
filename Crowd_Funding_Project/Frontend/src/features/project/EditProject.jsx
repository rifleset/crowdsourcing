import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserStore from '../../states/userStore';
import axios from 'axios';
import './EditProject.css'; // You might want to create a separate CSS file for the EditProjectPage

function EditProject({ isCreate }) {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fundingGoal, setFundingGoal] = useState('');
    const [projectPicture, setProjectPicture] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { user } = useUserStore();

    useEffect(() => {
        if (!isCreate) {
            axios.get(`http://localhost:5000/api/projects/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    const data = response.data;
                    setProject(data);
                    setName(data.name);
                    setDescription(data.description);
                    setFundingGoal(data.fundingGoal);

                })
                .catch(error => console.error('Error:', error));
        }
    }, [id, isCreate, navigate, token, user]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleFundingGoalChange = (event) => {
        setFundingGoal(event.target.value);
    };

    const handleImageChange = (event) => {
        setProjectPicture(URL.createObjectURL(event.target.files[0]));
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name.trim() || !description.trim() || !fundingGoal.toString().trim()) {
            alert('Please fill out all fields');
            return;
        }
        // Create a new FormData object
        const formData = new FormData();
        formData.append('json', new Blob([JSON.stringify({ name, description, fundingGoal })], { type: 'application/json' }));
        if (selectedImage) {
            formData.append('file', selectedImage);
        }

        const method = isCreate ? 'post' : 'put';
        const url = isCreate ? 'http://localhost:5000/api/projects' : `http://localhost:5000/api/projects/${id}`;
        console.log('icCreate:', isCreate);
        console.log('method:', method);
        console.log('token:', token);
        axios({
            method: method,
            url: url,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: !isCreate ? { name, description, fundingGoal }
                : formData,
        })
            .then(response => {
                console.log('Success:', response.data);
                alert('Successful');
                // send back to the project page
                // navigate('/');
            })
            .catch(error => console.error('Error:', error));
    };

    if (!isCreate && !project) return null;

    return (
        <div className="edit-project-page">
            <form onSubmit={handleSubmit} className="edit-project-form">
                <label className="edit-project-img">
                    <img src={projectPicture || (!isCreate && `http://localhost:5000/img/${project.projectPicture}`)} alt={project?.name || 'Insert image here'} className="edit-project-image" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="edit-project-input" hidden={isCreate ? false : true} />
                </label>
                <label className="edit-project-label">
                    Name:
                </label>
                <input type="text" value={name} onChange={handleNameChange} className="edit-project-input" placeholder='Name' />
                <label className="edit-project-label">
                    Description:
                </label>
                <textarea value={description} onChange={handleDescriptionChange} className="edit-project-textarea" placeholder='Description' />
                <label className="edit-project-label">
                    Funding Goal:
                </label>
                <input type="number" value={fundingGoal} onChange={handleFundingGoalChange} className="edit-project-input" placeholder='Funding Goal' />
                <button type="submit" className="edit-project-button">Save</button>
            </form>
        </div>
    );
}

export default EditProject;