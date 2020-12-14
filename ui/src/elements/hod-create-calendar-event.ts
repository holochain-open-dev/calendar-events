import { ApolloClient } from '@apollo/client/core';
import { html, LitElement } from 'lit-element';
import { property, query } from 'lit-element/lib/decorators';
import { TextField } from '@material/mwc-textfield';
import { Button } from '@material/mwc-button';

import { CalendarEvent } from '../types';
import { sharedStyles } from '../sharedStyles';
import { CREATE_CALENDAR_EVENT } from '../graphql/queries';
import { Scoped } from 'scoped-element-mixin';

/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart event-title - Style the event title textfield
 */
export abstract class HodCreateCalendarEvent extends Scoped(LitElement) {
  static get styles() {
    return sharedStyles;
  }
  static get scopedElements() {
    return {
      'mwc-textfield': TextField,
      'mwc-button': Button,
    };
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
        membraneId: 'asdfdasf',
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
          placeholder="Event title"
          .value=${this.initialEventProperties?.title || ''}
          part="event-title"
        ></mwc-textfield>

        <span style="margin-top: 16px">
          Start Time:
          ${new Date(
            this.initialEventProperties?.startTime as number
          ).toLocaleString()}
        </span>
        <span style="margin-top: 8px">
          End Time:
          ${new Date(
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

  /**
   * Clears all previously filled values of the form
   * @method
   */
  public clear() {
    this._titleField.value = '';
  }
}
