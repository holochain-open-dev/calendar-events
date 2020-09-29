import { CalendarEvent } from './types';

export function eventToSchedule(calendarEvent: CalendarEvent) {
  return {
    title: calendarEvent.title,
    start: new Date(calendarEvent.startTime * 1000).toISOString(),
    end: new Date(calendarEvent.endTime * 1000).toISOString(),
    id: calendarEvent.id,
    calendarId: '1',
    category: 'time',
  };
}
