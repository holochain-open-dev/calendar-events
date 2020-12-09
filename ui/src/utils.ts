import { CalendarEvent } from './types';

export function eventToFullCalendar(calendarEvent: CalendarEvent) {
  return {
    id: calendarEvent.id,
    title: calendarEvent.title,
    start: new Date(calendarEvent.startTime).toISOString(),
    end: new Date(calendarEvent.endTime).toISOString(),
  };
}
 