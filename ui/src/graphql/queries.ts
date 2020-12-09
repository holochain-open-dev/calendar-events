import { gql } from '@apollo/client/core';

export const CREATE_CALENDAR_EVENT = gql`
  mutation CreateCalendarEvent(
    $membraneId: ID!
    $title: String!
    $startTime: Date!
    $endTime: Date!
    $location: String
    $invitees: [ID!]!
  ) {
    createCalendarEvent(
      membraneId: $membraneId
      title: $title
      startTime: $startTime
      endTime: $endTime
      location: $location
      invitees: $invitees
    ) {
      id
      title
      createdBy
      startTime
      endTime
      location
      invitees
    }
  }
`;

export const GET_MY_CALENDAR_EVENTS = gql`
  query GetMyCalendarEvents($membraneId: ID!) {
    membrane(membraneId: $membraneId) {
      ... on CalendarEventsMembrane {
        myCalendarEvents {
          id
          title
          createdBy
          startTime
          endTime
          location
          invitees
        }
      }
    }
  }
`;

export const GET_CALENDAR_EVENT = gql`
  query GetCalendarEvent($membraneId: ID!, $calendarEventId: ID!) {
    membrane(membraneId: $membraneId) {
      ... on CalendarEventsMembrane {
        calendarEvent(calendarEventId: $calendarEventId) {
          id
          title
          createdBy
          startTime
          endTime
          location
          invitees
        }
      }
    }
  }
`;
