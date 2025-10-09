import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import config from '../config/config';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`${config.apiUrl}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setUser(null);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, getProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
