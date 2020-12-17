import { scopeElement } from 'scoped-elements/dist/scoped';
import { SetupRenderers } from 'compository';
import { html, render } from 'lit-html';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { setupElements } from './setup';

const setupRenderers: SetupRenderers = async (
  appWebsocket: AppWebsocket,
  cellId: CellId
) => {
  const elements = setupElements(appWebsocket, cellId, undefined);
  return {
    standalone: [
      {
        name: 'Calendar',
        render(root: ShadowRoot, registry: CustomElementRegistry) {
          registry.define(
            'hod-my-calendar',
            scopeElement(elements['hod-my-calendar'])
          );
          render(html`<hod-my-calendar></hod-my-calendar>`, root);
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
          for (const tag of Object.keys(elements)) {
            registry.define(tag, scopeElement(elements[tag]));
          }
          render(
            html`<hod-calendar-event
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
