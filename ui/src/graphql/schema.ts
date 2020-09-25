import { gql } from '@apollo/client/core';

export const calendarEventsTypeDefs = gql`
  scalar Date

  type CalendarEvent {
    id: ID!
    title: String!
    startTime: Date!
    endTime: Date!
    createdBy: ID!
    location: String
    invitees: [ID!]!
  }

  extend type Query {
    myCalendarEvents: [CalendarEvent!]!
  }

  extend type Mutation {
    createCalendarEvent(
      title: String!
      startTime: Date!
      endTime: Date!
      location: String
      invitees: [ID!]!
    ): CalendarEvent!
  }
`;
