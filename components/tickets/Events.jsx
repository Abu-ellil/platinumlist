'use client';
import { useState } from 'react';
import './style/event.css';

const Events = () => {
    // State management
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(0);

    // Data objects
    const monthsData = [
        {
            name: "يوليو 2025",
            year: 2025,
            month: 7,
            days: [
                { day: 1, disabled: true, price: null },
                { day: 2, disabled: false, price: 1466.55 },
                { day: 3, disabled: false, price: 1466.55 },
                { day: 4, disabled: false, price: 1466.55 },
                { day: 5, disabled: false, price: 1466.55 },
                { day: 6, disabled: false, price: 1466.55 },
                { day: 7, disabled: false, price: 1466.55 },
                { day: 8, disabled: false, price: 1466.55 },
                { day: 9, disabled: false, price: 1466.55 },
                { day: 10, disabled: false, price: 1466.55 },
                { day: 11, disabled: false, price: 1466.55 },
                { day: 12, disabled: false, price: 1466.55 },
                { day: 13, disabled: false, price: 1466.55 },
                { day: 14, disabled: false, price: 1466.55 },
                { day: 15, disabled: false, price: 1466.55 },
                { day: 16, disabled: false, price: 1466.55 },
                { day: 17, disabled: false, price: 1466.55 },
                { day: 18, disabled: false, price: 1466.55 },
                { day: 19, disabled: false, price: 1466.55 },
                { day: 20, disabled: false, price: 1466.55 },
                { day: 21, disabled: false, price: 1466.55 },
                { day: 22, disabled: false, price: 1466.55 },
                { day: 23, disabled: false, price: 1466.55 },
                { day: 24, disabled: false, price: 1466.55 },
                { day: 25, disabled: false, price: 1466.55 },
                { day: 26, disabled: false, price: 1466.55 },
                { day: 27, disabled: false, price: 1466.55 },
                { day: 28, disabled: false, price: 1466.55 },
                { day: 29, disabled: false, price: 1466.55 },
                { day: 30, disabled: false, price: 1466.55 },
                { day: 31, disabled: false, price: 1466.55 }
            ]
        },
        {
            name: "أغسطس 2025",
            year: 2025,
            month: 8,
            days: [
                { day: 1, disabled: false, price: 1466.55 },
                { day: 2, disabled: false, price: 1466.55 },
                { day: 3, disabled: false, price: null },
                { day: 4, disabled: false, price: null },
                { day: 5, disabled: false, price: null },
                { day: 6, disabled: false, price: null },
                { day: 7, disabled: false, price: null },
                { day: 8, disabled: false, price: null },
                { day: 9, disabled: false, price: null },
                { day: 10, disabled: false, price: null },
                { day: 11, disabled: false, price: null },
                { day: 12, disabled: false, price: null },
                { day: 13, disabled: false, price: null },
                { day: 14, disabled: false, price: null },
                { day: 15, disabled: false, price: null },
                { day: 16, disabled: false, price: null },
                { day: 17, disabled: false, price: null },
                { day: 18, disabled: false, price: null },
                { day: 19, disabled: false, price: null },
                { day: 20, disabled: false, price: null },
                { day: 21, disabled: false, price: null },
                { day: 22, disabled: false, price: null },
                { day: 23, disabled: false, price: null },
                { day: 24, disabled: false, price: null },
                { day: 25, disabled: false, price: null },
                { day: 26, disabled: false, price: null },
                { day: 27, disabled: false, price: null },
                { day: 28, disabled: false, price: null },
                { day: 29, disabled: false, price: null },
                { day: 30, disabled: false, price: null },
                { day: 31, disabled: false, price: null }
            ]
        }
    ];

    const availableDates = [
        {
            day: 2,
            month: 7,
            year: 2025,
            weekDay: "أربعاء",
            monthName: "يوليو",
            price: 1467,
            times: [
                { id: 1, time: "09:00", price: 1467 },
                { id: 2, time: "11:00", price: 1467 },
                { id: 3, time: "14:00", price: 1467 },
                { id: 4, time: "16:00", price: 1467 }
            ]
        },
        {
            day: 3,
            month: 7,
            year: 2025,
            weekDay: "خميس",
            monthName: "يوليو",
            price: 1467,
            times: [
                { id: 5, time: "09:00", price: 1467 },
                { id: 6, time: "11:00", price: 1467 },
                { id: 7, time: "14:00", price: 1467 },
                { id: 8, time: "16:00", price: 1467 }
            ]
        },
        {
            day: 4,
            month: 7,
            year: 2025,
            weekDay: "جمعة",
            monthName: "يوليو",
            price: 1467,
            times: [
                { id: 9, time: "09:00", price: 1467 },
                { id: 10, time: "11:00", price: 1467 },
                { id: 11, time: "14:00", price: 1467 },
                { id: 12, time: "16:00", price: 1467 }
            ]
        },
        {
            day: 5,
            month: 7,
            year: 2025,
            weekDay: "سبت",
            monthName: "يوليو",
            price: 1467,
            times: [
                { id: 13, time: "09:00", price: 1467 },
                { id: 14, time: "11:00", price: 1467 },
                { id: 15, time: "14:00", price: 1467 },
                { id: 16, time: "16:00", price: 1467 }
            ]
        }
    ];

    // Helper functions
    const handleDateClick = (day, month, year) => {
        const dateKey = `${year}-${month}-${day}`;
        const availableDate = availableDates.find(d => d.day === day && d.month === month && d.year === year);

        if (availableDate) {
            setSelectedDate({ day, month, year, ...availableDate });
            setShowTimePicker(true);
            setSelectedTime(null);
        }
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handleApply = () => {
        if (selectedDate && selectedTime) {
            console.log('Selected:', { date: selectedDate, time: selectedTime });
            // Handle apply logic here
        }
    };

    const renderCalendarDays = (monthData, monthIndex) => {
        const weeks = [];
        const daysInMonth = monthData.days;
        let week = [];

        // Add empty cells for days before month starts
        const firstDay = new Date(monthData.year, monthData.month - 1, 1).getDay();
        const startPadding = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

        for (let i = 0; i < startPadding; i++) {
            week.push(<td key={`empty-${i}`}></td>);
        }

        // Add days
        daysInMonth.forEach((dayData) => {
            const isSelected = selectedDate &&
                selectedDate.day === dayData.day &&
                selectedDate.month === monthData.month &&
                selectedDate.year === monthData.year;

            week.push(
                <td key={dayData.day}>
                    <button
                        className={`__dayButton__zBs4g-lqf ${dayData.disabled ? '__dayButtonDisabled__G9ec0XKSkb' : ''} ${isSelected ? '__dayButtonSelected' : ''}`}
                        disabled={dayData.disabled}
                        onClick={() => handleDateClick(dayData.day, monthData.month, monthData.year)}
                    >
                        <span className="__d-thl">{dayData.day} </span>
                        {dayData.price && <span className="__d-r1o">{dayData.price} EGP</span>}
                    </button>
                </td>
            );

            if (week.length === 7) {
                weeks.push(<tr key={weeks.length}>{week}</tr>);
                week = [];
            }
        });

        // Add empty cells for remaining days
        while (week.length < 7 && week.length > 0) {
            week.push(<td key={`empty-end-${week.length}`}></td>);
        }
        if (week.length > 0) {
            weeks.push(<tr key={weeks.length}>{week}</tr>);
        }

        return weeks;
    };

    return (
        <div className="popup-9a5 popup-xts style-TQPGM" id="style-TQPGM">
            <div className="container-6no">
                <div className="__t-b6d style-WgKjv" id="style-WgKjv">
                    <button>
                        <a className="link-jrj" href="https://istanbul.platinumlist.net/ar/event-tickets/hagia-sophia-highlights-guided-tour-audio-guide">
                            <svg className="icon-arrow-left-rounded icon">
                                <use xlinkHref="#svg-icon-arrow-left-rounded"></use>
                            </svg>
                            رجوع
                        </a>
                    </button>
                </div>
                <div className="__bottom__GKaxoDSi0-ck9">
                    <div className="__c-7l3">
                        <div className="__c-q9c">
                            <button className="__control__peVh67wbv-ldt __c-i9s">
                                <svg className="icon-24-kit-arrowhead-right icon">
                                    <use xlinkHref="#svg-icon-24-kit-arrowhead-right"></use>
                                </svg>
                            </button>
                            <div className="__p-l7a __pageActive__zSSAXr-jno">
                                {monthsData.map((monthData, index) => (
                                    <div key={index} className="__m-cqb">
                                        <div className="__m-s86">
                                            <h5 className="__m-ple">{monthData.name}</h5>
                                        </div>
                                        <table className="grid-364">
                                            <tbody>
                                                <tr>
                                                    <th className="__weekDay__x82rC-yop">الإثنين</th>
                                                    <th className="__weekDay__x82rC-yop">الثلاثاء</th>
                                                    <th className="__weekDay__x82rC-yop">الأربعاء</th>
                                                    <th className="__weekDay__x82rC-yop">الخميس</th>
                                                    <th className="__weekDay__x82rC-yop">الجمعة</th>
                                                    <th className="__weekDay__x82rC-yop">السبت</th>
                                                    <th className="__weekDay__x82rC-yop">الأحد</th>
                                                </tr>
                                                {renderCalendarDays(monthData, index)}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                            <div className="__notice__cTvqCd3D-qk1">
                                <span className="__n-va6">
                                    <svg className="icon-exclamation-mark icon">
                                        <use xlinkHref="#svg-icon-exclamation-mark"></use>
                                    </svg>
                                </span>
                                <p className="__n-hc1">الأسعار المذكورة في الصفحة قد تكون مختلفة</p>
                            </div>
                        </div>
                    </div>
                    <div className="__d-xx4 __d-hk5">
                        <p className="title-f68">يرجى اختيار التاريخ والوقت للمتابعة</p>
                        <div className="__d-eiy">
                            <div className="__d-iyr">
                                <ul className="__d-f8o">
                                    {availableDates.map((date, index) => (
                                        <li key={index} className="__t-849">
                                            <button
                                                className={`__t-qeg ${selectedDate && selectedDate.day === date.day && selectedDate.month === date.month ? '__t-qeg-selected' : ''}`}
                                                onClick={() => handleDateClick(date.day, date.month, date.year)}
                                            >
                                                <span className="__w-z34">{date.weekDay}</span>
                                                <span className="__m-sbs">{date.day} {date.monthName}</span>
                                                <span className="__dayLabel__X-n1y"><span>من: </span> {date.price} EGP</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="__t-a81">
                                    <button className="__t-fw9">
                                        <span className="__c-f5g">
                                            <svg className="icon-24-kit-calendar icon">
                                                <use xlinkHref="#svg-icon-24-kit-calendar"></use>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Time Picker Section */}
                            {showTimePicker && selectedDate && (
                                <div className="__timePicker__section" style={{ marginTop: '20px' }}>
                                    <h6 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>
                                        اختر الوقت لـ {selectedDate.weekDay} {selectedDate.day} {selectedDate.monthName}
                                    </h6>
                                    <div className="__timeSlots__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                                        {selectedDate.times.map((timeSlot) => (
                                            <button
                                                key={timeSlot.id}
                                                className={`__timeSlot__btn ${selectedTime && selectedTime.id === timeSlot.id ? '__timeSlot__selected' : ''}`}
                                                onClick={() => handleTimeClick(timeSlot)}
                                                style={{
                                                    padding: '12px 16px',
                                                    border: selectedTime && selectedTime.id === timeSlot.id ? '2px solid #007bff' : '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    backgroundColor: selectedTime && selectedTime.id === timeSlot.id ? '#e7f3ff' : '#fff',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                    fontWeight: selectedTime && selectedTime.id === timeSlot.id ? 'bold' : 'normal',
                                                    color: selectedTime && selectedTime.id === timeSlot.id ? '#007bff' : '#333',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div>{timeSlot.time}</div>
                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                    {timeSlot.price} EGP
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            className={`__a-nk1 ${selectedDate && selectedTime ? '__a-nk1-active' : '__a-nk1-disabled'}`}
                            onClick={handleApply}
                            disabled={!selectedDate || !selectedTime}
                            style={{
                                opacity: selectedDate && selectedTime ? 1 : 0.5,
                                cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                                backgroundColor: selectedDate && selectedTime ? '#007bff' : '#ccc',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            تطبيق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Events