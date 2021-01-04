import { Hashed } from '@holochain-open-dev/common';
import { CalendarEvent } from './types';

export function eventToFullCalendar(calendarEvent: Hashed<CalendarEvent>) {
  return {
    id: calendarEvent.hash,
    title: calendarEvent.content.title,
    start: new Date(calendarEvent.content.startTime).toISOString(),
    end: new Date(calendarEvent.content.endTime).toISOString(),
  };
}
