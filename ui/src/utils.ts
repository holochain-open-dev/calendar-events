import { CalendarEvent } from './types';

export function eventToFullCalendarEvent(calendarEvent: CalendarEvent) {
  return {
    title: calendarEvent.title,
    start: new Date(calendarEvent.startTime).toISOString(),
    end: new Date(calendarEvent.endTime).toISOString(),
  };
}
