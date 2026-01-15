import { useState } from 'react';
import NButton from './NButton';

function DateSelector({ onDateSelect, initialDate = null }) {
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
    const [currentMonth, setCurrentMonth] = useState(initialDate ? initialDate.getMonth() : new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate ? initialDate.getFullYear() : new Date().getFullYear());
    const [showMonthSelector, setShowMonthSelector] = useState(false);
    const [showYearSelector, setShowYearSelector] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handlePrevYear = () => {
        setCurrentYear(currentYear - 1);
    };

    const handleNextYear = () => {
        setCurrentYear(currentYear + 1);
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
        if (onDateSelect) {
            onDateSelect(newDate);
        }
    };

    const handleMonthSelect = (monthIndex) => {
        setCurrentMonth(monthIndex);
        setShowMonthSelector(false);
    };

    const handleYearSelect = (year) => {
        setCurrentYear(year);
        setShowYearSelector(false);
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="calendar-day-empty"></div>
            );
        }

        // Actual days
        for (let day = 1; day <= totalDays; day++) {
            const isSelected = selectedDate && 
                selectedDate.getDate() === day && 
                selectedDate.getMonth() === currentMonth && 
                selectedDate.getFullYear() === currentYear;
            
            const isToday = new Date().getDate() === day && 
                new Date().getMonth() === currentMonth && 
                new Date().getFullYear() === currentYear;

            days.push(
                <div key={day} className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}>
                    <NButton 
                        btnID={`day-${day}`}
                        clickData={() => handleDateClick(day)}
                        width="100%"
                        height="100%"
                        btnName={day.toString()}
                    />
                </div>
            );
        }

        return days;
    };

    const renderYearSelector = () => {
        const years = [];
        const startYear = currentYear - 5;
        const endYear = currentYear + 6;

        for (let year = startYear; year < endYear; year++) {
            years.push(
                <div key={year} className="year-option">
                    <NButton 
                        btnID={`year-${year}`}
                        clickData={() => handleYearSelect(year)}
                        width="100%"
                        btnName={year.toString()}
                    />
                </div>
            );
        }

        return years;
    };

    return (
        <>
        <style>{`
            .date-selector-container {
                background-color: #171717;
                border: 1px solid var(--color14);
                padding: 1em;
                width: fit-content;
                user-select: none;
            }

            .date-selector-header {
                display: flex;
                flex-direction: column;
                gap: 0.5em;
                margin-bottom: 1em;
            }

            .month-year-controls,
            .year-controls {
                display: flex;
                gap: 0.5em;
                justify-content: space-between;
                align-items: center;
            }

            .weekday-header {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.25em;
                margin-bottom: 0.5em;
            }

            .weekday-label {
                text-align: center;
                color: var(--color4);
                font-size: 0.9em;
                padding: 0.5em;
                font-weight: bold;
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.25em;
            }

            .calendar-day {
                aspect-ratio: 1;
                min-width: 2.5em;
            }

            .calendar-day-empty {
                aspect-ratio: 1;
                min-width: 2.5em;
            }

            .calendar-day.selected .okBtn {
                background-color: var(--color4);
                color: #171717;
            }

            .calendar-day.today .okBtn {
                border: 2px solid var(--color4);
            }

            .month-selector-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5em;
                margin-bottom: 1em;
                padding: 0.5em;
            }

            .month-option {
                min-width: 5em;
            }

            .year-selector-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5em;
                margin-bottom: 1em;
                max-height: 20em;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 0.5em;
            }

            .year-option {
                min-width: 5em;
            }
        `}</style>
        <div className="date-selector-container">
            <div className="date-selector-header">
                <div className="month-year-controls">
                    <NButton 
                        btnID="prev-month"
                        clickData={handlePrevMonth}
                        width="3em"
                        btnName="◀"
                    />
                    <NButton 
                        btnID="month-display"
                        clickData={() => {
                            setShowMonthSelector(!showMonthSelector);
                            setShowYearSelector(false);
                        }}
                        width="100%"
                        btnName={months[currentMonth]}
                    />
                    <NButton 
                        btnID="next-month"
                        clickData={handleNextMonth}
                        width="3em"
                        btnName="▶"
                    />
                </div>

                <div className="year-controls">
                    <NButton 
                        btnID="prev-year"
                        clickData={handlePrevYear}
                        width="3em"
                        btnName="◀"
                    />
                    <NButton 
                        btnID="year-display"
                        clickData={() => {
                            setShowYearSelector(!showYearSelector);
                            setShowMonthSelector(false);
                        }}
                        width="100%"
                        btnName={currentYear.toString()}
                    />
                    <NButton 
                        btnID="next-year"
                        clickData={handleNextYear}
                        width="3em"
                        btnName="▶"
                    />
                </div>
            </div>

            {showMonthSelector && (
                <div className="month-selector-grid">
                    {months.map((month, index) => (
                        <div key={month} className="month-option">
                            <NButton 
                                btnID={`month-${index}`}
                                clickData={() => handleMonthSelect(index)}
                                width="100%"
                                btnName={month.substring(0, 3)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {showYearSelector && (
                <div className="year-selector-grid">
                    {renderYearSelector()}
                </div>
            )}

            {!showMonthSelector && !showYearSelector && (
                <>
                    <div className="weekday-header">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="weekday-label">{day}</div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {renderCalendarDays()}
                    </div>
                </>
            )}
        </div>
        </>
    );
}

export default DateSelector;