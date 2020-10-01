import { CalendarEvent } from './types';

export function secsTimestampToDate(secs: number): Date {
  return new Date(secs * 1000);
}

export function dateToSecsTimestamp(date: Date): number {
  return Math.floor(date.valueOf() / 1000);
}

export function eventToFullCalendar(calendarEvent: CalendarEvent) {
  return {
    id: calendarEvent.id,
    title: calendarEvent.title,
    start: secsTimestampToDate(calendarEvent.startTime).toISOString(),
    end: secsTimestampToDate(calendarEvent.endTime).toISOString(),
  };
}