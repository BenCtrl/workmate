import React, { useEffect, useState } from 'react';
import { eventsLoader } from '../workspaces/CalendarPlanner';

const CalendarDay = ({date}) => {
  const [eventCount, setEventCount] = useState(0);

  const getEventCount = async () => {
    const events = await eventsLoader(date);
    setEventCount(events.length);
  }

  useEffect(() => {
    getEventCount();
  }, []);

  return (
    <div>
      {eventCount > 0 && <span className="event-indicator">{eventCount}</span>}
      <span className="date-of-month">{date.getDate()}</span>
    </div>
  )
}

export default CalendarDay;