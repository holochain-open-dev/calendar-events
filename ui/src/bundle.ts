import { Lenses } from '@compository/lib';
import { html, render } from 'lit-html';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { HodMyCalendar } from './elements/hod-my-calendar';
import { HodCalendarEvent } from './elements/hod-calendar-event';
import { MembraneContextProvider } from '@holochain-open-dev/membrane-context';
import { Constructor } from 'lit-element';
//@ts-ignore
import { createUniqueTag } from '@open-wc/scoped-elements/src/createUniqueTag';

const renderers: Lenses = {
  standalone: [
    {
      name: 'My Events Calendar',
      render(root: ShadowRoot, appWebsocket: AppWebsocket, cellId: CellId) {
        const myCalendarTag = createUniqueTag(
          'hod-my-calendar',
          customElements
        );
        const holochainMembraneTag = createUniqueTag(
          'holochain-membrane-context',
          customElements
        );
        customElements.define(
          holochainMembraneTag,
          (class extends MembraneContextProvider {} as unknown) as Constructor<HTMLElement>
        );
        root.innerHTML = `
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          <${holochainMembraneTag} id="context">
            <${myCalendarTag}></${myCalendarTag}>
          </${holochainMembraneTag}>`;

        const context: MembraneContextProvider = (root.getElementById(
          'context'
        ) as unknown) as MembraneContextProvider;
        context.appWebsocket = appWebsocket;
        context.cellId = cellId;

        setTimeout(
          () =>
            customElements.define(
              myCalendarTag,
              (class extends HodMyCalendar {} as unknown) as Constructor<HTMLElement>
            ),
          50
        );
      },
    },
  ],
  entry: {
    calendar_event: {
      name: 'Calendar Event',
      render: (
        root: ShadowRoot,
        appWebsocket: AppWebsocket,
        cellId: CellId,
        entryHash: string
      ) => {
        customElements.define('hod-calendar-event', HodCalendarEvent);
        render(
          html`<hod-calendar-event
            .cellId=${cellId}
            .appWebsocket=${appWebsocket}
            .calendarEventHash="${entryHash}"
          ></hod-calendar-event>`,
          root
        );
      },
    },
  },
  entryAttachments: [],
};

export default renderers;
