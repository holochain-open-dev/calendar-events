import { ApolloClient } from '@apollo/client/core';
import { html, css, LitElement, property, query } from 'lit-element';

import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
// @ts-ignore
import commonStyles from '@fullcalendar/common/main.css';
import dayGridPlugin from '@fullcalendar/daygrid';
// @ts-ignore
import daygridStyles from '@fullcalendar/daygrid/main.css';
import timeGridPlugin from '@fullcalendar/timegrid';
// @ts-ignore
import timeGridStyles from '@fullcalendar/timegrid/main.css';
// @ts-ignore
import bootstrapStyles from 'bootstrap/dist/css/bootstrap.css';
// @ts-ignore
import iconStyles from '@fortawesome/fontawesome-free/css/all.css'; // needs additional webpack config!
import '@material/mwc-linear-progress';
import '@material/mwc-menu/mwc-menu-surface';
import type { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';

import { CalendarEvent } from '../types';
import { GET_MY_CALENDAR_EVENTS } from '../graphql/queries';
import { dateToSecsTimestamp, eventToFullCalendar } from '../utils';

export abstract class HodMyCalendar extends LitElement {
  static get styles() {
    return [
      commonStyles,
      daygridStyles,
      timeGridStyles,
      bootstrapStyles,
      iconStyles,
      css`
        :host {
          font-family: 'Roboto', sans-serif;
        }
      `,
    ];
  }
  /** Public attributes */

  /** Dependencies */
  abstract get apolloClient(): ApolloClient<any>;

  /** Private properties */

  @property({ type: Boolean, attribute: false }) loading = false;
  @property({ type: Array, attribute: false }) _myCalendarEvents:
    | Array<CalendarEvent>
    | undefined = undefined;

  @query('#calendar')
  calendarEl!: HTMLElement;

  @query('#create-event-menu')
  createEventMenu!: MenuSurface;

  @query('#create-calendar-event')
  createEvent!: any;

  calendar!: Calendar;

  async loadCalendarEvents() {
    this.loading = true;
    const result = await this.apolloClient.query({
      query: GET_MY_CALENDAR_EVENTS,
      fetchPolicy: 'network-only',
    });

    this._myCalendarEvents = result.data.myCalendarEvents;
    if (this._myCalendarEvents) {
      const fullCalendarEvents = this._myCalendarEvents.map(
        eventToFullCalendar
      );
      this.calendar.removeAllEventSources();
      this.calendar.addEventSource(fullCalendarEvents);
      this.calendar.render();
    }
    this.loading = false;
  }

  setupCalendar() {
    this.calendar = new Calendar(this.calendarEl, {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
      initialView: 'timeGridWeek',
      themeSystem: 'bootstrap',
      selectable: true,
      selectMirror: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      select: info => {
        this.createEventMenu.open = true;
        this.createEventMenu.anchor = (info.jsEvent as any)
          .path[0] as HTMLElement;
        this.createEvent.initialEventProperties = {
          startTime: dateToSecsTimestamp(info.start),
          endTime: dateToSecsTimestamp(info.end),
        };
      },
    });

    this.calendar.render();
  }

  async firstUpdated() {
    this.setupCalendar();

    await this.loadCalendarEvents();
  }

  renderCreateEventCard() {
    return html` <mwc-menu-surface
      id="create-event-menu"
      absolute
      corner="TOP_END"
    >
      <div style="padding: 16px;">
        <hod-create-calendar-event
          id="create-calendar-event"
          @event-created=${() => {
            this.createEventMenu.open = false;
            this.loadCalendarEvents();
          }}
        ></hod-create-calendar-event>
      </div>
    </mwc-menu-surface>`;
  }

  render() {
    return html`
      <div style="position: relative;">
        ${this.renderCreateEventCard()}
        ${this.loading
          ? html`<mwc-linear-progress indeterminate></mwc-linear-progress>`
          : html``}

        <div id="calendar"></div>
      </div>
    `;
  }
}
export function defineHodMyCalendar(apolloClient: ApolloClient<any>): void {
  customElements.define(
    'hod-my-calendar',
    class extends HodMyCalendar {
      get apolloClient() {
        return apolloClient;
      }
    }
  );
}
