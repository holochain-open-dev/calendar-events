import { ApolloClient } from '@apollo/client/core';
import { html, LitElement, property, query } from 'lit-element';
import '@material/mwc-textfield';
import type { TextField } from '@material/mwc-textfield';
import '@material/mwc-button';

import { CalendarEvent } from '../types';
import { sharedStyles } from '../sharedStyles';
import { CREATE_CALENDAR_EVENT } from '../graphql/queries';
import { secsTimestampToDate } from '../utils';

/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 */
export abstract class HodCreateCalendarEvent extends LitElement {
  static get styles() {
    return sharedStyles;
  }

  /** Public attributes */

  /**
   * Initial calendar event parameters with which to populate the form
   * @type Partial<CalendarEvent>
   */
  @property({ type: Object, attribute: false })
  initialEventProperties: Partial<CalendarEvent> | undefined = undefined;

  /** Dependencies */
  abstract get _apolloClient(): ApolloClient<any>;

  /** Private properties */

  @query('#event-title')
  _titleField!: TextField;

  async createEvent() {
    const result = await this._apolloClient.mutate({
      mutation: CREATE_CALENDAR_EVENT,
      variables: {
        title: this._titleField.value,
        startTime: this.initialEventProperties?.startTime,
        endTime: this.initialEventProperties?.endTime,
        location: null,
        invitees: [],
      },
    });

    this.dispatchEvent(
      new CustomEvent('event-created', {
        detail: {
          event: result.data.createCalendarEvent,
        },
        composed: true,
        bubbles: true,
      })
    );
  }

  render() {
    return html`
      <div class="column">
        <mwc-textfield
          id="event-title"
          .value=${this.initialEventProperties?.title || ''}
        ></mwc-textfield>

        <span style="margin-top: 16px">
          Start Time:
          ${secsTimestampToDate(
            this.initialEventProperties?.startTime as number
          ).toLocaleString()}
        </span>
        <span style="margin-top: 8px">
          End Time:
          ${secsTimestampToDate(
            this.initialEventProperties?.endTime as number
          ).toLocaleString()}
        </span>

        <div class="row" style="align-self: flex-end; margin-top: 16px;">
          <mwc-button
            id="create-event-button"
            label="CREATE"
            @click=${() => this.createEvent()}
          ></mwc-button>
        </div>
      </div>
    `;
  }
}

export function defineHodCreateCalendarEvent(apolloClient: ApolloClient<any>) {
  customElements.define(
    'hod-create-calendar-event',
    class extends HodCreateCalendarEvent {
      get _apolloClient() {
        return apolloClient;
      }
    }
  );
}
