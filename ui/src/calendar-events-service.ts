import { Element } from '@holochain-open-dev/core-types';
import {
  AgentPubKey,
  AppWebsocket,
  CellId,
  HeaderHash,
} from '@holochain/client';

export class CalendarEventsService {
  constructor(
    protected appWebsocket: AppWebsocket,
    protected cellId: CellId,
    protected zomeName = 'calendar_events'
  ) {}

  async getAllCalendarEvents(): Promise<Element[]> {
    return this.callZome('get_all_calendar_events', null);
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
    invitees: AgentPubKey[];
  }): Promise<HeaderHash> {
    return this.callZome('create_calendar_event', {
      title,
      startTime,
      endTime,
      location,
      invitees,
    });
  }

  async getCalendarEvent(
    calendarEventHash: HeaderHash
  ): Promise<Element | undefined> {
    return this.callZome('get_calendar_event', calendarEventHash);
  }
  async callZome(fn_name: string, payload: any) {
    return this.appWebsocket.callZome({
      cap_secret: null as any,
      cell_id: this.cellId,
      zome_name: this.zomeName,
      fn_name: fn_name,
      payload: payload,
      provenance: this.cellId[1],
    });
  }
}
