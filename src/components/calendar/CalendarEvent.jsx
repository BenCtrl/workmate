import React, { useContext, useState } from 'react'
import { info } from '@tauri-apps/plugin-log';

import { Button, ButtonGroup, DeleteConfirmButton } from '../CommonComponents';
import { IconSave, IconTrash, IconX } from '../Icons';
import { AppSettingsContext } from '../../App';

import database from '../../database/database';

const CalendarEvent = ({event, fetchEvents}) => {
  const SETTINGS = useContext(AppSettingsContext).appSettings;
  const [updatingEvent, setUpdatingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState(event.title);

  const updateEvent = async () => {
    try {
      await database.execute('UPDATE events SET title = $1 WHERE id = $2', [eventTitle, event.id]);

      info(`Updated event '${eventTitle}' with ID '${event.id}'`);

      fetchEvents(new Date(event.event_timestamp));
      setUpdatingEvent((state) => !state);
    } catch(error) {
      console.error(`Error while updating event with ID '${event.id}': ${error}`);
    }
  }

  const deleteEvent = async (id) => {
    try {
      await database.execute('DELETE FROM events WHERE id = $1;', [id]);
      fetchEvents(new Date(event.event_timestamp));

      info(`Successfully deleted event with ID '${id}'`);
    } catch(error) {
      console.error(`Error while deleting event with ID '${id}': ${error}`);
    }
  }

  const cancelEventTitleEdits = () => {
    setUpdatingEvent((state) => !state);
    setEventTitle(event.title);
  }

  return (
    <li className="event">
      <span className="event-details">
        <span className="event-timestamp">
          {new Date(event.event_timestamp).toLocaleTimeString([], {timeStyle: 'short'})}
        </span>

        {updatingEvent ?
          <input
            className='inline-title-input'
            autoFocus
            value={eventTitle}
            type='text'
            onChange={(changeEvent) => {setEventTitle(changeEvent.target.value)}}
            onKeyDown={(keyEvent) => {
              if (keyEvent.code === "Escape") {
                cancelEventTitleEdits()
              }
              keyEvent.code === "Enter" && updateEvent();
            }}
          />
        :
          <span title={`${SETTINGS.TOOLTIPS ? 'Edit event title':''}`} className="event-title" onClick={() => {setUpdatingEvent((state) => !state)}}>
            {event.title}
          </span>
        }
      </span>

      {updatingEvent ?
        <ButtonGroup>
          <Button className='event-button small' onClick={() => {cancelEventTitleEdits()}} children={<IconX />} toolTip="Cancel edit"/>
          <Button className='event-button small' onClick={() => {updateEvent()}} children={<IconSave />} toolTip="Save event"/>
        </ButtonGroup>
      :
        <DeleteConfirmButton className="event-button small" onClick={() => {deleteEvent(event.id)}} children={<IconTrash />} toolTip="Delete event" />
      }
    </li>
  )
}

export default CalendarEvent