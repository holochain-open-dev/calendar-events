import { ApolloClient } from '@apollo/client/core';
import { HodFullCalendar } from './elements/hod-full-calendar';

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
    'hod-full-calendar',
    HodFullCalendar(dependencies.apolloClient)
  );
}

export { HodFullCalendar };
