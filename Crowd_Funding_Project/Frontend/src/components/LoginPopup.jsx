// LoginPopup.jsx
import React, { useState } from 'react';
import '../styles/LoginPopup.css';
import useUserStore from '../states/userStore';
import SignupPopup from './SignupPopup';
import axios from 'axios';

const LoginPopup = ({ closePopup }) => {
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { updateUser } = useUserStore();
    const [showSignupPopup, setShowSignupPopup] = useState(false);

    const handleUsernameChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate the inputs
        if (!username.trim() || !password) {
            setError('Both fields are required');
            return;
        }


        axios.post('http://localhost:5000/api/auth/login', { username, password })
            .then((response) => {
                const data = response.data;
                console.log(data);
                // if status is 400
                if (response.status === 400) {
                    setError(data.message);
                    return;
                }
                if (data) {
                    localStorage.setItem('token', data);
                    const token = localStorage.getItem('token');
                    // send req to get profile
                    updateUser(token);
                    closePopup();

                    if (data.accountType === 'ADMIN') {
                        window.location.href = '/admin';
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError('Failed to login');
            });

    };

    const handleSignup = (event) => {
        event.preventDefault();
        // closePopup();
        setShowSignupPopup(true);
    }

    if (showSignupPopup) {
        return (
            <SignupPopup closePopup={() => setShowSignupPopup(false)}></SignupPopup>
        );
    }



    return (
        <div className="login-popup">
            <div className="login-popup-content">
                <button className="close-button" onClick={closePopup}>X</button>
                <span className='loginHeader'>Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    {error && <p className="error-message">{error}</p>}
                    <button className="loginbtn" type="submit">Login</button>
                    <span className="signup-link">Or <span
                        style={{ cursor: 'pointer' }}
                        className='popupLabel' onClick={handleSignup}>Sign up</span></span>
                </form>
            </div>
        </div>
    );
}

export default LoginPopup;