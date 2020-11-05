export { HodCreateCalendarEvent } from './elements/hod-create-calendar-event';
export { HodMyCalendar } from './elements/hod-my-calendar';

export { calendarEventsTypeDefs } from './graphql/schema';
export { calendarEventsResolvers } from './graphql/resolvers';
export {
  CREATE_CALENDAR_EVENT,
  GET_MY_CALENDAR_EVENTS,
} from './graphql/queries';

export { CalendarEventsModule } from './calendar-events.module';

export { setupApolloClientElement } from './utils';
