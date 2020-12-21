import { html, PropertyValues } from 'lit-element';
import { property } from 'lit-element/lib/decorators';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';

import { CalendarEvent } from '../types';
import { sharedStyles } from './sharedStyles';
import { Hashed } from '@compository/lib';
import { BaseElement } from './base-calendar';

/**
 */
export class HodCalendarEvent extends BaseElement {
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

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);
    if (
      changedValues.has('membraneContext') &&
      this.membraneContext.appWebsocket
    ) {
      this.loadEvent();
    }
  }

  async loadEvent() {
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
