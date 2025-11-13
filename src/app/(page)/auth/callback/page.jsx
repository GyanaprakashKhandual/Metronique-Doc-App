'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAlert } from '@/app/scripts/Alert.context';

export default function Page() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const refreshToken = params.get('refreshToken');
            const success = params.get('success');

            if (success === 'true' && token) {
                localStorage.setItem('token', token);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                setStatus('success');
                showAlert({ type: 'success', message: 'Authentication successful! Redirecting...' });
                await new Promise(resolve => setTimeout(resolve, 1500));
                router.push('/app');
            } else {
                setStatus('error');
                showAlert({ type: 'error', message: 'Authentication failed. Please try again.' });
                await new Promise(resolve => setTimeout(resolve, 2000));
                router.push('/auth');
            }
        };

        handleCallback();
    }, [router, showAlert]);

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center relative z-10"
            >
                {status === 'processing' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 backdrop-blur-sm"
                        >
                            <motion.div
                                className="relative w-24 h-24 mx-auto mb-8"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border-4 border-gray-200"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-1 rounded-full border-4 border-transparent border-t-black border-r-black"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-black rounded-full opacity-10"></div>
                                </div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-center text-lg font-semibold text-gray-900 mb-2"
                            >
                                Processing your login
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-sm text-gray-500 mb-6"
                            >
                                Please wait while we verify your credentials
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex justify-center gap-2"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-black rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.4, delay: 0.2, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-black rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.4, delay: 0.4, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-black rounded-full"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 bg-white rounded-xl p-4 shadow-md border border-gray-200 backdrop-blur-sm max-w-sm"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                                <p className="text-xs text-gray-600 font-medium">Verifying identity</p>
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-black"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                />
                            </div>
                        </motion.div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <motion.svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </motion.svg>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-2xl font-semibold text-gray-900 mb-2"
                            >
                                Welcome back!
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-center text-sm text-gray-500"
                            >
                                Your authentication was successful
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-6 flex gap-2 justify-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2.5 h-2.5 bg-black rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                                className="w-2.5 h-2.5 bg-black rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                                className="w-2.5 h-2.5 bg-black rounded-full"
                            />
                        </motion.div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <motion.svg
                                    className="w-12 h-12 text-gray-900"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </motion.svg>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-center text-2xl font-semibold text-gray-900 mb-2"
                            >
                                Authentication failed
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center text-sm text-gray-500 mb-6"
                            >
                                We couldn&apos;t verify your credentials. Please try again.
                            </motion.p>

                            <div className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ opacity: [1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-xs text-gray-500"
                                >
                                    Redirecting to login...
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div>
    );
}