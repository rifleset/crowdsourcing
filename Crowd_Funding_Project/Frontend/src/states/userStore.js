// userStore.js
import axios from 'axios';
import { create } from 'zustand';

const useUserStore = create(set => ({
    user: null,
    setUser: user => set({ user }),
    logout: () => set({ user: null }),
    updateUser: (token) => {
        console.log('token:', token);
        axios.get('http://localhost:5000/api/users/', {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                const data = response.data;
                if (data) {
                    set({ user: data });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

}));

export default useUserStore;