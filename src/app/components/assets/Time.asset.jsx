/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, X } from 'lucide-react';
import styles from '../../styles/components/Time.asset.css'

const TimePicker = ({
    value = null,
    onChange = () => { },
    placeholder = 'Select Time',
    icon: Icon = Clock,
    label = 'Time',
    onTimeSelect = () => { },
    format = '12h',
    clearable = true,
    className = '',
    dropdownClassName = '',
    disabled = false,
    customClasses = {},
    showToday = true,
    todayLabel = 'Today',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(value);
    const [hours, setHours] = useState(
        value ? value.getHours() : format === '12h' ? 12 : 0
    );
    const [minutes, setMinutes] = useState(value ? value.getMinutes() : 0);
    const [period, setPeriod] = useState(value ? (value.getHours() >= 12 ? 'PM' : 'AM') : 'AM');
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
        placement: 'bottom',
    });

    // Calculate optimal dropdown position
    const calculatePosition = useCallback(() => {
        if (!triggerRef.current || !dropdownRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const gap = 8;

        let top = triggerRect.bottom + gap;
        let left = triggerRect.left;
        let placement = 'bottom';

        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
            top = triggerRect.top - dropdownRect.height - gap;
            placement = 'top';
        }

        if (left + dropdownRect.width > viewportWidth) {
            left = viewportWidth - dropdownRect.width - 16;
        }

        if (left < 0) {
            left = 16;
        }

        setDropdownPosition({
            top: Math.max(0, top),
            left: Math.max(0, left),
            placement,
        });
    }, []);

    // Handle opening/closing
    useEffect(() => {
        if (isOpen) {
            calculatePosition();

            const handleClickOutside = (event) => {
                if (
                    dropdownRef.current &&
                    triggerRef.current &&
                    !dropdownRef.current.contains(event.target) &&
                    !triggerRef.current.contains(event.target)
                ) {
                    setIsOpen(false);
                }
            };

            const handleScroll = () => {
                calculatePosition();
            };

            window.addEventListener('resize', calculatePosition);
            window.addEventListener('scroll', handleScroll, true);
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                window.removeEventListener('resize', calculatePosition);
                window.removeEventListener('scroll', handleScroll, true);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, calculatePosition]);

    // Format time display
    const formatTimeDisplay = (time) => {
        if (!time) return '';
        const h = String(time.getHours()).padStart(2, '0');
        const m = String(time.getMinutes()).padStart(2, '0');

        if (format === '12h') {
            const hour12 = time.getHours() % 12 || 12;
            const period = time.getHours() >= 12 ? 'PM' : 'AM';
            return `${String(hour12).padStart(2, '0')}:${m} ${period}`;
        }

        return `${h}:${m}`;
    };

    // Handle hours change
    const handleHoursChange = (e) => {
        let value = parseInt(e.target.value);

        if (format === '12h') {
            if (value < 1) value = 12;
            if (value > 12) value = 1;
        } else {
            if (value < 0) value = 0;
            if (value > 23) value = 23;
        }

        setHours(value);
    };

    // Handle minutes change
    const handleMinutesChange = (e) => {
        let value = parseInt(e.target.value);

        if (value < 0) value = 0;
        if (value > 59) value = 59;

        setMinutes(value);
    };

    // Handle period change (AM/PM)
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    // Select time
    const selectTime = () => {
        let finalHours = hours;

        if (format === '12h') {
            finalHours = period === 'PM' ? (hours === 12 ? 12 : hours + 12) : hours === 12 ? 0 : hours;
        }

        const newTime = new Date();
        newTime.setHours(finalHours, minutes, 0, 0);

        setSelectedTime(newTime);
        onChange(newTime);
        onTimeSelect(newTime);
        setIsOpen(false);
    };

    // Select today's time (current time)
    const selectToday = () => {
        const now = new Date();
        setSelectedTime(now);
        setHours(now.getHours());
        setMinutes(now.getMinutes());
        setPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
        onChange(now);
        onTimeSelect(now);
        setIsOpen(false);
    };

    // Increment/Decrement hours
    const incrementHours = () => {
        let newHours = hours + 1;
        if (format === '12h') {
            if (newHours > 12) newHours = 1;
        } else {
            if (newHours > 23) newHours = 0;
        }
        setHours(newHours);
    };

    const decrementHours = () => {
        let newHours = hours - 1;
        if (format === '12h') {
            if (newHours < 1) newHours = 12;
        } else {
            if (newHours < 0) newHours = 23;
        }
        setHours(newHours);
    };

    // Increment/Decrement minutes
    const incrementMinutes = () => {
        let newMinutes = minutes + 5;
        if (newMinutes > 59) newMinutes = 0;
        setMinutes(newMinutes);
    };

    const decrementMinutes = () => {
        let newMinutes = minutes - 5;
        if (newMinutes < 0) newMinutes = 55;
        setMinutes(newMinutes);
    };

    const mergedClasses = {
        trigger: `${styles.trigger} ${customClasses.trigger || ''} ${className}`,
        dropdown: `${styles.dropdown} ${customClasses.dropdown || ''} ${dropdownClassName}`,
        timeDisplay: `${styles.timeDisplay} ${customClasses.timeDisplay || ''}`,
        timeInputs: `${styles.timeInputs} ${customClasses.timeInputs || ''}`,
        periodToggle: `${styles.periodToggle} ${customClasses.periodToggle || ''}`,
        actionButtons: `${styles.actionButtons} ${customClasses.actionButtons || ''}`,
        ...customClasses,
    };

    return (
        <div className={styles.container}>
            <button
                ref={triggerRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={mergedClasses.trigger}
            >
                <div className={styles.triggerContent}>
                    {Icon && <Icon size={18} className={styles.triggerIcon} />}
                    <span className={styles.triggerLabel}>{label}</span>
                </div>
                <span className={styles.triggerValue}>
                    {selectedTime ? formatTimeDisplay(selectedTime) : placeholder}
                </span>
                {clearable && selectedTime && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTime(null);
                            onChange(null);
                            onTimeSelect(null);
                        }}
                        className={styles.clearButton}
                        aria-label="Clear time"
                    >
                        <X size={16} />
                    </button>
                )}
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={mergedClasses.dropdown}
                    style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        zIndex: 50,
                    }}
                >
                    {/* Time Display */}
                    <div className={mergedClasses.timeDisplay}>
                        <div className={styles.displayValue}>
                            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                            {format === '12h' && <span className={styles.displayPeriod}>{period}</span>}
                        </div>
                    </div>

                    {/* Time Input Section */}
                    <div className={mergedClasses.timeInputs}>
                        {/* Hours */}
                        <div className={styles.inputGroup}>
                            <button
                                onClick={incrementHours}
                                className={styles.spinButton}
                                aria-label="Increment hours"
                            >
                                ▲
                            </button>
                            <input
                                type="number"
                                min={format === '12h' ? 1 : 0}
                                max={format === '12h' ? 12 : 23}
                                value={String(hours).padStart(2, '0')}
                                onChange={handleHoursChange}
                                className={styles.timeInput}
                                aria-label="Hours"
                            />
                            <button
                                onClick={decrementHours}
                                className={styles.spinButton}
                                aria-label="Decrement hours"
                            >
                                ▼
                            </button>
                        </div>

                        {/* Separator */}
                        <div className={styles.separator}>:</div>

                        {/* Minutes */}
                        <div className={styles.inputGroup}>
                            <button
                                onClick={incrementMinutes}
                                className={styles.spinButton}
                                aria-label="Increment minutes"
                            >
                                ▲
                            </button>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={String(minutes).padStart(2, '0')}
                                onChange={handleMinutesChange}
                                className={styles.timeInput}
                                aria-label="Minutes"
                            />
                            <button
                                onClick={decrementMinutes}
                                className={styles.spinButton}
                                aria-label="Decrement minutes"
                            >
                                ▼
                            </button>
                        </div>

                        {/* AM/PM Toggle */}
                        {format === '12h' && (
                            <div className={mergedClasses.periodToggle}>
                                <button
                                    onClick={() => handlePeriodChange('AM')}
                                    className={`${styles.periodButton} ${period === 'AM' ? styles.periodActive : ''
                                        }`}
                                >
                                    AM
                                </button>
                                <button
                                    onClick={() => handlePeriodChange('PM')}
                                    className={`${styles.periodButton} ${period === 'PM' ? styles.periodActive : ''
                                        }`}
                                >
                                    PM
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className={mergedClasses.actionButtons}>
                        {showToday && (
                            <button onClick={selectToday} className={styles.todayButton}>
                                {todayLabel}
                            </button>
                        )}
                        <button onClick={selectTime} className={styles.confirmButton}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;