'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'default',
        isLoading: false,
        onConfirm: null,
        onCancel: null,
    });

    const showConfirm = useCallback((options) => {
        setConfirmState((prev) => ({
            ...prev,
            isOpen: true,
            title: options.title || prev.title,
            message: options.message || prev.message,
            confirmText: options.confirmText || prev.confirmText,
            cancelText: options.cancelText || prev.cancelText,
            type: options.type || prev.type,
            onConfirm: options.onConfirm,
            onCancel: options.onCancel,
            isLoading: false,
        }));
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmState((prev) => ({
            ...prev,
            isOpen: false,
            isLoading: false,
        }));
    }, []);

    const setLoading = useCallback((loading) => {
        setConfirmState((prev) => ({
            ...prev,
            isLoading: loading,
        }));
    }, []);

    const handleConfirm = useCallback(() => {
        if (confirmState.onConfirm) {
            confirmState.onConfirm();
        }
    }, [confirmState]);

    const handleCancel = useCallback(() => {
        if (confirmState.onCancel) {
            confirmState.onCancel();
        }
        closeConfirm();
    }, [confirmState, closeConfirm]);

    return (
        <ConfirmContext.Provider
            value={{
                ...confirmState,
                showConfirm,
                closeConfirm,
                setLoading,
                handleConfirm,
                handleCancel,
            }}
        >
            {children}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmProvider');
    }
    return context;
};