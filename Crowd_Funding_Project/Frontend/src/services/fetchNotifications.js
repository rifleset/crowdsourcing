import axios from "axios";

// fetchNotifications.js
async function fetchNotifications() {
    const token = localStorage.getItem('token');
    if (!token) {
        return [];
    }

    const response = await axios.get('http://localhost:5000/api/users/inbox', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        }
    });
    const notifications = response.data;
    return notifications;
}

export default fetchNotifications;