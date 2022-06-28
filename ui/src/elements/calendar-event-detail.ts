import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { contextProvided } from '@lit-labs/context';

import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { CircularProgress } from '@scoped-elements/material-web';

import { CalendarEvent } from '../types';
import { sharedStyles } from './sharedStyles';
import { CalendarEventsService } from '../calendar-events-service';
import { calendarEventsServiceContext } from '../context';
import { Element, serializeHash } from '@holochain-open-dev/core-types';
import { HeaderHash } from '@holochain/client';
import { extractCalendarEvent } from '../utils';
import { AgentAvatar } from '@holochain-open-dev/profiles';

/**
 */
export class CalendarEventDetail extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  /**
   * Calendar event hash to retrieve from the DNA
   * @type String
   */
  @property({ type: Object, attribute: false })
  calendarEventHash!: HeaderHash;

  /** Dependencies */

  @contextProvided({ context: calendarEventsServiceContext })
  _calendarEventsService!: CalendarEventsService;

  /** Private properties */

  @property({ type: Object })
  _calendarEvent: Element | undefined = undefined;

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

    const calendarEvent = extractCalendarEvent(this._calendarEvent);

    return html`
      <div class="column">
        <span> ${calendarEvent.title} </span>
        <span>
          Created By:
          <agent-avatar
            .agentPubKey=${serializeHash(
              this._calendarEvent.signed_header.hashed.content.author
            )}
          ></agent-avatar
        ></span>

        <span style="margin-top: 16px">
          Start Time: ${new Date(calendarEvent.startTime).toLocaleString()}
        </span>
        <span style="margin-top: 8px">
          End Time: ${new Date(calendarEvent.endTime).toLocaleString()}
        </span>
      </div>
    `;
  }
  static get styles() {
    return sharedStyles;
  }

  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
      'agent-avatar': AgentAvatar,
    };
  }
}
