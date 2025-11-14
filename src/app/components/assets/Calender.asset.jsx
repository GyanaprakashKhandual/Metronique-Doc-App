/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import styles from '../../styles/components/Calender.asset.css';

const Calendar = ({
    value = null,
    onChange = () => { },
    placeholder = 'Select Date',
    icon: Icon = null,
    label = 'Date',
    searchPlaceholder = 'Search or type date...',
    minDate = null,
    maxDate = null,
    disabledDates = [],
    onDateSelect = () => { },
    dateFormat = 'MMM DD, YYYY',
    clearable = true,
    className = '',
    dropdownClassName = '',
    disabled = false,
    showMonthYear = true,
    highlightToday = true,
    allowYearNavigation = false,
    customClasses = {},
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [searchInput, setSearchInput] = useState('');
    const [selectedDate, setSelectedDate] = useState(value);
    const triggerRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
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

        // Check if dropdown fits below
        if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
            top = triggerRect.top - dropdownRect.height - gap;
            placement = 'top';
        }

        // Adjust horizontal position if it goes off-screen
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
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);

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

    // Parse search input for dates
    const parseSearchDate = (input) => {
        if (!input.trim()) return null;

        const cleanInput = input.trim();
        const patterns = [
            /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/,
            /^(\d{1,2})[-\/](\d{1,2})$/,
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        ];

        for (let pattern of patterns) {
            const match = cleanInput.match(pattern);
            if (match) {
                const day = parseInt(match[1]);
                const month = parseInt(match[2]) - 1;
                const year = match[3] ? parseInt(match[3]) : currentMonth.getFullYear();

                const date = new Date(year, month, day);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }

        return null;
    };

    // Handle search input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        const parsedDate = parseSearchDate(value);
        if (parsedDate) {
            setCurrentMonth(parsedDate);
        }
    };

    // Handle search enter
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            const parsedDate = parseSearchDate(searchInput);
            if (parsedDate) {
                selectDate(parsedDate);
            }
        }
    };

    // Format date helper
    const formatDate = (date) => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Check if date is disabled
    const isDateDisabled = (date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return disabledDates.some(
            (d) =>
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
        );
    };

    // Select date
    const selectDate = (date) => {
        if (isDateDisabled(date)) return;

        setSelectedDate(date);
        onChange(date);
        onDateSelect(date);
        setIsOpen(false);
        setSearchInput('');
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    // Check if date is selected
    const isSelected = (date) => {
        return (
            selectedDate &&
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate()
        );
    };

    const calendarDays = generateCalendarDays();
    const monthYear = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const mergedClasses = {
        trigger: `${styles.trigger} ${customClasses.trigger || ''} ${className}`,
        dropdown: `${styles.dropdown} ${customClasses.dropdown || ''} ${dropdownClassName}`,
        searchBox: `${styles.searchBox} ${customClasses.searchBox || ''}`,
        calendarGrid: `${styles.calendarGrid} ${customClasses.calendarGrid || ''}`,
        dayCell: `${styles.dayCell} ${customClasses.dayCell || ''}`,
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
                    {selectedDate ? formatDate(selectedDate) : placeholder}
                </span>
                {clearable && selectedDate && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(null);
                            onChange(null);
                            onDateSelect(null);
                        }}
                        className={styles.clearButton}
                        aria-label="Clear date"
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
                    <div className={mergedClasses.searchBox}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            className={styles.searchInput}
                        />
                    </div>

                    {showMonthYear && (
                        <div className={styles.header}>
                            <button
                                onClick={() =>
                                    setCurrentMonth(
                                        new Date(
                                            currentMonth.getFullYear(),
                                            currentMonth.getMonth() - 1
                                        )
                                    )
                                }
                                className={styles.navButton}
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <span className={styles.monthYear}>{monthYear}</span>

                            <button
                                onClick={() =>
                                    setCurrentMonth(
                                        new Date(
                                            currentMonth.getFullYear(),
                                            currentMonth.getMonth() + 1
                                        )
                                    )
                                }
                                className={styles.navButton}
                                aria-label="Next month"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    <div className={styles.weekDays}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className={styles.weekDay}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className={mergedClasses.calendarGrid}>
                        {calendarDays.map((date, index) => (
                            <button
                                key={index}
                                onClick={() => date && selectDate(date)}
                                disabled={!date || isDateDisabled(date)}
                                className={`${mergedClasses.dayCell} ${date && isSelected(date) ? styles.selected : ''
                                    } ${date && isToday(date) && highlightToday ? styles.today : ''} ${!date ? styles.emptyDay : ''
                                    } ${date && isDateDisabled(date) ? styles.disabled : ''}`}
                            >
                                {date && date.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;