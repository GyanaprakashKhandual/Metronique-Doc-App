'use client';

import { Confirm } from '../utils/Confirm.util';
import { useConfirm } from '@/app/scripts/Confirm.context';

export const ConfirmContainer = () => {
    const {
        isOpen,
        title,
        message,
        confirmText,
        cancelText,
        type,
        isLoading,
        handleConfirm,
        handleCancel,
    } = useConfirm();

    return (
        <Confirm
            isOpen={isOpen}
            title={title}
            message={message}
            confirmText={confirmText}
            cancelText={cancelText}
            type={type}
            isLoading={isLoading}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
};