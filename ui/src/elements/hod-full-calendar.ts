import { ApolloClient } from '@apollo/client/core';
import {
  html,
  css,
  LitElement,
  property,
  customElement,
  query,
} from 'lit-element';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@material/mwc-circular-progress';

import { CalendarEvent } from '../types';
import { GET_MY_CALENDAR_EVENTS } from '../graphql/queries';
import { eventToFullCalendarEvent } from '../utils';

export function HodFullCalendar(apolloClient: ApolloClient<any>) {
  class HodFullCalendar extends LitElement {
    /** Public attributes */

    /** Private properties */

    @property({ type: Array, attribute: false }) _myCalendarEvents:
      | Array<CalendarEvent>
      | undefined = undefined;

    @query('#full-calendar')
    fullCalendar!: HTMLElement;

    async firstUpdated() {
      const calendar = new Calendar(this.fullCalendar, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
      });

      calendar.render();

      const result = await apolloClient.query({
        query: GET_MY_CALENDAR_EVENTS,
      });

      const events = result.data.myCalendarEvents.map(eventToFullCalendarEvent);

      calendar.addEventSource(events);
    }

    render() {
      return html`
        ${this._myCalendarEvents
          ? html``
          : html`<mwc-circular-progress></mwc-circular-progress>`}

        <div id="full-calendar"></div>
      `;
    }
  }

  return HodFullCalendar;
}
