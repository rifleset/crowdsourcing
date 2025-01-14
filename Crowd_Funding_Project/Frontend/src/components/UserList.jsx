// UserList.jsx
import React, { useEffect, useState } from 'react';
import '../styles/UserList.css';
import useUserStore from '../states/userStore';
import axios from 'axios';

function UserList() {
    const [users, setUsers] = useState([]);
    const { user: loggedinUser } = useUserStore();
    const getUsers = () => {
        fetch('http://localhost:5000/api/admin/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => response.json())
            .then(data => { setUsers(data) })
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        getUsers();
    }, []);

    const deleteUser = (id) => {
        const confirmDisable = window.confirm('Are you sure you want to delete this user?');
        if (confirmDisable) {
            axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    console.log('Success:', response.data);
                    getUsers();
                })
                .catch((error) => console.error('Error:', error));

        }
    }
    if (!users) return (<div>Loading...</div>);

    return (
        <div className="user-list">
            {users.map((user) => (

                user?.id !== loggedinUser?.id &&
                < div key={user.id} className="user-card" >
                    <img src={`http://localhost:5000/img/${user.profilePicture}`} alt={user.username} className="user-card-image" />
                    <h2>{user.username}</h2>
                    <p>Type: {user.accountType?.substr(0, 1) + user.accountType?.substr(1).toLowerCase()}</p>
                    <button onClick={() => deleteUser(user.id)} style={{ backgroundColor: 'red', justifySelf: 'flex-end' }}>
                        Delete
                    </button>
                </div>

            ))}
        </div >
    );
}

export default UserList;