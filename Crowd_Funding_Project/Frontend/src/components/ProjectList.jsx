import React, { useEffect, useState } from "react";
import axios from 'axios';
import ProjectCard from './ProjectCard';
import '../features/project/Main.css';
import { Link } from "react-router-dom";

function ProjectList({ endpoint, isManage, isAdmin }) {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [limit, setLimit] = useState(5);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState(1);

    const handleSortFieldChange = (event) => {
        console.log(event.target.value);
        setSortField(event.target.value);
    };

    const handleFilterIconClick = () => {
        setIsFilterExpanded((prevIsFilterExpanded) => !prevIsFilterExpanded);
    };

    useEffect(() => {
        console.log("endpoint:", endpoint);
        axios.get(`http://localhost:5000/api/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                console.log("response:", response.data);
                setProjects(response.data);
            })
            .catch((error) => console.error('Error:', error));
    }, [endpoint]);

    const handleNextPage = () => {
        if (page * limit >= projects.length) return;
        setPage((nextPage) => nextPage + 1);
    };

    const handlePrevPage = () => {
        if (page === 1) return;
        setPage((prevPage) => prevPage - 1);
    };

    const sortedProjects = [...projects].sort((a, b) => {
        if (sortOrder === 1) {
            return a[sortField] > b[sortField] ? 1 : -1;
        } else {
            return a[sortField] < b[sortField] ? 1 : -1;
        }
    });

    const filteredProjects = sortedProjects;
    const paginatedProjects = filteredProjects.slice((page - 1) * limit, page * limit);

    if (!projects) return null;

    return (
        <div className='container'>
            <div className="filter-wrapper">
                <button onClick={handleFilterIconClick} className={`filter-icon ${isFilterExpanded ? 'expanded' : ''}`}>
                    <i className="material-icons">filter_list</i>
                </button>
                {isManage && <Link to="/manage/new" className="add-icon">
                    <i className="material-icons">add</i>
                </Link>}
                {isFilterExpanded && (
                    <div className="filter-options">
                        <div className='filter-option'>
                            Limit:
                            <select value={limit} onChange={(event) => setLimit(event.target.value)}>
                                <option value="2">2</option>
                                <option value="5" >5</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                        <div className='filter-option'>
                            <i className="material-icons sort">sort</i>
                            <select value={sortField} onChange={handleSortFieldChange}>
                                <option value="name">Title</option>
                                <option value="creationDate">Creation Date</option>
                            </select>
                        </div>
                        <div className='filter-option-sort'>
                            <i
                                className={`material-icons ${sortOrder === 1 ? 'active' : ''}`}
                                onClick={() => setSortOrder(1)}
                                style={{cursor: 'pointer'}}
                            >
                                arrow_upward
                            </i>
                            <i
                                className={`material-icons ${sortOrder === -1 ? 'active' : ''}`}
                                onClick={() => setSortOrder(-1)}
                                style={{cursor: 'pointer'}}

                            >
                                arrow_downward
                            </i>
                        </div>
                    </div>
                )}
            </div>

            <div className="project-list">
                {paginatedProjects.length === 0 && <h2>Lonely Page :/</h2>}
                {paginatedProjects && paginatedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} isManage={isManage} isAdmin={isAdmin} />
                ))}
            </div>
            <div className="pagenum">
                <button onClick={handlePrevPage} className='pageBtn'>&lt;</button>
                <span>
                    {page}
                </span>
                <button onClick={handleNextPage} className='pageBtn'>
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default ProjectList;