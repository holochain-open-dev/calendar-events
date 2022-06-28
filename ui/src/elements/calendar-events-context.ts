import { css, html, LitElement } from 'lit';
import { contextProvider } from '@lit-labs/context';
import { property } from 'lit/decorators.js';

import { calendarEventsServiceContext } from '../context';
import { CalendarEventsService } from '../calendar-events-service';

export class CalendarEventsContext extends LitElement {
  @contextProvider({ context: calendarEventsServiceContext })
  @property({ type: Object })
  service!: CalendarEventsService;

  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;
}
