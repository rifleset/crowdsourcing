// NotificationPanel.jsx
import React, { useEffect, useRef } from 'react';
import '../styles/NotificationPanel.css';

const NotificationPanel = ({ notifications, closePanel }) => {


    return (
        <div className="notification-panel">
            <button className="close-button" onClick={closePanel}>X</button>
            <h2>Notifications</h2>
            {
                notifications.map((update, index) => {
                    const [timestamp, message] = update.split(';');
                    return (
                        <div key={index} className="notification-item">
                            <span className="update-timestamp">{timestamp}: </span>
                            <span className="update-message">{message.trim()}</span>
                        </div>
                    );
                })
            }
        </div >
    );
}

export default NotificationPanel;