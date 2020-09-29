import { ApolloClient } from '@apollo/client/core';
import { html, css, LitElement, property, query } from 'lit-element';

import Calendar from 'tui-calendar';
// @ts-ignore
import styles from 'tui-calendar/dist/tui-calendar.css';
import '@material/mwc-circular-progress';

import { CalendarEvent } from '../types';
import { GET_MY_CALENDAR_EVENTS } from '../graphql/queries';
import { eventToFullCalendarEvent } from '../utils';

export function HodFullCalendar(apolloClient: ApolloClient<any>) {
  class HodFullCalendar extends LitElement {
    static styles = styles;
    /** Public attributes */

    /** Private properties */

    @property({ type: Array, attribute: false }) _myCalendarEvents:
      | Array<CalendarEvent>
      | undefined = undefined;

    @query('#calendar')
    fullCalendar!: HTMLElement;

    async firstUpdated() {
      const calendar = new Calendar(this.fullCalendar, {
        defaultView: 'month',
        taskView: true,
        template: {
          monthDayname: function (dayname) {
            return (
              '<span class="calendar-week-dayname-name">' +
              dayname.label +
              '</span>'
            );
          },
        },
      });

      const result = await apolloClient.query({
        query: GET_MY_CALENDAR_EVENTS,
      });

      const events = result.data.myCalendarEvents.map(eventToFullCalendarEvent);
    }

    render() {
      return html`
        ${this._myCalendarEvents
          ? html``
          : html`<mwc-circular-progress></mwc-circular-progress>`}

        <div id="calendar"></div>
      `;
    }
  }

  return HodFullCalendar;
}
