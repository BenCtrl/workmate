import React, { useState } from 'react'
import { HiChevronRight, HiChevronDoubleRight, HiChevronLeft, HiChevronDoubleLeft } from "react-icons/hi2";
import Calendar from 'react-calendar'
import '../../styling/calendar.css'

const CalendarPlanner = () => {
  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(null);

  const dateFormattingOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <>
      <Calendar
      onChange={(value, event) => {
        setDate();
        setDateSelected(value);
      }}
      value={date}
      nextLabel={<HiChevronRight/>}
      next2Label={<HiChevronDoubleRight/>}
      prevLabel={<HiChevronLeft />}
      prev2Label={<HiChevronDoubleLeft/>}
      />
      <div className="calendar-day-summary-container">
        <h2>{new Intl.DateTimeFormat("en-GB", dateFormattingOptions).format(dateSelected === null ? date : dateSelected)}</h2>
        <div className="current-day-summary">
          Nothing to report for this day
        </div>
      </div>
    </>
  )
}

export default CalendarPlanner