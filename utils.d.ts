import { ApolloClient } from '@apollo/client/core';
import { CalendarEvent } from './types';
export declare function secsTimestampToDate(secs: number): Date;
export declare function dateToSecsTimestamp(date: Date): number;
export declare function eventToFullCalendar(calendarEvent: CalendarEvent): {
    id: string;
    title: string;
    start: string;
    end: string;
};
/**
 * Setups the given element with the ApolloClient dependency
 * The result is ready to call customElements.define()
 */
export declare function setupApolloClientElement(element: any, apolloClient: ApolloClient<any>): typeof HTMLElement;
