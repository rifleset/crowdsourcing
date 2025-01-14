// SignupPopup.jsx
import React, { useState } from 'react';
import '../styles/SignupPopup.css';
import axios from 'axios';

const SignupPopup = ({ closePopup }) => {
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setRole] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleImageChange = (event) => {
        if (!event.target.files[0]) return;
        setImage(event.target.files[0]);
        setImageUrl(URL.createObjectURL(event.target.files[0]));
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate the inputs
        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!accountType) {
            setError('Role is required');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);
        formData.append('json', new Blob([JSON.stringify({ username, email, password, accountType: accountType })], { type: 'application/json' }));

        axios.post('http://localhost:5000/api/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                const data = response.data;
                console.log('Success:', data);
                if (response.status !== 201) {
                    setError('Failed to sign up');
                    return;
                }
                alert('Your account has been created! Please login');
                closePopup();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error.response.data)

                setError('Failed to sign up - ' + error.response.data);
            });
    };

    return (
        <div className="signup-popup">
            <div className="signup-popup-content">
                <button className="close-button" onClick={closePopup}>X</button>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <img src={imageUrl} alt="Profile" className='profile-image' />
                    <input type="file" placeholder="Image URL" onChange={handleImageChange} accept='image/*' style={{ color: '#000' }} />
                    <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                    <input type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    <select value={accountType} onChange={(e) => setRole(e.target.value)} className='signup-select'>
                        <option value="">Select Role</option>
                        <option value="CREATOR">Creator</option>
                        <option value="BACKER">Backer</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    {error && <p className="error-message">{error}</p>}
                    <button className="signupbtn" type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignupPopup;