import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { CalendarEvent } from '../types';
import { HoloHashed } from '@holochain-open-dev/core-types';
import { BaseCalendarElement } from './base-calendar';
/**
 */
export declare abstract class CalendarEventDetail extends BaseCalendarElement {
    static get styles(): import("lit-element").CSSResult;
    static get scopedElements(): {
        'mwc-circular-progress': typeof CircularProgress;
    };
    /** Public attributes */
    /**
     * Calendar event hash to retrieve from the DNA
     * @type String
     */
    calendarEventHash: string;
    /** Private properties */
    _calendarEvent: HoloHashed<CalendarEvent> | undefined;
    firstUpdated(): void;
    loadEvent(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
