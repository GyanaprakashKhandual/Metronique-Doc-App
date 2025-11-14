/* eslint-disable react-hooks/immutability */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    // Start and End date for range picker
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Global date state for project duration
    const [projectDuration, setProjectDuration] = useState(null);

    // Multiple date pickers state map
    const [datePickerStates, setDatePickerStates] = useState({});

    // Calculate duration between start and end date
    const calculateDuration = useCallback((start, end) => {
        if (!start || !end) return null;

        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const diffMs = endTime - startTime;

        if (diffMs < 0) {
            return { valid: false, message: 'End date must be after start date' };
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        return {
            valid: true,
            totalDays: days,
            weeks,
            months,
            years,
            formatted: formatDurationDisplay(days),
            details: {
                days,
                weeks,
                months,
                years,
            },
        };
    }, []);

    // Format duration for display
    const formatDurationDisplay = (days) => {
        if (days === 0) return 'Same day';
        if (days === 1) return '1 day';
        if (days < 7) return `${days} days`;
        if (days < 30) {
            const weeks = Math.floor(days / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
        }
        if (days < 365) {
            const months = Math.floor(days / 30);
            return `${months} ${months === 1 ? 'month' : 'months'}`;
        }
        const years = Math.floor(days / 365);
        return `${years} ${years === 1 ? 'year' : 'years'}`;
    };

    // Set start date for range picker
    const handleStartDateChange = useCallback(
        (date) => {
            setStartDate(date);

            // Auto-calculate duration if end date exists
            if (date && endDate) {
                const duration = calculateDuration(date, endDate);
                if (duration && duration.valid) {
                    setProjectDuration(duration);
                }
            }
        },
        [endDate, calculateDuration]
    );

    // Set end date for range picker
    const handleEndDateChange = useCallback(
        (date) => {
            setEndDate(date);

            // Auto-calculate duration if start date exists
            if (startDate && date) {
                const duration = calculateDuration(startDate, date);
                if (duration && duration.valid) {
                    setProjectDuration(duration);
                }
            }
        },
        [startDate, calculateDuration]
    );

    // Register and update individual date picker state
    const updateDatePickerState = useCallback((pickerId, dateValue) => {
        setDatePickerStates((prev) => ({
            ...prev,
            [pickerId]: {
                date: dateValue,
                formattedDate: dateValue
                    ? dateValue.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                    : null,
                timestamp: dateValue ? dateValue.getTime() : null,
                dayOfWeek: dateValue
                    ? dateValue.toLocaleDateString('en-US', { weekday: 'long' })
                    : null,
                iso: dateValue ? dateValue.toISOString().split('T')[0] : null,
            },
        }));
    }, []);

    // Get specific date picker state
    const getDatePickerState = useCallback(
        (pickerId) => {
            return datePickerStates[pickerId] || null;
        },
        [datePickerStates]
    );

    // Get all date pickers state
    const getAllDatePickerStates = useCallback(() => {
        return datePickerStates;
    }, [datePickerStates]);

    // Remove date picker from global state
    const removeDatePickerState = useCallback((pickerId) => {
        setDatePickerStates((prev) => {
            const newState = { ...prev };
            delete newState[pickerId];
            return newState;
        });
    }, []);

    // Clear all date pickers
    const clearAllDatePickers = useCallback(() => {
        setDatePickerStates({});
        setStartDate(null);
        setEndDate(null);
        setProjectDuration(null);
    }, []);

    // Get project duration in different formats
    const getProjectDuration = useCallback(() => {
        return projectDuration;
    }, [projectDuration]);

    // Validate if end date is after start date
    const isValidDateRange = useCallback(() => {
        if (!startDate || !endDate) return null;
        return endDate > startDate;
    }, [startDate, endDate]);

    // Get dates between start and end (useful for highlighting range)
    const getDateRangeArray = useCallback(() => {
        if (!startDate || !endDate) return [];

        const dates = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }, [startDate, endDate]);

    // Check if a specific date is in range
    const isDateInRange = useCallback(
        (date) => {
            if (!startDate || !endDate) return false;
            return date >= startDate && date <= endDate;
        },
        [startDate, endDate]
    );

    // Get combined state (useful for debugging or data submission)
    const getGlobalDateState = useCallback(() => {
        return {
            rangeDateState: {
                startDate,
                endDate,
                duration: projectDuration,
                isValid: isValidDateRange(),
                dateRange: getDateRangeArray(),
            },
            allDatePickerStates: datePickerStates,
            datePickerCount: Object.keys(datePickerStates).length,
        };
    }, [startDate, endDate, projectDuration, isValidDateRange, getDateRangeArray, datePickerStates]);

    // Format dates for API submission
    const getFormattedDateRange = useCallback(() => {
        return {
            startDate: startDate ? startDate.toISOString().split('T')[0] : null,
            endDate: endDate ? endDate.toISOString().split('T')[0] : null,
            durationDays: projectDuration?.totalDays || null,
            durationFormatted: projectDuration?.formatted || null,
        };
    }, [startDate, endDate, projectDuration]);

    // Get closest upcoming date from all pickers
    const getUpcomingDates = useCallback(() => {
        const dates = Object.values(datePickerStates)
            .map((picker) => ({
                date: picker.date,
                formatted: picker.formattedDate,
                timestamp: picker.timestamp,
            }))
            .filter((item) => item.date && item.date > new Date())
            .sort((a, b) => a.timestamp - b.timestamp);

        return dates;
    }, [datePickerStates]);

    // Get past dates from all pickers
    const getPastDates = useCallback(() => {
        const dates = Object.values(datePickerStates)
            .map((picker) => ({
                date: picker.date,
                formatted: picker.formattedDate,
                timestamp: picker.timestamp,
            }))
            .filter((item) => item.date && item.date < new Date())
            .sort((a, b) => b.timestamp - a.timestamp);

        return dates;
    }, [datePickerStates]);

    // Calculate days until a specific date
    const daysUntilDate = useCallback((date) => {
        if (!date) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, []);

    // Check if date is today
    const isToday = useCallback((date) => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }, []);

    // Check if date is in past
    const isPastDate = useCallback((date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        return targetDate < today;
    }, []);

    // Check if date is in future
    const isFutureDate = useCallback((date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        return targetDate > today;
    }, []);

    const value = {
        // Range Date Picker
        startDate,
        endDate,
        handleStartDateChange,
        handleEndDateChange,
        isValidDateRange,
        getProjectDuration,
        projectDuration,
        getDateRangeArray,
        isDateInRange,
        getFormattedDateRange,

        // Multiple Date Pickers
        updateDatePickerState,
        getDatePickerState,
        getAllDatePickerStates,
        removeDatePickerState,
        clearAllDatePickers,

        // Utilities
        calculateDuration,
        getGlobalDateState,
        getUpcomingDates,
        getPastDates,
        daysUntilDate,
        isToday,
        isPastDate,
        isFutureDate,
    };

    return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

// Hook to use Calendar Context
export const useCalendarContext = () => {
    const context = useContext(CalendarContext);

    if (!context) {
        throw new Error('useCalendarContext must be used within CalendarProvider');
    }

    return context;
};

// Hook for range date picker (start + end)
export const useDateRange = () => {
    const {
        startDate,
        endDate,
        handleStartDateChange,
        handleEndDateChange,
        isValidDateRange,
        getProjectDuration,
        projectDuration,
        getDateRangeArray,
        isDateInRange,
        getFormattedDateRange,
    } = useCalendarContext();

    return {
        startDate,
        endDate,
        handleStartDateChange,
        handleEndDateChange,
        isValidDateRange,
        getProjectDuration,
        projectDuration,
        getDateRangeArray,
        isDateInRange,
        getFormattedDateRange,
    };
};

// Hook for multiple date pickers
export const useMultipleDatePickers = () => {
    const {
        updateDatePickerState,
        getDatePickerState,
        getAllDatePickerStates,
        removeDatePickerState,
        clearAllDatePickers,
        getUpcomingDates,
        getPastDates,
    } = useCalendarContext();

    return {
        updateDatePickerState,
        getDatePickerState,
        getAllDatePickerStates,
        removeDatePickerState,
        clearAllDatePickers,
        getUpcomingDates,
        getPastDates,
    };
};

// Hook for date utilities
export const useDateUtilities = () => {
    const { daysUntilDate, isToday, isPastDate, isFutureDate, calculateDuration } =
        useCalendarContext();

    return {
        daysUntilDate,
        isToday,
        isPastDate,
        isFutureDate,
        calculateDuration,
    };
};

export default CalendarContext;