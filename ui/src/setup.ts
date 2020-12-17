import { ApolloClient } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { setupApolloClientElement } from '@holochain-open-dev/common';
import { Dictionary } from 'compository';

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