import React, { useState } from 'react';
import { HiOutlineClock } from "react-icons/hi2";
import Button from '../common/Button';
import Input from '../common/Input';

const NewEventModal = ({eventDate, onNewEventSubmit}) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventHour, setEventHour] = useState('00');
  const [eventMinute, setEventMinute] = useState('00');

  const createEvent = async (event) => {
    event.preventDefault();

    const newEvent = {
      "title": eventTitle,
      "timestamp": Date.parse(`${eventDate.getFullYear()}-${eventDate.getMonth()+1}-${eventDate.getDate()} ${eventHour}:${eventMinute}`),
      "dateCreated": new Date().now
    }

    try {
      await fetch(`/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });
      console.log('Successfully created new event!');
    } catch(error) {
        console.log('Error while creating new event', error);
    }

    onNewEventSubmit();
    return;
  }

  return (
    <>
      <form className="new-event-form" onSubmit={createEvent} action="">
        <div className="new-event-form-input">
          <Input name="new-event-title" id="new-event-title" placeholder='Title of Event' value={eventTitle} onChange={(changeEvent) => {setEventTitle(changeEvent.target.value)}} /> 

          <div className="new-event-time-select">
            <span class="time-input-container">
              <HiOutlineClock style={{marginLeft: '0.4rem'}}/>
              <select value={eventHour} name="new-event-hour-select" id="new-event-hour-select" onChange={(changeEvent) => {setEventHour(changeEvent.target.value)}}>
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

              <select value={eventMinute} name="new-event-minute-select" id="new-event-minute-select" onChange={(changeEvent) => {setEventMinute(changeEvent.target.value)}} >
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