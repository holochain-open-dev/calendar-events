import { createContext } from '@lit-labs/context';
import { CalendarEventsService } from './calendar-events-service';

export const calendarEventsServiceContext =
  createContext<CalendarEventsService>('hc_zome_calendar_events');
