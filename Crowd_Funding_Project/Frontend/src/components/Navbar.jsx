import React, { useEffect, useState } from 'react';
import '../styles/Navbar.css';
import LoginPopup from './LoginPopup'; // Import your LoginPopup component
import useUserStore from '../states/userStore';
import { Link } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { useQuery } from 'react-query';
import fetchNotifications from '../services/fetchNotifications';
import axios from 'axios';

const Navbar = ({ setPopup }) => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const { user, setUser } = useUserStore();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);


    const { data: notifications = [] } = useQuery('notifications', fetchNotifications, {
        refetchInterval: 5000,
    });


    let loggedIn = user ? true : false;
    const loginPressed = () => {
        setShowLoginPopup(true);
    };

    const closePopup = () => {
        setShowLoginPopup(false);
        setPopup(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setDropdownVisible(false);
    };
    useEffect(() => {
        if (showLoginPopup) {
            setPopup(true);
        }
    }, [showLoginPopup, setPopup]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/users/', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    const data = response.data;
                    if (data.id) {
                        const user = data;
                        setUser(data);
                        loggedIn = true;
                    }
                    console.log("Logged in user:", data);

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, []);

    const handleNotificationClick = () => {
        setShowNotificationPanel((prevState) => !prevState);
    };

    return (
        <div className="navbar">
            <Link to="/" className="navbar-link">
                <h2 className="navbar-title">CrowdFunding Platform</h2>
            </Link>
            <div className="navbar-buttons">
                {user?.accountType == "ADMIN" ? <Link to="/admin" className='navbar-button'>Admin</Link> : null}
                {user ? (
                    <>
                        {user?.accountType != "ADMIN" && <Link to="/manage" className="navbar-button">Manage</Link>}
                        <div
                            className="navbar-user"
                            onMouseEnter={() => setDropdownVisible(true)}
                            onMouseLeave={() => setDropdownVisible(false)}
                        >
                            {user.profilePicture ?
                                <img
                                    className="navbar-user-image"
                                    src={`http://localhost:5000/img/${user.profilePicture}`}
                                    alt="user" />
                                : <i id="user-icon" className="material-icons navbar-user-image">account_circle</i>
                            }
                            {dropdownVisible && (
                                <div className="navbar-dropdown">
                                    <span className="navbar-username">{user.username}</span>
                                    <Link to="/manage/user" className="navbar-dropdown-item">Edit Profile</Link>
                                    <button onClick={handleLogout} className="navbar-dropdown-item-btn">Logout</button>
                                </div>
                            )}
                        </div>
                        <div className="navbar-notification" onClick={handleNotificationClick}>
                            <i className="material-icons">notifications</i>
                            {notifications.length > 0 && (
                                <span className="navbar-notification-count">{notifications.length}</span>
                            )}
                        </div>
                    </>
                ) : (
                    <button className="navbar-button" onClick={loginPressed}>Login</button>
                )}
            </div>
            {showLoginPopup && <LoginPopup closePopup={closePopup} />}
            {showNotificationPanel && <NotificationPanel notifications={notifications} closePanel={() => setShowNotificationPanel(false)} />}
        </div>
    );
}

export default Navbar;