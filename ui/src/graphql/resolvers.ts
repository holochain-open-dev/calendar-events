import { Resolvers } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { timestampToMillis, millisToTimestamp } from '@holochain-open-dev/common';

export function calendarEventsResolvers(
  appWebsocket: AppWebsocket,
  cellId: CellId,
  zomeName = 'calendar_events'
): Resolvers {
  async function callZome(fn_name: string, payload: any) {
    return appWebsocket.callZome({
      cap: null as any,
      cell_id: cellId,
      zome_name: zomeName,
      fn_name: fn_name,
      payload: payload,
      provenance: cellId[1],
    });
  }

  return {
    CalendarEventsMembrane: {
      async myCalendarEvents(membrane) {
        const events = await callZome('get_my_calendar_events', null);

        return events.map(
          ({ entry_hash, entry }: { entry_hash: string; entry: any }) => ({
            id: entry_hash,
            ...entry,
            startTime: timestampToMillis(entry.startTime),
            endTime: timestampToMillis(entry.endTime),
          })
        );
      },
      async calendarEvent(membrane, { calendarEventId }) {
        const calendarEvent = await callZome(
          'get_calendar_event',
          calendarEventId
        );

        return {
          id: calendarEventId,
          ...calendarEvent,
          startTime: timestampToMillis(calendarEvent.startTime),
          endTime: timestampToMillis(calendarEvent.endTime),
        };
      },
    },
    Mutation: {
      async createCalendarEvent(
        _,
        { title, startTime, endTime, location, invitees }
      ) {
        const { entry_hash, entry } = await callZome('create_calendar_event',
          {
            title,
            startTime: millisToTimestamp(startTime),
            endTime: millisToTimestamp(endTime),
            location,
            invitees,
          });

        return {
          id: entry_hash,
          ...entry,
          startTime: timestampToMillis(entry.startTime),
          endTime: timestampToMillis(entry.endTime),
        };
      },
    },
  };
}
