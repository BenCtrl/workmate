import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Calendar from 'react-calendar';
import { debug, info } from '@tauri-apps/plugin-log';

import { Button, DeleteConfirmButton, Modal } from '../CommonComponents'
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

      info('Successfully retrieved all events');
    } catch(error) {
      console.error(`Error while retrieving all events: ${error}`);
    }
  }

  const deleteEvent = async (id) => {
    try {
      const result = await database.execute('DELETE FROM events WHERE id = $1;', [id]);
      fetchEvents();

      info(`Successfully deleted event with ID '${id}'`);
    } catch(error) {
      console.error(`Error while deleting event with ID '${id}': ${error}`);
    }
  }

  const getEventCount = (date) => {
    let eventCount = 0;

    calendarEvents.forEach((event) => {
      doesEventTimestampMatchDate(date, event) && eventCount++;
    })

    debug(`Identified '${eventCount}' event${eventCount > 1 ? 's' : ''} for '${date.toDateString()}'`);
    return eventCount;
  }

  /**
   * Compares a given calendar `Date` object against a given calendar Event `event_timestamp` property and returns whether the date matches
   * @param {Date} calendarDate - `Date` object
   * @param {any} calendarEvent - Event object
   */
  const doesEventTimestampMatchDate = (calendarDate, calendarEvent) => {
    return calendarDate.setHours(0,0,0,0) === new Date(calendarEvent.event_timestamp).setHours(0,0,0,0) ? true : false;
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
                if (doesEventTimestampMatchDate(dateSelected, event)) {
                  debug(`Rendering event '${event.title}' for date '${dateSelected.toDateString()}'`);

                  return <li key={event.id} className="current-day-event">
                    <span>
                      <span className="current-day-event-timestamp">{new Date(event.event_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                      {event.title}
                    </span>
                    <DeleteConfirmButton className="current-day-event-delete" onClick={() => {deleteEvent(event.id)}} children={<Trash />} toolTip="Delete event" />
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
      formatDay={(locale, date) => {
        const eventCount = getEventCount(date);

        return <div>
          {eventCount > 0 && <span className="event-indicator">{eventCount}</span>}
          <span className="date-of-month">{date.getDate()}</span>
        </div>
      }}
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