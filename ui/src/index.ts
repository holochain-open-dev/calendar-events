import { ApolloClient } from '@apollo/client/core';
import { HodCreateCalendarEvent } from './elements/hod-create-calendar-event';
import { HodMyCalendar } from './elements/hod-my-calendar';

export { calendarEventsTypeDefs } from './graphql/schema';
export { calendarEventsResolvers } from './graphql/resolvers';
export {
  CREATE_CALENDAR_EVENT,
  GET_MY_CALENDAR_EVENTS,
} from './graphql/queries';

export function installCalendarEventsModule(dependencies: {
  apolloClient: ApolloClient<any>;
}) {
  customElements.define(
    'hod-my-calendar',
    HodMyCalendar(dependencies.apolloClient)
  );
  customElements.define(
    'hod-create-calendar-event',
    HodCreateCalendarEvent(dependencies.apolloClient)
  );
}

export { HodMyCalendar };
