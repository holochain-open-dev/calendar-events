import { ApolloClient } from '@apollo/client/core';
import { html, css, LitElement, property, query } from 'lit-element';

import Calendar from 'tui-calendar';
// @ts-ignore
import styles from 'tui-calendar/dist/tui-calendar.css';
import '@material/mwc-circular-progress';

import { CalendarEvent } from '../types';
import { GET_MY_CALENDAR_EVENTS } from '../graphql/queries';
import { eventToSchedule } from '../utils';

export function HodFullCalendar(apolloClient: ApolloClient<any>) {
  class HodFullCalendar extends LitElement {
    static styles = [
      styles,
      css`
        :host {
          font-family: 'Roboto', sans-serif;
        }
      `,
    ];
    /** Public attributes */

    /** Private properties */

    @property({ type: Array, attribute: false }) _myCalendarEvents:
      | Array<CalendarEvent>
      | undefined = undefined;

    @query('#calendar')
    calendar!: HTMLElement;

    async firstUpdated() {
      const calendar = new Calendar(this.calendar, {
        defaultView: 'week',
        taskView: false,
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

      this._myCalendarEvents = result.data.myCalendarEvents;
      if (this._myCalendarEvents) {
        const schedules = this._myCalendarEvents.map(eventToSchedule);
        calendar.createSchedules(schedules);
        calendar.render();
      }
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
