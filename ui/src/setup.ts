import { ApolloClient } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { setupApolloClientElement } from '@holochain-open-dev/common';
import { Dictionary, SetupRenderers } from 'compository';
import { html, render } from 'lit-html';

import { createApolloClient } from './client';
import { HodCreateCalendarEvent } from './elements/hod-create-calendar-event';
import { HodMyCalendar } from './elements/hod-my-calendar';
import { HodCalendarEvent } from './elements/hod-calendar-event';

export function setupElements(
  appWebsocket: AppWebsocket,
  cellId: CellId,
  apolloClient?: ApolloClient<any>
): Dictionary<typeof HTMLElement> {
  if (!apolloClient) {
    apolloClient = createApolloClient(appWebsocket, cellId);
  }

  const myCalendar: typeof HTMLElement = setupApolloClientElement(
    HodMyCalendar,
    apolloClient
  );
  const createCalendar: typeof HTMLElement = setupApolloClientElement(
    HodCreateCalendarEvent,
    apolloClient
  );
  const calendarEvent: typeof HTMLElement = setupApolloClientElement(
    HodCalendarEvent,
    apolloClient
  );
  return {
    'hod-my-calendar': myCalendar,
    'hod-create-calendar-event': createCalendar,
    'hod-calendar-event': calendarEvent,
  };
}

function defineElements(
  registry: CustomElementRegistry,
  elements: Dictionary<typeof HTMLElement>
) {
  for (const tag of Object.keys(elements)) {
    registry.define(tag, elements[tag]);
  }
}

export const setupRenderers: SetupRenderers = async (
  appWebsocket: AppWebsocket,
  cellId: CellId
) => {
  const elements = setupElements(appWebsocket, cellId, undefined);
  return {
    standalone: [],
    entryRenderers: {
      calendar_event: {
        name: 'Calendar Event',
        render: (
          registry: CustomElementRegistry,
          root: ShadowRoot,
          entryHash: string
        ) => {
          defineElements(registry, elements);
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

