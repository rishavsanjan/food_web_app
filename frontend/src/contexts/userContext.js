import axios from 'axios';
import React, { createContext, useState, useContext, useEffect, use, Children } from 'react';
import config from '../config/config';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();

    const getProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${config.apiUrl}/api/users/profile`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setUser(response.data.user)
    }

    useEffect(() => {
        getProfile();
    }, []);

    return(
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    )
};

export const useUser = () => useContext(UserContext);