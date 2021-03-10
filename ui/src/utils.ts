import { HoloHashed } from '@holochain-open-dev/core-types';
import { CalendarEvent } from './types';

export function eventToFullCalendar(calendarEvent: HoloHashed<CalendarEvent>) {
  return {
    id: calendarEvent.hash,
    title: calendarEvent.content.title,
    start: new Date(calendarEvent.content.startTime).toISOString(),
    end: new Date(calendarEvent.content.endTime).toISOString(),
  };
}
