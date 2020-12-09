import { ApolloClient } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { setupApolloClientElement } from '@holochain-open-dev/common';
import { SetupComponents } from 'compository';
import { CircularProgressBase } from '@material/mwc-circular-progress/mwc-circular-progress-base';

import { createApolloClient } from './client';
import { HodCreateCalendarEvent } from './elements/hod-create-calendar-event';
import { HodMyCalendar } from './elements/hod-my-calendar';
import { HodCalendarEvent } from './elements/hod-calendar-event';
import { html } from 'lit-html';
import { LinearProgressBase } from '@material/mwc-linear-progress/mwc-linear-progress-base';
import { Button } from '@material/mwc-button';
import { TextField } from '@material/mwc-textfield';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';

export const setupComponents: SetupComponents = async (
  appWebsocket: AppWebsocket,
  cellId: CellId,
  apolloClient?: ApolloClient<any>
) => {
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
    components: {
      'hod-my-calendar': myCalendar,
      'hod-create-calendar-event': createCalendar,
      'hod-calendar-event': calendarEvent,
      'mwc-circular-progress': CircularProgressBase,
      'mwc-linear-progress': LinearProgressBase,
      'mwc-menu-surface': MenuSurface,
      'mwc-textfield': TextField,
      'mwc-button': Button,
    },
    standalone: [],
    entryRenderers: {
      calendar_event: {
        name: 'Calendar Event',
        render: (entryHash: string) =>
          html`<hod-calendar-event
            .calendarEventHash=${entryHash}
          ></hod-calendar-event>`,
      },
    },
    entryAttachments: [],
  };
};
