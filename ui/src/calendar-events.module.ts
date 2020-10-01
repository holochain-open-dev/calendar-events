import { ApolloClient } from '@apollo/client/core';
import { defineHodCreateCalendarEvent } from './elements/hod-create-calendar-event';
import { defineHodMyCalendar } from './elements/hod-my-calendar';

export class CalendarEventsModule {
  constructor(protected dependencies: { apolloClient: ApolloClient<any> }) {}

  async install(): Promise<void> {
    defineHodMyCalendar(this.dependencies.apolloClient);
    defineHodCreateCalendarEvent(this.dependencies.apolloClient);
  }

  static isInstalled(): boolean {
    return (
      customElements.get('hod-my-calendar') &&
      customElements.get('hod-create-calendar-event')
    );
  }
}
