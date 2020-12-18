import { scopeElement } from 'scoped-elements/dist/scoped';
import { SetupRenderers } from 'compository';
import { html, render } from 'lit-html';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { HodMyCalendar } from './elements/hod-my-calendar';
import { HodCalendarEvent } from './elements/hod-calendar-event';
import { HolochainMembraneContext } from 'holochain-membrane-context';
import { Constructor } from 'lit-element';

const setupRenderers: SetupRenderers = async (
  appWebsocket: AppWebsocket,
  cellId: CellId
) => {
  return {
    standalone: [
      {
        name: 'Calendar',
        render(root: ShadowRoot, registry: CustomElementRegistry) {
          registry.define('hod-my-calendar', scopeElement(HodMyCalendar));
          registry.define(
            'holochain-membrane-context',
            (HolochainMembraneContext as any) as Constructor<HTMLElement>
          );
          render(
            html`
              <holochain-membrane-context>
                .cellId=${cellId} .appWebsocket=${appWebsocket}
                <hod-my-calendar></hod-my-calendar>
              </holochain-membrane-context>
            `,
            root
          );
        },
      },
    ],
    entryRenderers: {
      calendar_event: {
        name: 'Calendar Event',
        render: (
          root: ShadowRoot,
          registry: CustomElementRegistry,
          entryHash: string
        ) => {
          registry.define('hod-calendar-event', scopeElement(HodCalendarEvent));
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
};

export default setupRenderers;
