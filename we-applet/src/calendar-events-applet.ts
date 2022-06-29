import { ContextProvider } from "@lit-labs/context";
import { property, state } from "lit/decorators.js";
import {
  ProfilesStore,
  profilesStoreContext,
} from "@holochain-open-dev/profiles";
import { InstalledAppInfo, AppWebsocket } from "@holochain/client";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { CircularProgress } from "@scoped-elements/material-web";
import { LitElement, html } from "lit";
import {
  AllEventsCalendar,
  CalendarEventsService,
  calendarEventsServiceContext,
} from "@calendar-events/elements";
import { sharedStyles } from "@calendar-events/elements";

export class CalendarEventsApplet extends ScopedElementsMixin(LitElement) {
  @property()
  appWebsocket!: AppWebsocket;

  @property()
  profilesStore!: ProfilesStore;

  @property()
  appletAppInfo!: InstalledAppInfo;

  @state()
  loaded = false;

  async firstUpdated() {
    new ContextProvider(this, profilesStoreContext, this.profilesStore);

    new ContextProvider(
      this,
      calendarEventsServiceContext,
      new CalendarEventsService(
        this.appWebsocket,
        this.appletAppInfo.cell_data[0].cell_id
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
          <all-events-calendar style="padding: 30px;"></all-events-calendar>
        </div>
      </div>
    </div>`;
  }

  static get scopedElements() {
    return {
      "mwc-circular-progress": CircularProgress,
      "all-events-calendar": AllEventsCalendar,
      // TODO: add any elements that you have in your applet
    };
  }

  static get styles() {
    return sharedStyles;
  }
}
