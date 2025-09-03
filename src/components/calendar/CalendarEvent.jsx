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
  const [millisecondTimeZoneOffset, setMillisecondTimeZoneOffset] = useState(new Date().getTimezoneOffset() * 60000);

  const updateEvent = async () => {
    try {
      await database.execute('UPDATE events SET title = $1 WHERE id = $2', [eventTitle, event.id]);

      info(`Successfully updated event '${eventTitle}' [ID: '${event.id}']`);

      fetchEvents(new Date(event.event_timestamp_start));
      setUpdatingEvent((state) => !state);
    } catch(error) {
      error(`Error while updating event '${eventTitle}' [ID: '${event.id}']: ${error}`);
    }
  }

  const deleteEvent = async (id) => {
    try {
      await database.execute('DELETE FROM events WHERE id = $1;', [id]);
      fetchEvents(new Date(event.event_timestamp_start));

      info(`Successfully deleted event '${eventTitle}' [ID: '${id}']`);
    } catch(error) {
      error(`Error while deleting event '${eventTitle}' [ID: '${id}']: ${error}`);
    }
  }

  const cancelEventTitleEdits = () => {
    setUpdatingEvent((state) => !state);
    setEventTitle(event.title);
  }

  const getTimeDifference = () => {
    const startTime = new Date(event.event_timestamp_start);
    const endTime = new Date(event.event_timestamp_end);
    let timeDifference = endTime.getHours() - startTime.getHours();

    if (timeDifference < 1) {
      timeDifference = `${endTime.getMinutes() - startTime.getMinutes()} Minutes`;
    } else if (timeDifference === 1) {
      timeDifference = `${timeDifference} Hour`
    } else {
      timeDifference = `${timeDifference} Hours`
    }

    return timeDifference;
  }

  return (
    <li className="event">
      <span className="event-details">
        <div className="event-timestamp">
          {/* TODO - Revisit handling of Date objects so new instances are not created with each rendered component */}
          {new Date(event.event_timestamp_start + millisecondTimeZoneOffset).toLocaleTimeString([], {timeStyle: 'short'})}
          {event.event_timestamp_end && ` - ${new Date(event.event_timestamp_end + millisecondTimeZoneOffset).toLocaleTimeString([], {timeStyle: 'short'})} (${getTimeDifference()})`}
        </div>

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