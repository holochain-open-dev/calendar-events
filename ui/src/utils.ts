import { ApolloClient } from '@apollo/client/core';
import { CalendarEvent } from './types';

export function secsTimestampToDate(secs: number): Date {
  return new Date(secs * 1000);
}

export function dateToSecsTimestamp(date: Date): number {
  return Math.floor(date.valueOf() / 1000);
}

export function eventToFullCalendar(calendarEvent: CalendarEvent) {
  return {
    id: calendarEvent.id,
    title: calendarEvent.title,
    start: secsTimestampToDate(calendarEvent.startTime).toISOString(),
    end: secsTimestampToDate(calendarEvent.endTime).toISOString(),
  };
}


/**
 * Setups the given element with the ApolloClient dependency
 * The result is ready to call customElements.define()
 */
export function setupApolloClientElement(
  element: any,
  apolloClient: ApolloClient<any>
): typeof HTMLElement {
  return (class extends element {
    get _apolloClient() {
      return apolloClient;
    }
  } as any) as typeof HTMLElement;
}