// MainPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import ProjectList from '../../components/ProjectList';
import useUserStore from '../../states/userStore';

function Main() {
    const [activeView, setActiveView] = useState('browse');
    const {user}=useUserStore();
    return (
        <div className="mainpage">
            <nav className="mainnav">
                <Link to="#" onClick={() => setActiveView('browse')} className={activeView === 'browse' ? 'active' : ''}>
                    <i className="material-icons">search</i> <span className="feedlabel">Browse</span>
                </Link>
            </nav>

           {activeView==='browse' ? user ? (<ProjectList endpoint="projects" isManage={false} isAdmin={false} />) : <h2>Log in to see your feed</h2>: null}
        </div>
    );
}

export default Main;