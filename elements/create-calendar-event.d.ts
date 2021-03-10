import { TextField } from 'scoped-material-components/mwc-textfield';
import { Button } from 'scoped-material-components/mwc-button';
import { CalendarEvent } from '../types';
import { BaseCalendarElement } from './base-calendar';
/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart event-title - Style the event title textfield
 */
export declare abstract class CreateCalendarEvent extends BaseCalendarElement {
    static get styles(): import("lit-element").CSSResult;
    static get scopedElements(): {
        'mwc-textfield': typeof TextField;
        'mwc-button': typeof Button;
    };
    /** Public attributes */
    /**
     * Initial calendar event parameters with which to populate the form
     * @type Partial<CalendarEvent>
     */
    initialEventProperties: Partial<CalendarEvent> | undefined;
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
