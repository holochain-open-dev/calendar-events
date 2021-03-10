import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { HoloHashed } from '@holochain-open-dev/core-types';
import { CalendarEvent } from './types';
export declare class CalendarEventsService {
    protected appWebsocket: AppWebsocket;
    protected cellId: CellId;
    protected zomeName: string;
    constructor(appWebsocket: AppWebsocket, cellId: CellId, zomeName?: string);
    getAllCalendarEvents(): Promise<Array<HoloHashed<CalendarEvent>>>;
    createCalendarEvent({ title, startTime, endTime, location, invitees, }: {
        title: string;
        startTime: number;
        endTime: number;
        location?: string;
        invitees: string[];
    }): Promise<HoloHashed<CalendarEvent>>;
    getCalendarEvent(calendarEventHash: string): Promise<HoloHashed<CalendarEvent>>;
    callZome(fn_name: string, payload: any): Promise<any>;
    /** Helpers */
    private entryToEvent;
}
