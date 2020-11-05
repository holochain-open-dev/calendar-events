import { Resolvers } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';

function secondsToTimestamp(secs: number) {
  return [secs, 0];
}

export const calendarEventsResolvers = (
  appWebsocket: AppWebsocket,
  cellId: CellId,
  zomeName = 'calendar_events'
): Resolvers => ({
  Query: {
    async myCalendarEvents() {
      const events = await appWebsocket.callZome({
        cap: null as any,
        cell_id: cellId,
        zome_name: zomeName,
        fn_name: 'get_my_calendar_events',
        payload: null,
        provenance: cellId[1],
      });

      return events.map(
        ({ entry_hash, entry }: { entry_hash: string; entry: any }) => ({
          id: entry_hash,
          ...entry,
          startTime: entry.startTime[0],
          endTime: entry.endTime[0],
          createdBy: entry.createdBy,
        })
      );
    },
  },
  Mutation: {
    async createCalendarEvent(
      _,
      { title, startTime, endTime, location, invitees }
    ) {
      const { entry_hash, entry } = await appWebsocket.callZome({
        cap: null as any,
        cell_id: cellId,
        zome_name: zomeName,
        fn_name: 'create_calendar_event',
        payload: {
          title,
          startTime: secondsToTimestamp(startTime),
          endTime: secondsToTimestamp(endTime),
          location,
          invitees,
        },
        provenance: cellId[1],
      });

      return {
        id: entry_hash,
        ...entry,
      };
    },
  },
});
