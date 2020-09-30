import { ApolloClient } from '@apollo/client/core';
import { defineHodCreateCalendarEvent } from './elements/hod-create-calendar-event';
import { defineHodMyCalendar } from './elements/hod-my-calendar';

export function installCalendarEventsModule(dependencies: {
  apolloClient: ApolloClient<any>;
}) {
  defineHodMyCalendar(dependencies.apolloClient);
  defineHodCreateCalendarEvent(dependencies.apolloClient);
}
