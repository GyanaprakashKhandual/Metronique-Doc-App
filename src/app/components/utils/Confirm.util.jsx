'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';

const ConfirmSpinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

export const Confirm = ({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'default',
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    const typeConfig = {
        default: {
            icon: HelpCircle,
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
            confirmBtn: 'bg-gray-900 hover:bg-gray-800',
        },
        success: {
            icon: CheckCircle2,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            confirmBtn: 'bg-green-600 hover:bg-green-700',
        },
        danger: {
            icon: AlertCircle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            confirmBtn: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            confirmBtn: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            icon: Info,
            iconBg: 'bg-sky-100',
            iconColor: 'text-sky-600',
            confirmBtn: 'bg-sky-600 hover:bg-sky-700',
        },
    };

    const config = typeConfig[type] || typeConfig.default;
    const Icon = config.icon;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    const handleCancel = () => {
        if (!isLoading && onCancel) {
            onCancel();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleCancel}
                    />

                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-1"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                    className={`w-14 h-14 rounded-full ${config.iconBg} flex items-center justify-center mx-auto mb-4`}
                                >
                                    <Icon className={`${config.iconColor}`} size={28} />
                                </motion.div>

                                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                                    {title}
                                </h3>

                                <p className="text-gray-600 text-sm text-center mb-6">
                                    {message}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmBtn}`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <ConfirmSpinner />
                                                <span>Processing...</span>
                                            </span>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};