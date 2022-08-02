import { serializeHash } from '@holochain-open-dev/utils';
import { Record } from '@holochain/client';
import { decode } from '@msgpack/msgpack';
import { Event } from '@scoped-elements/event-calendar';
import { CalendarEvent } from './types';

export function extractCalendarEvent(record: Record): CalendarEvent {
  return decode((record.entry as any).Present.entry) as CalendarEvent;
}

export function eventToEventCalendar(calendarEventRecord: Record): Event {
  const calendarEvent = extractCalendarEvent(calendarEventRecord);

  return {
    id: serializeHash(calendarEventRecord.signed_action.hashed.hash),
    title: calendarEvent.title,
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
