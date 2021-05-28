import { html } from 'lit';
import { property } from 'lit/decorators.js';

import { requestContext } from '@holochain-open-dev/context';
import { HoloHashed } from '@holochain-open-dev/core-types';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { MobxLitElement } from '@adobe/lit-mobx';

import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';

import { CalendarEvent, CALENDAR_EVENTS_SERVICE_CONTEXT } from '../types';
import { sharedStyles } from './sharedStyles';
import { CalendarEventsService } from '../calendar-events.service';

/**
 */
export class CalendarEventDetail extends ScopedRegistryHost(MobxLitElement) {
  /** Public attributes */

  /**
   * Calendar event hash to retrieve from the DNA
   * @type String
   */
  @property({ type: String, attribute: false })
  calendarEventHash!: string;

  /** Dependencies */

  @requestContext(CALENDAR_EVENTS_SERVICE_CONTEXT)
  _calendarEventsService!: CalendarEventsService;

  /** Private properties */

  @property({ type: Object })
  _calendarEvent: HoloHashed<CalendarEvent> | undefined = undefined;

  firstUpdated() {
    this.loadEvent();
  }

  async loadEvent() {
    this._calendarEvent = await this._calendarEventsService.getCalendarEvent(
      this.calendarEventHash
    );
  }

  render() {
    if (!this._calendarEvent)
      return html`<mwc-circular-progress
        indeterminate
      ></mwc-circular-progress>`;

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
  static get styles() {
    return sharedStyles;
  }

  static elementDefinitions = {
    'mwc-circular-progress': CircularProgress,
  };
}
