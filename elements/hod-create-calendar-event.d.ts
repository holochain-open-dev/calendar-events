import { ApolloClient } from '@apollo/client/core';
import { LitElement } from 'lit-element';
import '@material/mwc-textfield';
import type { TextField } from '@material/mwc-textfield';
import '@material/mwc-button';
import { CalendarEvent } from '../types';
/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart event-title - Style the event title textfield
 */
export declare abstract class HodCreateCalendarEvent extends LitElement {
    static get styles(): import("lit-element").CSSResult;
    /** Public attributes */
    /**
     * Initial calendar event parameters with which to populate the form
     * @type Partial<CalendarEvent>
     */
    initialEventProperties: Partial<CalendarEvent> | undefined;
    /** Dependencies */
    abstract get _apolloClient(): ApolloClient<any>;
    /** Private properties */
    _titleField: TextField;
    createEvent(): Promise<void>;
    render(): import("lit-element").TemplateResult;
    /**
     * Clears all previously filled values of the form
     * @method
     */
    clear(): void;
}
