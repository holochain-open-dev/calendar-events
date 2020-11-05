import { ApolloClient } from '@apollo/client/core';
import { HodCreateCalendarEvent } from './elements/hod-create-calendar-event';
import { HodMyCalendar } from './elements/hod-my-calendar';
import { setupApolloClientElement } from './utils';

export class CalendarEventsModule {
  constructor(protected dependencies: { apolloClient: ApolloClient<any> }) {}

  async install(): Promise<void> {
    customElements.define(
      'hod-my-calendar',
      setupApolloClientElement(HodMyCalendar, this.dependencies.apolloClient)
    );
    customElements.define(
      'hod-create-calendar-event',
      setupApolloClientElement(
        HodCreateCalendarEvent,
        this.dependencies.apolloClient
      )
    );
  }

  static isInstalled(): boolean {
    return (
      customElements.get('hod-my-calendar') &&
      customElements.get('hod-create-calendar-event')
    );
  }
}
