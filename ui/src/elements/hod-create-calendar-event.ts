import { ApolloClient } from '@apollo/client/core';
import { html, LitElement, property, query } from 'lit-element';
import '@material/mwc-textfield';
import type { TextField } from '@material/mwc-textfield';
import '@material/mwc-button';

import { CalendarEvent } from '../types';
import { sharedStyles } from '../sharedStyles';
import { CREATE_CALENDAR_EVENT } from '../graphql/queries';
import { secsTimestampToDate } from '../utils';

export abstract class HodCreateCalendarEvent extends LitElement {
  static styles = sharedStyles;
  /** Public attributes */
  @property()
  initialEventProperties: Partial<CalendarEvent> | undefined = undefined;

  /** Dependencies */
  abstract get apolloClient(): ApolloClient<any>;

  /** Private properties */

  @query('#event-title')
  titleField!: TextField;

  async createEvent() {
    const result = await this.apolloClient.mutate({
      mutation: CREATE_CALENDAR_EVENT,
      variables: {
        title: this.titleField.value,
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
      get apolloClient() {
        return apolloClient;
      }
    }
  );
}
