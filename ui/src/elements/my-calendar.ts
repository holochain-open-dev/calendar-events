import { html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

import { MobxLitElement } from '@adobe/lit-mobx';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';

import { HoloHashed } from '@holochain-open-dev/core-types';
import { requestContext } from '@holochain-open-dev/context';

import { Calendar } from '@fullcalendar/core';
import type { DateSelectArg } from '@fullcalendar/core';
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
import { MenuSurface } from 'scoped-material-components/mwc-menu-surface';
import { LinearProgress } from 'scoped-material-components/mwc-linear-progress';

import { CalendarEvent, CALENDAR_EVENTS_SERVICE_CONTEXT } from '../types';
import { eventToFullCalendar } from '../utils';
import { CreateCalendarEvent } from './create-calendar-event';
import { CalendarEventsService } from '../calendar-events.service';

/**
 * @fires event-created - Fired after actually creating the event, containing the new CalendarEvent
 * @csspart calendar - Style the calendar
 */
export class MyCalendar extends ScopedRegistryHost(MobxLitElement) {
  /** Public attributes */

  /**
   * Initial calendar view (for reference visit https://fullcalendar.io/docs/plugin-index)
   * @type {'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'}
   * @attr initial-view
   */
  @property({ type: String, attribute: 'initial-view' })
  initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  /** Dependencies */

  @requestContext(CALENDAR_EVENTS_SERVICE_CONTEXT)
  _calendarEventsService!: CalendarEventsService;

  /** Private properties */

  @state() _loading = true;
  @state() _myCalendarEvents: Array<HoloHashed<CalendarEvent>> | undefined =
    undefined;

  _calendarEl: Ref<HTMLElement> = createRef();

  @query('#create-event-menu')
  _createEventMenu!: MenuSurface;

  @query('#create-calendar-event')
  _createEvent!: CreateCalendarEvent;

  _calendar!: Calendar;

  async loadCalendarEvents() {
    this._loading = true;
    this._myCalendarEvents =
      await this._calendarEventsService.getAllCalendarEvents();

    if (this._myCalendarEvents) {
      const fullCalendarEvents =
        this._myCalendarEvents.map(eventToFullCalendar);
      this._calendar.removeAllEventSources();
      this._calendar.addEventSource(fullCalendarEvents);
      this._calendar.render();
    }
    this._loading = false;
  }

  getEventBeingCreated(): HTMLElement | undefined {
    if (!this._calendarEl.value) return;

    const harnesses = this._calendarEl.value?.querySelectorAll(
      '.fc-timegrid-event-harness'
    );

    let eventBeingCreated: HTMLElement | undefined = undefined;
    harnesses.forEach(element => {
      if ((element as HTMLElement).style.zIndex === '') {
        eventBeingCreated = element as HTMLElement;
      }
    });

    return eventBeingCreated;
  }

  openCreateEventMenu(info: DateSelectArg) {
    this._createEventMenu.open = true;

    const element = this.getEventBeingCreated();
    if (element) {
      this._createEventMenu.anchor = element;
    }

    this._createEvent.clear();
    this._createEvent.initialEventProperties = {
      startTime: info.start.valueOf(),
      endTime: info.end.valueOf(),
    };
  }

  setupCalendar() {
    this._calendar = new Calendar(this._calendarEl.value as HTMLElement, {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
      initialView: this.initialView,
      themeSystem: 'bootstrap',
      selectable: true,
      selectMirror: true,
      unselectAuto: false,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      select: info => {
        if (this._createEventMenu.open) {
          setTimeout(() => this.openCreateEventMenu(info), 100);
        } else this.openCreateEventMenu(info);
      },
    });

    this._calendar.render();
  }

  firstUpdated() {
    this.setupCalendar();

    this.loadCalendarEvents();
  }

  renderCreateEventCard() {
    return html` <mwc-menu-surface
      id="create-event-menu"
      absolute
      corner="TOP_END"
    >
      <div style="padding: 16px;">
        <create-calendar-event
          id="create-calendar-event"
          @event-created=${(e: CustomEvent) => {
            this._createEventMenu.open = false;
            this.loadCalendarEvents();
          }}
        ></create-calendar-event>
      </div>
    </mwc-menu-surface>`;
  }

  render() {
    return html`
      <div class="column" style="position: relative; flex: 1;">
        ${this.renderCreateEventCard()}
        <div ${ref(this._calendarEl)} style="flex: 1;"></div>
        ${this._loading
          ? html`<mwc-linear-progress
              indeterminate
              style="width: 100%;"
            ></mwc-linear-progress>`
          : html``}
      </div>
    `;
  }

  static get styles() {
    return [
      commonStyles,
      daygridStyles,
      timeGridStyles,
      bootstrapStyles,
      iconStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }

  static elementDefinitions = {
    'mwc-menu-surface': MenuSurface,
    'mwc-linear-progress': LinearProgress,
    'create-calendar-event': CreateCalendarEvent,
  };
}
