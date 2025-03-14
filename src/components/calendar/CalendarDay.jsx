import React, { useEffect, useState } from 'react';
import { eventsLoader } from '../workspaces/CalendarPlanner';

import { IconClock } from '../Icons';

const CalendarDay = ({date}) => {
  const [eventCount, setEventCount] = useState(0);

  const getEventCount = async () => {
    const events = await eventsLoader(date);
    setEventCount(events.length);
  }

  useEffect(() => {
    getEventCount();
  }, [date]);

  return (
    <div className="date-of-month-container">
      <span className="date-of-month">{date.getDate()}</span>
      {eventCount > 0 && <span className="event-indicator" title="Scheduled events"><IconClock />{eventCount}</span>}
    </div>
  )
}

export default CalendarDay;