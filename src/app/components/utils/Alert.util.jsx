'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Particle = ({ x, y, color, delay, animationX, animationY, animationRotate, duration }) => {
    return (
        <motion.div
            initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
            }}
            animate={{
                x: animationX,
                y: animationY,
                opacity: 0,
                scale: 0,
                rotate: animationRotate,
            }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut",
            }}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
                backgroundColor: color,
                left: x,
                top: y,
                boxShadow: `0 0 4px ${color}`,
            }}
        />
    );
};

export const Alert = ({ type = 'info', message, onClose, alertId }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [particles, setParticles] = useState([]);
    const alertRef = useRef(null);

    const typeConfig = {
        success: {
            icon: CheckCircle2,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-900',
            iconColor: 'text-green-600',
            particleColor: '#10b981',
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-900',
            iconColor: 'text-red-600',
            particleColor: '#ef4444',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-900',
            iconColor: 'text-yellow-600',
            particleColor: '#f59e0b',
        },
        info: {
            icon: Info,
            bgColor: 'bg-sky-50',
            borderColor: 'border-sky-200',
            textColor: 'text-sky-900',
            iconColor: 'text-sky-600',
            particleColor: '#0ea5e9',
        },
    };

    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    const createParticles = () => {
        if (!alertRef.current) return;
        const rect = alertRef.current.getBoundingClientRect();
        const particleCount = 50;
        const newParticles = [];
        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                delay: Math.random() * 0.3,
            });
        }
        setParticles(newParticles);
    };

    const handleClose = () => {
        setIsClosing(true);
        createParticles();
        setTimeout(() => {
            onClose(alertId);
        }, 300);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClosing(true);
            createParticles();
            setTimeout(() => {
                onClose(alertId);
            }, 300);
        }, 6000);

        return () => clearTimeout(timer);
    }, [alertId, onClose]);

    return (
        <AnimatePresence>
            <motion.div
                ref={alertRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`relative ${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-4 overflow-hidden`}
            >
                <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.iconColor} shrink-0 mt-0.5`} />
                    <p className={`text-sm font-medium ${config.textColor} flex-1`}>
                        {message}
                    </p>
                    <button
                        onClick={handleClose}
                        className={`${config.iconColor} hover:opacity-75 transition-opacity shrink-0 mt-0.5`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <AnimatePresence>
                    {particles.map((particle) => (
                        <Particle
                            key={particle.id}
                            x={particle.x}
                            y={particle.y}
                            color={config.particleColor}
                            delay={particle.delay}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};