// Search.jsx
import React, { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';
import './Search.css';
import Select from 'react-select';

function Search() {
    const [projects, setProjects] = useState([]);
    const [keywords, setKeywords] = useState('');
    const [categories, setCategories] = useState('');
    const [authors, setAuthors] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/img//projects/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => setCategoriesList(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();

        const categoriesArray = categories;
        const authorsArray = authors.split(',').map(author => author.trim().length > 0 ? author.trim() : null).filter(author => author);
        // console.log(categoriesArray);
        // console.log(authorsArray.length);
        fetch('http://localhost:5000/img//projects/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keywords,
                categories: categoriesArray,
                authors: authorsArray,
                sortBy,
                sortOrder,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                setProjects(data)
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleCategoryChange = (selectedOptions) => {
        setCategories(selectedOptions.map(option => option.value));
        // console.log(categories);
    };
    const categoryOptions = categoriesList.map(category => ({ value: category, label: category }));

    return (
        <div className='container search-container'>
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="Keywords" className="search-input" />
                <input type="text" value={authors} onChange={(event) => setAuthors(event.target.value)} placeholder="Authors (comma separated)" className="search-input" />
                <Select
                    isMulti
                    name="categories"
                    options={categoryOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Categories"
                    onChange={handleCategoryChange}
                    classNames={categories.length > 0 ? 'search-select' : 'search-select-empty'}
                />
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="search-select">
                    <option value="">Sort By</option>
                    <option value="title">Title</option>
                    <option value="averageRating">Average Rating</option>
                    <option value="creationDate">Date</option>
                </select>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="search-select">
                    <option value="">Sort Order</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="project-list search-results">
                {projects.length === 0 && <h2 className="no-results">No results found</h2>}
                {projects.map((project) => (
                    <ProjectCard project={project} isManage={false} className="search-result-card" />
                ))}
            </div>
        </div>
    );
}

export default Search;

