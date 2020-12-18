import { html, LitElement } from 'lit-element';
import { property, query } from 'lit-element/lib/decorators';
import { Scoped } from 'scoped-elements';
import { CircularProgress } from '@material/mwc-circular-progress';

import { CalendarEvent } from '../types';
import { sharedStyles } from './sharedStyles';
import { CalendarEventsService } from '../calendar-events.service';
import { Hashed } from 'compository';
import { membraneContext } from 'holochain-membrane-context';

/**
 */
export class HodCalendarEvent extends membraneContext(Scoped(LitElement)) {
  static get styles() {
    return sharedStyles;
  }

  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
    };
  }

  /** Public attributes */

  /**
   * Calendar event hash to retrieve from the DNA
   * @type String
   */
  @property({ type: String, attribute: false })
  calendarEventHash!: string;

  /** Private properties */

  @property({ type: Object })
  _calendarEvent: Hashed<CalendarEvent> | undefined = undefined;

  get calendarEventsService(): CalendarEventsService {
    return new CalendarEventsService(this.appWebsocket, this.cellId);
  }

  async firstUpdated() {
    this._calendarEvent = await this.calendarEventsService.getCalendarEvent(
      this.calendarEventHash
    );
  }

  render() {
    if (!this._calendarEvent)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return html`
      <div class="column">
        <span> ${this._calendarEvent.content.title} </span>
        <span> Created By: ${this._calendarEvent.content.createdBy} </span>

        <span style="margin-top: 16px">
          Start Time:
          ${new Date(this._calendarEvent.content.startTime).toLocaleString()}
        </span>
        <span style="margin-top: 8px">
          End Time:
          ${new Date(this._calendarEvent.content.endTime).toLocaleString()}
        </span>
      </div>
    `;
  }
}
