import { HoloHashed } from '@holochain-open-dev/core-types';
import { CalendarEvent } from './types';
export declare function eventToFullCalendar(calendarEvent: HoloHashed<CalendarEvent>): {
    id: string;
    title: string;
    start: string;
    end: string;
};
