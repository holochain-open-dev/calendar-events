import { Calendar } from '@fullcalendar/core';
import type { DateSelectArg } from '@fullcalendar/core';
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';
import { CalendarEvent } from '../types';
import { CreateCalendarEvent } from './create-calendar-event';
import { HoloHashed } from '@holochain-open-dev/core-types';
import { BaseCalendarElement } from './base-calendar';
/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart calendar - Style the calendar
 */
export declare abstract class MyCalendar extends BaseCalendarElement {
    /** Public attributes */
    /**
     * Initial calendar view (for reference visit https://fullcalendar.io/docs/plugin-index)
     * @type {'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'}
     * @attr initial-view
     */
    initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    /** Private properties */
    _loading: boolean;
    _myCalendarEvents: Array<HoloHashed<CalendarEvent>> | undefined;
    _calendarEl: HTMLElement;
    _createEventMenu: MenuSurface;
    _createEvent: CreateCalendarEvent;
    _calendar: Calendar;
    static get styles(): any[];
    loadCalendarEvents(): Promise<void>;
    getEventBeingCreated(): HTMLElement | undefined;
    openCreateEventMenu(info: DateSelectArg): void;
    setupCalendar(): void;
    firstUpdated(): Promise<void>;
    renderCreateEventCard(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
    getScopedElements(): {
        'mwc-menu-surface': typeof MenuSurface;
        'mwc-linear-progress': typeof LinearProgress;
        'hod-create-calendar-event': any;
    };
}
