import React from 'react';
import '../styles/UserCard.css';

function UserCard({ user }) {
    const getStatusClass = (accountType) => {
        switch (accountType) {
            case 'CREATOR':
                return 'status-creator';
            case 'BACKER':
                return 'status-backer';
            default:
                return '';
        }
    };

    if (!user) return null;

    return (
        <div className="user-big-card">
            <div className="user-avatar">
                {user.profilePicture ?
                    <img
                        className="avatar-image"
                        src={`http://localhost:5000/img/${user.profilePicture}`}
                        alt="user" />
                    : <i
                        id="user-icon"
                        className="material-icons"
                        style={{ fontSize: '100px' }}
                    >account_circle</i>
                }
            </div>
            <div className="user-info">
                <h2 className="user-name">{user.username}</h2>
                <p className="user-email">{user.email}</p>
                {user.accountType === 'CREATOR' && (
                    <p className="user-total">Total Collected: ${user.totalCollected}</p>
                )}
                {user.accountType === 'BACKER' && (
                    <p className="user-total">Total Contributed: ${user.totalContributed}</p>
                )}
            </div>
            <div className="user-stats">
                <span className={`user-status ${getStatusClass(user.accountType)}`}>
                    {user?.accountType?.substr(0, 1) + user?.accountType?.substr(1).toLowerCase()}
                </span>
            </div>
        </div>
    );
}

export default UserCard;