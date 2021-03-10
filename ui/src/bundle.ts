import { Lenses } from '@compository/lib';
import { html, render } from 'lit-html';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { HodMyCalendar } from './elements/hod-my-calendar';
//@ts-ignore
import { createUniqueTag } from '@open-wc/scoped-elements/src/createUniqueTag';
import { CalendarEventsService } from './calendar-events.service';

export default function lenses(
  appWebsocket: AppWebsocket,
  cellId: CellId
): Lenses {
  const service = new CalendarEventsService(appWebsocket, cellId);

  return {
    standalone: [
      {
        name: 'My Events Calendar',
        render(root: ShadowRoot) {
          const myCalendarTag = createUniqueTag(
            'hod-my-calendar',
            customElements
          );
          root.innerHTML = `
            <link
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
              rel="stylesheet"
            />
              <${myCalendarTag}></${myCalendarTag}>
           `;

          customElements.define(
            myCalendarTag,
            class extends HodMyCalendar {
              get _calendarEventsService() {
                return service;
              }
            }
          );
        },
      },
    ],
    entryLenses: {},
    attachmentsLenses: [],
  };
}
