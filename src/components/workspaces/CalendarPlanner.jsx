import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug, info, warn } from '@tauri-apps/plugin-log';
import Calendar from 'react-calendar';

import { Button, Modal } from '../CommonComponents'
import NewEventModal from '../calendar/NewEventModal';
import CalendarEvent from '../calendar/CalendarEvent';

import {
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDoubleChevronLeft,
  IconDoubleChevronRight
} from '../Icons';

import '../../styling/calendar.css';

import database from '../../database/database';

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

      if (events.length > 0) {
        info('Successfully retrieved all events');
      } else {
        warn('Request for calendar events successfully sent, however no events returned');
      }

      setCalendarEvents(events);
    } catch(error) {
      console.error(`Error while retrieving all events: ${error}`);
    }
  }

  const getEventCount = (date) => {
    let eventCount = 0;

    calendarEvents.forEach((event) => {
      doesEventTimestampMatchDate(date, event) && eventCount++;
    })

    debug(`Identified '${eventCount}' event${eventCount > 1 || eventCount === 0 ? 's' : ''} for '${date.toDateString()}'`);
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
      <div className="selected-day-summary-container">
        <div className='selected-day-summary-header'>
          <div className='selected-day-summary-details'>
            <h2>Events</h2>

            <div className="selected-day-summary-date">
              {new Intl.DateTimeFormat("en-GB", dateFormattingOptions).format(dateSelected === null ? date : dateSelected)}
            </div>
          </div>

          <Button children={<IconCalendarCheck />} toolTip={"Create new event"} onClick={() => {setShowModal(true)}}/>
        </div>

        <div className="selected-day-summary">
          {
            getEventCount(dateSelected) > 0 ?
              <ul className="selected-day-events-list scrollable">
                {calendarEvents.map((event) => {
                  if (doesEventTimestampMatchDate(dateSelected, event)) {
                    debug(`Rendering event '${event.title}' for date '${dateSelected.toDateString()}'`);
                    return <CalendarEvent key={event.id} event={event} fetchEvents={fetchEvents}/>
                  }
                })}
              </ul>
            :
              <div className="selected-day-no-events">Nothing to report</div>
          }
        </div>
      </div>

      <Calendar
        onChange={(value, event) => {
          setDate();
          setDateSelected(value);
        }}
        value={date}
        nextLabel={<IconChevronRight/>}
        next2Label={<IconDoubleChevronRight/>}
        prevLabel={<IconChevronLeft />}
        prev2Label={<IconDoubleChevronLeft/>}
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