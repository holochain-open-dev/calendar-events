import { ApolloClient } from '@apollo/client/core';
import { LitElement } from 'lit-element';
import { Calendar } from '@fullcalendar/core';
import type { DateSelectArg } from '@fullcalendar/core';
import '@material/mwc-linear-progress';
import '@material/mwc-menu/mwc-menu-surface';
import type { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import { CalendarEvent } from '../types';
import { HodCreateCalendarEvent } from './hod-create-calendar-event';
/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart calendar - Style the calendar
 */
export declare abstract class HodMyCalendar extends LitElement {
    static get styles(): any[];
    /** Public attributes */
    /**
     * Initial calendar view (for reference visit https://fullcalendar.io/docs/plugin-index)
     * @type {'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'}
     * @attr initial-view
     */
    initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    /** Dependencies */
    abstract get _apolloClient(): ApolloClient<any>;
    /** Private properties */
    _loading: boolean;
    _myCalendarEvents: Array<CalendarEvent> | undefined;
    _calendarEl: HTMLElement;
    _createEventMenu: MenuSurface;
    _createEvent: HodCreateCalendarEvent;
    _calendar: Calendar;
    loadCalendarEvents(): Promise<void>;
    openCreateEventMenu(info: DateSelectArg): void;
    setupCalendar(): void;
    firstUpdated(): Promise<void>;
    renderCreateEventCard(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
}
