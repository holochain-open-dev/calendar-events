import { ApolloClient } from '@apollo/client/core';
import { html, LitElement } from 'lit-element';
import { property, query } from 'lit-element/lib/decorators';
import { Scoped } from 'scoped-elements';
import { CircularProgress } from '@material/mwc-circular-progress';

import { CalendarEvent } from '../types';
import { sharedStyles } from '../sharedStyles';
import { GET_CALENDAR_EVENT } from '../graphql/queries';

/**
 */
export abstract class HodCalendarEvent extends Scoped(LitElement) {
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

  /** Dependencies */
  abstract get _apolloClient(): ApolloClient<any>;

  /** Private properties */

  @property({ type: Object })
  _calendarEvent: CalendarEvent | undefined = undefined;

  async firstUpdated() {
    const result = await this._apolloClient.query({
      query: GET_CALENDAR_EVENT,
      fetchPolicy: 'network-only',
      variables: {
        membraneId: 'asdf',
        calendarEventId: this.calendarEventHash,
      },
    });

    this._calendarEvent = result.data.membrane.calendarEvent;
  }

  render() {
    if (!this._calendarEvent)
      return html`<mwc-circular-progress></mwc-circular-progress>`;

    return html`
      <div class="column">
        <span> ${this._calendarEvent.title} </span>
        <span> Created By: ${this._calendarEvent.createdBy} </span>

        <span style="margin-top: 16px">
          Start Time:
          ${new Date(this._calendarEvent.startTime).toLocaleString()}
        </span>
        <span style="margin-top: 8px">
          End Time: ${new Date(this._calendarEvent.endTime).toLocaleString()}
        </span>
      </div>
    `;
  }
}
