import { ApolloClient } from '@apollo/client/core';
import { html, LitElement, property, query } from 'lit-element';
import '@material/mwc-textfield';
import { TextField } from '@material/mwc-textfield';
import '@material/mwc-button';

import { CalendarEvent } from '../types';
import { sharedStyles } from '../sharedStyles';
import { CREATE_CALENDAR_EVENT } from '../graphql/queries';
import { secsTimestampToDate } from '../utils';

export function HodCreateCalendarEvent(apolloClient: ApolloClient<any>) {
  class HodCreateCalendarEvent extends LitElement {
    static styles = sharedStyles;
    @property()
    initialEventProperties: Partial<CalendarEvent> | undefined = undefined;

    @query('#event-title')
    titleField!: TextField;

    async createEvent() {
      const result = await apolloClient.mutate({
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
              label="CREATE"
              @click=${() => this.createEvent()}
            ></mwc-button>
          </div>
        </div>
      `;
    }
  }
  return HodCreateCalendarEvent;
}
