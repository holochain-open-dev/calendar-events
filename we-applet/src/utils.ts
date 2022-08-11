import { CalendarEvent } from "@calendar-events/elements";
import { Element, serializeHash } from '@holochain-open-dev/core-types';
import { decode } from '@msgpack/msgpack';
import { Event } from '@scoped-elements/event-calendar';


export function extractCalendarEvent(record: Element): CalendarEvent {
  return decode((record.entry as any).Present.entry) as CalendarEvent;
}

export function eventToEventCalendar(calendarEventElement: Element, titlePrefix?: String): Event {
  const calendarEvent = extractCalendarEvent(calendarEventElement);

  return {
    id: serializeHash(calendarEventElement.signed_header.hashed.hash),
    title: titlePrefix ? titlePrefix + calendarEvent.title : calendarEvent.title,
    allDay: false,
    backgroundColor: 'blue',
    extendedProps: {},
    resourceIds: [],
    display: 'auto',
    durationEditable: false,
    editable: false,
    startEditable: false,
    start: new Date(calendarEvent.startTime),
    end: new Date(calendarEvent.endTime),
  };
}