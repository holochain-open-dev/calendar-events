import { html, css, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';

import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { contextProvided } from '@lit-labs/context';

import { LinearProgress, MenuSurface } from '@scoped-elements/material-web';
import {
  Event,
  EventCalendar as OGEventCalendar,
} from '@scoped-elements/event-calendar';

import {
  CreateCalendarEvent,
  CalendarEventsService,
  sharedStyles,
  calendarEventsServiceContext,
} from "@calendar-events/elements";
import { CellId } from '@holochain/client';
import { eventToEventCalendar } from '../utils';

/**
 * Only supports displaying of calendar events of multiple cells currently -- no editing of events
 * @csspart calendar - Style the calendar
 */
export class CrossCellEventsCalendar extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

  /**
   * Initial calendar view (for reference visit https://fullcalendar.io/docs/plugin-index)
   * @type {'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'}
   * @attr initial-view
   */
  @property({ type: String, attribute: 'initial-view' })
  initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  /** Dependencies */

  @contextProvided({ context: calendarEventsServiceContext })
  _calendarEventsService!: CalendarEventsService;

  /** Private properties */

  @state() _loading = true;
  @state() _allCalendarEvents: Array<Event> | undefined = undefined;

  @property()
  cellNames!: [CellId, string][];

  // @query('#create-event-menu')
  // _createEventMenu!: MenuSurface;

  // @query('#create-calendar-event')
  // _createEvent!: CreateCalendarEvent;

  async loadCalendarEvents() {
    this._loading = true;
    this._allCalendarEvents = (
      await this._calendarEventsService.getAllCalendarEvents()
    ).map((recordInfo) => {
      const cellName = this.cellNames.filter(([cellId, cellName]) => cellId === recordInfo.provenance)[0][1]
      const titlePrefix = cellName + " - ";
      return eventToEventCalendar(recordInfo.element, titlePrefix);
    });
    console.log(await this._calendarEventsService.getAllCalendarEvents());
    this._loading = false;
  }

  // openCreateEventMenu(info: any) {
  //   this._createEventMenu.open = true;

  //   this._createEventMenu.anchor = info.dayEl;

  //   this._createEvent.clear();
  //   this._createEvent.initialEventProperties = {
  //     startTime: info.date.valueOf(),
  //     endTime: info.date.valueOf() + 3600000,
  //   };
  // }

  firstUpdated() {
    this.loadCalendarEvents();
  }

  // renderCreateEventCard() {
  //   return html` <mwc-menu-surface
  //     id="create-event-menu"
  //     absolute
  //     corner="TOP_END"
  //   >
  //     <div style="padding: 16px;">
  //       <create-calendar-event
  //         id="create-calendar-event"
  //         @event-created=${(e: CustomEvent) => {
  //           this._createEventMenu.open = false;
  //           this.loadCalendarEvents();
  //         }}
  //       ></create-calendar-event>
  //     </div>
  //   </mwc-menu-surface>`;
  // }

  render() {
    return html`
      <div class="column" style="position: relative; flex: 1;">
        <event-calendar
          .events=${this._allCalendarEvents ? this._allCalendarEvents : []}
        ></event-calendar>
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
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'event-calendar': OGEventCalendar,
      'mwc-menu-surface': MenuSurface,
      'mwc-linear-progress': LinearProgress,
      'create-calendar-event': CreateCalendarEvent,
    };
  }
}
