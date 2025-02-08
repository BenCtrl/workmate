import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Calendar from 'react-calendar';

import { Button, Modal } from '../CommonComponents'
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  DoubleChevronLeft,
  DoubleChevronRight,
  Trash
} from '../Icons';

import database from '../../database/database';
import NewEventModal from '../calendar/NewEventModal';
import '../../styling/calendar.css';

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
      const events = await database.select('SELECT * FROM events;');
      setCalendarEvents(events);
    } catch(error) {
      console.log('Error while retrieving all events', error);
    }
  }

  const deleteEvent = async (id) => {
    try {
      const result = await database.execute('DELETE FROM events WHERE id = $1;', [id]);
      fetchEvents();
    } catch(error) {
      console.log(`Error while deleting event with ID '${id}'`, error);
    }
  }

  const getEventCount = (date) => {
    let eventCount = 0;

    calendarEvents.forEach((event) => {
      date.setHours(0,0,0,0) === new Date(event.event_timestamp).setHours(0,0,0,0) && eventCount++;
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
          <Button children={<CalendarCheck />} toolTip={"Create new event"} onClick={() => {setShowModal(true)}}/>
        </div>
        <div className="current-day-summary">
          {
            getEventCount(dateSelected) > 0 ?
            <ul className="current-day-events-list">
              {calendarEvents.map((event) => {
                if (dateSelected.setHours(0,0,0,0) === new Date(event.event_timestamp).setHours(0,0,0,0)) {
                  return <li key={event.id} className="current-day-event">
                    <span>
                      <span className="current-day-event-timestamp">{new Date(event.event_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                      {event.title}
                    </span>
                    <Button className="current-day-event-delete" onClick={() => {deleteEvent(event.id)}} children={<Trash />} toolTip="Delete event" />
                  </li>
                }
              })}
            </ul>
            :
            <div className="current-day-no-events">Nothing to report</div>
          }
        </div>
      </div>

      <Calendar
      onChange={(value, event) => {
        setDate();
        setDateSelected(value);
      }}
      value={date}
      nextLabel={<ChevronRight/>}
      next2Label={<DoubleChevronRight/>}
      prevLabel={<ChevronLeft />}
      prev2Label={<DoubleChevronLeft/>}
      formatDay={(locale, date) => <div>
        {getEventCount(date) > 0 && <span className="event-indicator">{getEventCount(date)}</span>}
        <span className="date-of-month">{date.getDate()}</span>
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