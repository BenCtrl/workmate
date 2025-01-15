import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { MdEvent } from "react-icons/md";
import {
  HiChevronRight,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronDoubleLeft,
  HiOutlineTrash 
} from "react-icons/hi2";

import Calendar from 'react-calendar';

import Button from '../Button';
import Modal from '../Modal';
import '../../styling/calendar.css'
import NewEventModal from '../NewEventModal';

const CalendarPlanner = () => {
  const dateObject = new Date();

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [date, setDate] = useState(dateObject);
  const [dateSelected, setDateSelected] = useState(dateObject);
  const [showModal, setShowModal] = useState(false);

  const dateFormattingOptions = {
    weekday: "long",
    year: "numeric",
    day: "numeric",
    month: "long",
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();

      setCalendarEvents(data);
      console.log('Successfully fetched events!');
    } catch(error) {
        console.log('Error fetching calendar events...', error);
    }
  }

  const deleteEvent = async (id) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE'
    });

    fetchEvents();
    return;
  }

  const getEventCount = (date) => {
    let eventCount = 0;

    calendarEvents.forEach((event) => {
      date.setHours(0,0,0,0) === new Date(event.timestamp).setHours(0,0,0,0) && eventCount++;
    })

    return eventCount;
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="calendar-wrapper">
      <div className="calendar-day-summary-container">
        <div className='calendar-day-summary-header'>
          <div>
            <h2>Events</h2>
            <div className="calendar-day-summary-date">{new Intl.DateTimeFormat("en-GB", dateFormattingOptions).format(dateSelected === null ? date : dateSelected)}</div>
          </div>
          <Button children={<MdEvent />} toolTip={"Create New Event"} onClick={() => {setShowModal(true)}}/>
        </div>
        <div className="current-day-summary">
          <ul className="current-day-events-list">
            {calendarEvents.map((event) => {
              if (dateSelected.setHours(0,0,0,0) === new Date(event.timestamp).setHours(0,0,0,0)) {
                return <li key={event.id} className="current-day-event">
                  <span>
                    <span className="current-day-event-timestamp">{new Date(event.timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                    {event.title}
                  </span>
                  <Button className="current-day-event-delete" onClick={() => {deleteEvent(event.id)}} children={<HiOutlineTrash />} toolTip="Delete Page" />
                </li>
              }
            })}
          </ul>
        </div>
      </div>

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
      formatDay={(locale, date) => <div>
        {getEventCount(date) > 0 && <span className="event-indicator">{getEventCount(date)}</span>}
        <span class="date-of-month">{date.getDate()}</span>
      </div>}
      />

      {showModal &&
        createPortal(
          <Modal children={<NewEventModal eventDate={dateSelected} onNewEventSubmit={fetchEvents} />} onClose={() => setShowModal(false)} modalHeading={'New Event'}/>,
          document.body
        )
      }
    </div>
  )
}

export default CalendarPlanner;