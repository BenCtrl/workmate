import React, { useContext, useState } from 'react';
import { error, info, warn } from '@tauri-apps/plugin-log';

import { Button, Input } from '../CommonComponents';
import { IconClock } from '../Icons';

import { AlertContext } from '../common/Modal';
import database from '../../database/database';

const NewEventModal = ({eventDate, onNewEventSubmit}) => {
  const setAlert = useContext(AlertContext).setAlert;
  const [eventTitle, setEventTitle] = useState('');
  const [eventHour, setEventHour] = useState('00');
  const [eventMinute, setEventMinute] = useState('00');

  const createEvent = async (event) => {
    event.preventDefault();

    try {
      if (!eventTitle.trim()) {
        error('Event cannot be created - Title is empty');
        setAlert('error', 'Event title cannot be empty');
        return;
      }

      const event_timestamp = Date.parse(`${eventDate.getFullYear()}-${eventDate.getMonth()+1}-${eventDate.getDate()} ${eventHour}:${eventMinute}`);

      const createEventResult = await database.execute('INSERT INTO events (title, event_timestamp) VALUES ($1, $2);', [eventTitle, event_timestamp]);

      if (createEventResult.rowsAffected > 0) {
        info(`Event '${eventTitle}' was created [ID: '${createEventResult.lastInsertId}']`);
        setAlert('success', `Event '${eventTitle}' successfully created`);
      } else {
        warn(`Unable to validate if event '${eventTitle}' was created - No changes reported from database`);
      }

      onNewEventSubmit(new Date(event_timestamp));
    } catch(error) {
      console.error(`Error while creating new calendar event '${eventTitle}': '${error}'`);
    }
  }

  return (
    <>
      <form className="new-event-form" onSubmit={createEvent} action="">
        <div className="new-event-form-input modal-input-container">
          <div className="modal-input">
            <label htmlFor="new-event-title">Event Title</label>
            <Input
              name="new-event-title"
              id="new-event-title"
              placeholder='Title of Event'
              value={eventTitle}
              onChange={(changeEvent) => {setEventTitle(changeEvent.target.value)}}
              required={true}
            />
          </div>

          <div className="modal-input">
            <label htmlFor="new-event-time">Event Time</label>
            <span class="time-input-container" id="new-event-time" name="new-event-time">
              <IconClock style={{marginLeft: '0.4rem'}}/>
              <select title="Hour" value={eventHour} name="new-event-hour-select" id="new-event-hour-select" onChange={(changeEvent) => {setEventHour(changeEvent.target.value)}}>
                <option value="00">00</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
              </select>

              <select title="Minute" value={eventMinute} name="new-event-minute-select" id="new-event-minute-select" onChange={(changeEvent) => {setEventMinute(changeEvent.target.value)}} >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </span>
          </div>
        </div>

        <Button id="create-new-event" children={'Create New Event'} />
      </form>
    </>
  )
}

export default NewEventModal