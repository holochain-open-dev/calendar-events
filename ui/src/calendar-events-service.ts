import {
  AgentPubKey,
  AppWebsocket,
  CellId,
  HeaderHash,
} from '@holochain/client';
import { Element } from '@holochain-open-dev/core-types';
import { ElementInfo } from './types';

export class CalendarEventsService {
  singleCellId: CellId | undefined;

  constructor(
    protected appWebsocket: AppWebsocket,
    protected cellIds: CellId[],
    protected zomeName = 'calendar_events_coordinator'
  ) {
    this.singleCellId = cellIds.length === 1 ? cellIds[0] : undefined;
  }

  async getAllCalendarEvents(): Promise<ElementInfo[]> {
    let recordInfos: ElementInfo[] = [];
    await Promise.all(
      this.cellIds.map(async cellId => {
        const cellRecords: Element[] = await this.callZome(
          'get_all_calendar_events',
          null,
          cellId
        );
        const cellRecordInfos: ElementInfo[] = cellRecords.map((element: Element) => {
          return {
            element,
            provenance: cellId,
          };
        });
        recordInfos = [...recordInfos, ...cellRecordInfos];
      })
    );
    return recordInfos;
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
  }): Promise<HeaderHash | void> {
    if (this.singleCellId) {
      return this.callZome(
        'create_calendar_event',
        {
          title,
          startTime,
          endTime,
          location,
          invitees,
        },
        this.singleCellId
      );
    } else {
      console.error(
        'createCalendarEvent can only be called if the CellId is unambiguous.'
      );
    }
  }

  async getCalendarEvent(
    calendarEventHash: HeaderHash
  ): Promise<Element | undefined> {
    if (this.singleCellId) {
      return this.callZome(
        'get_calendar_event',
        calendarEventHash,
        this.singleCellId
      );
    } else {
      console.error(
        'getCalendarEvent can only be called if the CellId is unambiguous.'
      );
    }
  }
  async callZome(fn_name: string, payload: any, cellId: CellId) {
    return this.appWebsocket.callZome({
      cap_secret: null as any,
      cell_id: cellId,
      zome_name: this.zomeName,
      fn_name: fn_name,
      payload: payload,
      provenance: cellId[1],
    });
  }
}
