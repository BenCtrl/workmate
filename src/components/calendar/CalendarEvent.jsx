import React, { useContext, useEffect, useRef, useState } from 'react'
import { info } from '@tauri-apps/plugin-log';

import { DeleteConfirmButton, Button, ButtonGroup } from '../CommonComponents';
import { Save, Trash, X } from '../Icons';
import { AppSettingsContext } from '../../App';

import database from '../../database/database';
import CalendarEventEditor from './CalendarEventEditor';

const CalendarEvent = ({event, fetchEvents}) => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;
  const [updatingEvent, setUpdatingEvent] = useState(false);

  const deleteEvent = async (id) => {
    try {
      await database.execute('DELETE FROM events WHERE id = $1;', [id]);
      fetchEvents();

      info(`Successfully deleted event with ID '${id}'`);
    } catch(error) {
      console.error(`Error while deleting event with ID '${id}': ${error}`);
    }
  }

  return (
    <li key={event.id} className={`event ${updatingEvent ? 'updating' : ''}`}>
      {updatingEvent ?
        <CalendarEventEditor setUpdatingEvent={setUpdatingEvent} fetchEvents={fetchEvents} event={event} />
        :
        <>
          <span className="event-details">
          <span className="event-timestamp">{new Date(event.event_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}</span>
            <span title={`${SETTINGS.TOOLTIPS ? 'Edit event title':''}`} className="event-title" onClick={() => {setUpdatingEvent((state) => !state)}}>{event.title}</span>
          </span>
          <DeleteConfirmButton className="event-button mini" onClick={() => {deleteEvent(event.id)}} children={<Trash />} toolTip="Delete event" />
        </>
      }
    </li>
  )
}

export default CalendarEvent