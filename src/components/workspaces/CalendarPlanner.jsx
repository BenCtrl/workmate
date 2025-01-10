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

  useEffect(() => {
    fetchEvents();
  }, [])

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
        <div className='calendar-day-summary-header'>
          <h2>{new Intl.DateTimeFormat("en-GB", dateFormattingOptions).format(dateSelected === null ? date : dateSelected)}</h2>
          <Button children={<MdEvent />} toolTip={"Create New Event"} onClick={() => {setShowModal(true)}}/>
        </div>
        <div className="current-day-summary">
          <ul className="current-day-events-list">
            {calendarEvents.map((event) => {
              if (dateSelected.setHours(0,0,0,0) === new Date(event.timestamp).setHours(0,0,0,0)) {
                const eventHours = new Date(event.timestamp).getHours();
                const eventMinutes = new Date(event.timestamp).getMinutes();
                console.log(`Event Minutes: ${eventMinutes}`);

                return <li key={event.id} className="current-day-event">
                  <span>
                    <span className="current-day-event-timestamp">{`${eventHours < 10 ? '0' : ''}${eventHours}`}:{`${eventMinutes < 10 ? '0' : ''}${eventMinutes}`}</span>{event.title}
                  </span>
                  <Button className="current-day-event-delete" onClick={() => {deleteEvent(event.id)}} children={<HiOutlineTrash />} toolTip="Delete Page" />
                </li>
              }
            })}
          </ul>
        </div>
      </div>

      <style>
        {`${calendarEvents.map((event) => {
          return `button:has(abbr[aria-label="${new Intl.DateTimeFormat("en-GB", {month: 'long'}).format(new Date(event.timestamp))} ${new Intl.DateTimeFormat("en-GB", {day: 'numeric'}).format(new Date(event.timestamp))}, ${new Intl.DateTimeFormat("en-GB", {year: 'numeric'}).format(new Date(event.timestamp))}"])::after\n`
        })}
          {
            content: '';
            width: 1rem;
            height: 1rem;
            position: absolute;
            background-color: var(--button-active-accent-color);
            top: 0.4rem;
            left: 0.4rem;
            border-radius: 25%;
          }
        `}
      </style>

      {showModal &&
        createPortal(
          <Modal children={<NewEventModal eventDate={dateSelected} onNewEventSubmit={fetchEvents} />} onClose={() => setShowModal(false)} modalHeading={'New Event'}/>,
          document.body
        )
      }
    </>
  )
}

export default CalendarPlanner;