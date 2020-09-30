export {
  defineHodCreateCalendarEvent,
  HodCreateCalendarEvent,
} from './elements/hod-create-calendar-event';
export { defineHodMyCalendar, HodMyCalendar } from './elements/hod-my-calendar';

export { calendarEventsTypeDefs } from './graphql/schema';
export { calendarEventsResolvers } from './graphql/resolvers';
export {
  CREATE_CALENDAR_EVENT,
  GET_MY_CALENDAR_EVENTS,
} from './graphql/queries';

export { installCalendarEventsModule } from './calendar-events.module';
