import React, { useEffect, useRef, useState } from 'react';
import { info } from '@tauri-apps/plugin-log';

import { ButtonGroup, Button } from '../CommonComponents';
import { Save, X } from '../Icons';

import database from '../../database/database';

const CalendarEventEditor = ({setUpdatingEvent, event, fetchEvents}) => {
  const inputRef = useRef(null);
  const [eventTitle, setEventTitle] = useState(event.title);

  const updateEvent = async () => {
    try {
      await database.execute('UPDATE events SET title = $1 WHERE id = $2', [eventTitle, event.id]);

      info(`Updated event '${eventTitle}' with ID '${event.id}'`);

      fetchEvents();
      setUpdatingEvent((state) => !state);
    } catch(error) {
      console.error(`Error while updating event with ID '${event.id}': ${error}`);
    }
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <span className="event-details">
        <span className="event-timestamp">{new Date(event.event_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
          <input
            className='event-title-input'
            ref={inputRef}
            value={eventTitle}
            onChange={(changeEvent) => {setEventTitle(changeEvent.target.value)}}
            type='text'
            onKeyDown={(keyEvent) => {
              keyEvent.code === "Escape" && setUpdatingEvent((state) => !state);
              keyEvent.code === "Enter" && updateEvent();
            }}
          />
      </span>
      <ButtonGroup>
        <Button className='event-button mini' onClick={() => {setUpdatingEvent((state) => !state)}} children={<X />} toolTip="Cancel edit"/>
        <Button className='event-button mini' onClick={() => {updateEvent()}} children={<Save />} toolTip="Save event"/>
      </ButtonGroup>
    </>
  )
}

export default CalendarEventEditor