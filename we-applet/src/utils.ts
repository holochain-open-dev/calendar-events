import { CalendarEvent } from "@calendar-events/elements";
import { Element, serializeHash } from '@holochain-open-dev/core-types';
import { decode } from '@msgpack/msgpack';
import { Event } from '@scoped-elements/event-calendar';
import { WeInfo } from ".";


export function extractCalendarEvent(record: Element): CalendarEvent {
  return decode((record.entry as any).Present.entry) as CalendarEvent;
}

export function eventToEventCalendar(calendarEventElement: Element, weGroupInfo?: WeInfo): Event {
  const calendarEvent = extractCalendarEvent(calendarEventElement);

  return {
    id: serializeHash(calendarEventElement.signed_header.hashed.hash),
    title: calendarEvent.title,
    allDay: false,
    backgroundColor: '#8bc6e5',
    extendedProps: {
      weGroupInfo: weGroupInfo
    },
    resourceIds: [],
    display: 'auto',
    durationEditable: false,
    editable: false,
    startEditable: false,
    start: new Date(calendarEvent.startTime),
    end: new Date(calendarEvent.endTime),
  };
}