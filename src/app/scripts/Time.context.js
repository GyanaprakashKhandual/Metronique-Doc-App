'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
    // Start and End time for range picker
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    // Global time state for meeting duration
    const [meetingDuration, setMeetingDuration] = useState(null);

    // Multiple time pickers state map
    const [timePickerStates, setTimePickerStates] = useState({});

    // Calculate duration between start and end time
    const calculateDuration = useCallback((start, end) => {
        if (!start || !end) return null;

        const diffMs = end - start;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 0) {
            return { valid: false, message: 'End time must be after start time' };
        }

        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        return {
            valid: true,
            totalMinutes: diffMins,
            hours,
            minutes,
            formatted: `${hours}h ${minutes}m`,
        };
    }, []);

    // Set start time for range picker
    const handleStartTimeChange = useCallback(
        (time) => {
            setStartTime(time);

            // Auto-calculate duration if end time exists
            if (time && endTime) {
                const duration = calculateDuration(time, endTime);
                if (duration.valid) {
                    setMeetingDuration(duration);
                }
            }
        },
        [endTime, calculateDuration]
    );

    // Set end time for range picker
    const handleEndTimeChange = useCallback(
        (time) => {
            setEndTime(time);

            // Auto-calculate duration if start time exists
            if (startTime && time) {
                const duration = calculateDuration(startTime, time);
                if (duration.valid) {
                    setMeetingDuration(duration);
                }
            }
        },
        [startTime, calculateDuration]
    );

    // Register and update individual time picker state
    const updateTimePickerState = useCallback((pickerId, timeValue) => {
        setTimePickerStates((prev) => ({
            ...prev,
            [pickerId]: {
                time: timeValue,
                formattedTime: timeValue
                    ? timeValue.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })
                    : null,
                timestamp: timeValue ? timeValue.getTime() : null,
            },
        }));
    }, []);

    // Get specific time picker state
    const getTimePickerState = useCallback(
        (pickerId) => {
            return timePickerStates[pickerId] || null;
        },
        [timePickerStates]
    );

    // Get all time pickers state
    const getAllTimePickerStates = useCallback(() => {
        return timePickerStates;
    }, [timePickerStates]);

    // Remove time picker from global state
    const removeTimePickerState = useCallback((pickerId) => {
        setTimePickerStates((prev) => {
            const newState = { ...prev };
            delete newState[pickerId];
            return newState;
        });
    }, []);

    // Clear all time pickers
    const clearAllTimePickers = useCallback(() => {
        setTimePickerStates({});
        setStartTime(null);
        setEndTime(null);
        setMeetingDuration(null);
    }, []);

    // Get meeting duration in different formats
    const getMeetingDuration = useCallback(() => {
        return meetingDuration;
    }, [meetingDuration]);

    // Validate if end time is after start time
    const isValidTimeRange = useCallback(() => {
        if (!startTime || !endTime) return null;
        return endTime > startTime;
    }, [startTime, endTime]);

    // Get combined state (useful for debugging or data submission)
    const getGlobalTimeState = useCallback(() => {
        return {
            rangeTimeState: {
                startTime,
                endTime,
                duration: meetingDuration,
                isValid: isValidTimeRange(),
            },
            allTimePickerStates: timePickerStates,
            timePickerCount: Object.keys(timePickerStates).length,
        };
    }, [startTime, endTime, meetingDuration, isValidTimeRange, timePickerStates]);

    const value = {
        // Range Picker
        startTime,
        endTime,
        handleStartTimeChange,
        handleEndTimeChange,
        isValidTimeRange,
        getMeetingDuration,
        meetingDuration,

        // Multiple Time Pickers
        updateTimePickerState,
        getTimePickerState,
        getAllTimePickerStates,
        removeTimePickerState,
        clearAllTimePickers,

        // Utilities
        calculateDuration,
        getGlobalTimeState,
    };

    return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

// Hook to use Time Context
export const useTimeContext = () => {
    const context = useContext(TimeContext);

    if (!context) {
        throw new Error('useTimeContext must be used within TimeProvider');
    }

    return context;
};

// Hook for range time picker (start + end)
export const useTimeRange = () => {
    const {
        startTime,
        endTime,
        handleStartTimeChange,
        handleEndTimeChange,
        isValidTimeRange,
        getMeetingDuration,
        meetingDuration,
    } = useTimeContext();

    return {
        startTime,
        endTime,
        handleStartTimeChange,
        handleEndTimeChange,
        isValidTimeRange,
        getMeetingDuration,
        meetingDuration,
    };
};

// Hook for multiple time pickers
export const useMultipleTimePickers = () => {
    const {
        updateTimePickerState,
        getTimePickerState,
        getAllTimePickerStates,
        removeTimePickerState,
        clearAllTimePickers,
    } = useTimeContext();

    return {
        updateTimePickerState,
        getTimePickerState,
        getAllTimePickerStates,
        removeTimePickerState,
        clearAllTimePickers,
    };
};

export default TimeContext;