import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { isAuthenticated } from '../utils/tokenUtils';


const UserContext = createContext();


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};


export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!isAuthenticated()) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const userData = await getCurrentUser();
                setCurrentUser(userData);
            } catch (err) {

                setError(err.message);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);


    const updateCurrentUser = (userData) => {
        setCurrentUser(userData);
        setError(null);
    };


    const clearCurrentUser = () => {
        setCurrentUser(null);
        setError(null);
    };


    const refreshUser = async () => {
        if (!isAuthenticated()) {
            clearCurrentUser();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const userData = await getCurrentUser();
            setCurrentUser(userData);
        } catch (err) {

            setError(err.message);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        updateCurrentUser,
        clearCurrentUser,
        refreshUser,
        isAuthenticated: !!currentUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
