'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback(({ type = 'info', message }) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, type, message }]);
        return id;
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    return (
        <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return context;
};