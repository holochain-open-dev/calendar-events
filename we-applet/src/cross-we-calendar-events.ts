import { ContextProvider } from "@lit-labs/context";
import { property, state } from "lit/decorators.js";
import { InstalledAppInfo, AppWebsocket, CellId } from "@holochain/client";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { CircularProgress } from "@scoped-elements/material-web";
import { LitElement, html } from "lit";
import {
  CalendarEventsService,
  calendarEventsServiceContext,
  sharedStyles,
} from "@calendar-events/elements";
import { CrossCellEventsCalendar } from './elements/cross-cell-events-calendar';

// to be removed once implemented in @lightningrodlabs/we-applet
import { InstalledAppletInfo } from ".";

export class CrossWeCalendarEvents extends ScopedElementsMixin(LitElement) {
  @property()
  appWebsocket!: AppWebsocket;

  @property()
  appletAppsInfo!: InstalledAppletInfo[];

  @state()
  loaded = false;

  @state()
  cellNames: [CellId, string][] = [];

  async firstUpdated() {

    const cellsIds = this.appletAppsInfo.map((info) => info.installedAppInfo.cell_data[0].cell_id);
    let cellNames: [CellId, string][] = [];
    this.appletAppsInfo.forEach((info) => cellNames.push(
      [info.installedAppInfo.cell_data[0].cell_id, info.weInfo.name]
    ))

    this.cellNames = cellNames;

    new ContextProvider(
      this,
      calendarEventsServiceContext,
      new CalendarEventsService(
        this.appWebsocket,
        cellsIds,
      )
    );

    // TODO: Initialize any store that you have and create a ContextProvider for it
    //
    // eg:
    // new ContextProvider(this, calendar-eventsContext, new CalendarEventsStore(cellClient, store));

    this.loaded = true;
  }

  render() {
    if (!this.loaded)
      return html`<div
        style="display: flex; flex: 1; flex-direction: row; align-items: center; justify-content: center"
      >
        <mwc-circular-progress></mwc-circular-progress>
      </div>`;

    // TODO: add any elements that you have in your applet
    return html`
    <div class="flex-scrollable-parent">
      <div class="flex-scrollable-container">
        <div class="flex-scrollable-y">
          <cross-cell-events-calendar .cellNames=${this.cellNames} style="padding: 30px;"></cross-cell-events-calendar>
        </div>
      </div>
    </div>`;
  }

  static get scopedElements() {
    return {
      "mwc-circular-progress": CircularProgress,
      "cross-cell-events-calendar": CrossCellEventsCalendar,
      // TODO: add any elements that you have in your applet
    };
  }

  static get styles() {
    return sharedStyles;
  }
}
