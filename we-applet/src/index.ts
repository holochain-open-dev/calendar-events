import {
  AdminWebsocket,
  AppWebsocket,
  InstalledAppInfo,
  InstalledAppletInfo,
} from "@holochain/client";
import {
  WeApplet,
  AppletRenderers,
  WeServices,
  WeInfo,
} from "@lightningrodlabs/we-applet";

import { CalendarEventsApplet } from "./calendar-events-applet";
import { CrossWeCalendarEvents } from "./cross-we-calendar-events";


// +++++++++++ to be removed if implemented in @lightningrodlabs/we-applet
export interface WeInfo {
  logo_src: string;
  name: string;
}
export interface InstalledAppletInfo {
  weInfo: WeInfo,
  installedAppInfo: InstalledAppInfo,
}
// ++++++++++++


const calendarEventsApplet: WeApplet = {
  async appletRenderers(
    appWebsocket: AppWebsocket,
    adminWebsocket: AdminWebsocket,
    weServices: WeServices,
    appletAppInfo: InstalledAppInfo | InstalledAppletInfo[],
  ): Promise<AppletRenderers> {
    return {
      full(element: HTMLElement, registry: CustomElementRegistry) {

        if ((appletAppInfo as any).length) {
          console.error("Wrong type of appletAppInfo passed. Expected type 'InstalledAppletInfo[]'.")
        } else {
          registry.define("calendar-events-applet", CalendarEventsApplet);
          element.innerHTML = `<calendar-events-applet style="flex: 1; display: flex;"></calendar-events-applet>`;
          let appletElement = element.querySelector("calendar-events-applet") as any;

          appletElement.appWebsocket =  appWebsocket;
          appletElement.profilesStore = weServices.profilesStore;
          appletElement.appletAppInfo = appletAppInfo;
        }
      },
      blocks: [
        {
          name: "cross-we-renderer",
          render: (element: HTMLElement, registry: CustomElementRegistry) => {
            registry.define("cross-we-calendar-events", CrossWeCalendarEvents);
            element.innerHTML = `<cross-we-calendar-events style="flex: 1; display: flex;"></cross-we-calendar-events>`;
            let appletElement = element.querySelector("calendar-events-applet") as any;

            appletElement.appWebsocket =  appWebsocket;
            appletElement.profilesStore = weServices.profilesStore;
            appletElement.appletAppInfo = appletAppInfo;
          }
        }
      ],
    };
  },
};







export default calendarEventsApplet;
