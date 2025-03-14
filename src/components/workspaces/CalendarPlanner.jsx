import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug, info } from '@tauri-apps/plugin-log';
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
// import 'react-calendar/dist/Calendar.css';

import database from '../../database/database';
import CalendarDay from '../calendar/CalendarDay';

const CalendarPlanner = () => {
  const dateObject = new Date();

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(dateObject);
  const [selectedDate, setSelectedDate] = useState(dateObject);
  const [showModal, setShowModal] = useState(false);

  const dateFormattingOptions = {
    weekday: "long",
    year: "numeric",
    day: "numeric",
    month: "long",
  };

  const fetchEventsForDate = async (date) => {
    setEvents(await eventsLoader(date));
  }

  useEffect(() => {
    fetchEventsForDate(currentDate);
  }, [])

  return (
    <div className="calendar-wrapper">
      <div className="selected-day-summary-container">
        <div className='selected-day-summary-header'>
          <div className='selected-day-summary-details'>
            <h2>Events</h2>

            <div className="selected-day-summary-date">
              {new Intl.DateTimeFormat("en-GB", dateFormattingOptions).format(selectedDate === null ? currentDate : selectedDate)}
            </div>
          </div>

          <Button children={<IconCalendarCheck />} toolTip={"Create new event"} onClick={() => {setShowModal(true)}}/>
        </div>

        <div className="selected-day-summary">
          {
            events.length > 0 ?
              <ul className="selected-day-events-list scrollable">
                {events.map((event) => {
                  debug(`Rendering event '${event.title}' for date '${selectedDate.toDateString()}'`);
                  return <CalendarEvent key={event.id} event={event} fetchEvents={fetchEventsForDate} />
                })}
              </ul>
            :
              <div className="selected-day-no-events">Nothing to report</div>
          }
        </div>
      </div>

      <Calendar
        onChange={(value, event) => {
          setCurrentDate();
          setSelectedDate(value);
          fetchEventsForDate(value);
        }}
        value={currentDate}
        nextLabel={<IconChevronRight/>}
        next2Label={<IconDoubleChevronRight/>}
        prevLabel={<IconChevronLeft />}
        prev2Label={<IconDoubleChevronLeft/>}
        showFixedNumberOfWeeks={true}
        minDetail={'decade'}
        formatDay={(locale, date) => {
          return <CalendarDay date={date} />;
        }}
      />

      {showModal &&
        createPortal(
          <Modal children={<NewEventModal eventDate={selectedDate} onNewEventSubmit={fetchEventsForDate} />} onClose={() => setShowModal(false)} modalHeading={'New Event'}/>,
          document.body
        )
      }
    </div>
  )
}

const eventsLoader = async (date) => {
  try {
    const dateTimeStamp = Date.parse(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
    debug(`Processed date '${date.toDateString()}' to timestamp '${dateTimeStamp}'`);

    const eventsFromDatabase = await database.select("SELECT * FROM events WHERE date(event_timestamp/1000, 'unixepoch') = date($1/1000, 'unixepoch') ORDER BY event_timestamp ASC", [dateTimeStamp]);

    info(`Identified '${eventsFromDatabase.length}' event${eventsFromDatabase.length > 1 || eventsFromDatabase.length === 0 ? 's' : ''} for '${date.toDateString()}'`);
    return eventsFromDatabase;
  } catch (processError) {
    error(`Error while attempting to count events for date '${date.toDateString()}': ${processError}`);
  }
}

export {CalendarPlanner as default, eventsLoader};