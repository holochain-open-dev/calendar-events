import { html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { contextProvided } from '@lit-labs/context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { Button, TextField } from '@scoped-elements/material-web';

import { CalendarEvent } from '../types';
import { sharedStyles } from '../sharedStyles';
import { CalendarEventsService } from '../calendar-events-service';
import { calendarEventsServiceContext } from '../context';

/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart event-title - Style the event title textfield
 */
export class CreateCalendarEvent extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  /**
   * Initial calendar event parameters with which to populate the form
   * @type Partial<CalendarEvent>
   */
  @property({ type: Object, attribute: false })
  initialEventProperties: Partial<CalendarEvent> | undefined = undefined;

  /** Dependencies */

  @contextProvided({ context: calendarEventsServiceContext })
  _calendarEventsService!: CalendarEventsService;

  /** Private properties */

  @query('#event-title')
  _titleField!: TextField;

  async createEvent() {
    const calendarEvent = await this._calendarEventsService.createCalendarEvent(
      {
        title: this._titleField.value,
        startTime: this.initialEventProperties?.startTime as number,
        endTime: this.initialEventProperties?.endTime as number,
        location: undefined,
        invitees: [],
      }
    );

    this.dispatchEvent(
      new CustomEvent('event-created', {
        detail: {
          event: calendarEvent,
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

  static get styles() {
    return sharedStyles;
  }

  static get scopedElements() {
    return {
      'mwc-textfield': TextField,
      'mwc-button': Button,
    };
  }
}
