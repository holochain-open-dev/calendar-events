import { AppWebsocket, CellId } from '@holochain/conductor-api';
import {
  timestampToMillis,
  millisToTimestamp,
} from '@holochain-open-dev/common';
import { CalendarEvent } from './types';
import { Hashed } from 'compository';

export class CalendarEventsService {
  constructor(
    protected appWebsocket: AppWebsocket,
    protected cellId: CellId,
    protected zomeName = 'calendar_events'
  ) {}

  async getMyCalendarEvents(): Promise<Array<Hashed<CalendarEvent>>> {
    const events = await this.callZome('get_my_calendar_events', null);

    return events.map(
      ({ entry_hash, entry }: { entry_hash: string; entry: any }) => ({
        hash: entry_hash,
        content: this.entryToEvent(entry),
      })
    );
  }

  private entryToEvent(entry: any): CalendarEvent {
    return {
      ...entry,
      startTime: timestampToMillis(entry.startTime),
      endTime: timestampToMillis(entry.endTime),
    };
  }

  async getCalendarEvent(
    calendarEventHash: string
  ): Promise<Hashed<CalendarEvent>> {
    const calendarEvent = await this.callZome(
      'get_calendar_event',
      calendarEventHash
    );

    return {
      hash: calendarEventHash,
      content: this.entryToEvent(calendarEvent),
    };
  }

  async createCalendarEvent({
    title,
    startTime,
    endTime,
    location,
    invitees,
  }: {
    title: string;
    startTime: number;
    endTime: number;
    location?: string;
    invitees: string[];
  }): Promise<Hashed<CalendarEvent>> {
    const { entry_hash, entry } = await this.callZome('create_calendar_event', {
      title,
      startTime: millisToTimestamp(startTime),
      endTime: millisToTimestamp(endTime),
      location,
      invitees,
    });

    return {
      hash: entry_hash,
      content: this.entryToEvent(entry),
    };
  }

  async callZome(fn_name: string, payload: any) {
    return this.appWebsocket.callZome({
      cap: null as any,
      cell_id: this.cellId,
      zome_name: this.zomeName,
      fn_name: fn_name,
      payload: payload,
      provenance: this.cellId[1],
    });
  }
}
