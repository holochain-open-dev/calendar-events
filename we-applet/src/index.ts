import {
  AdminWebsocket,
  AppWebsocket,
  InstalledAppInfo,
} from "@holochain/client";
import {
  WeApplet,
  AppletRenderers,
  WeServices,
} from "@lightningrodlabs/we-applet";

import { CalendarEventsApplet } from "./calendar-events-applet";

const calendarEventsApplet: WeApplet = {
  async appletRenderers(
    appWebsocket: AppWebsocket,
    adminWebsocket: AdminWebsocket,
    weServices: WeServices,
    appletAppInfo: InstalledAppInfo
  ): Promise<AppletRenderers> {
    return {
      full(element: HTMLElement, registry: CustomElementRegistry) {
        registry.define("calendar-events-applet", CalendarEventsApplet);
        element.innerHTML = `<calendar-events-applet style="flex: 1; display: flex;"></calendar-events-applet>`;
        let appletElement = element.querySelector("calendar-events-applet") as any;

        appletElement.appWebsocket =  appWebsocket;
        appletElement.profilesStore = weServices.profilesStore;
        appletElement.appletAppInfo = appletAppInfo;
      },
      blocks: [],
    };
  },
};

export default calendarEventsApplet;
