import { gql, ApolloClient, InMemoryCache } from '@apollo/client/core';
import { expect } from '@open-wc/testing';
import { GET_MY_CALENDAR_EVENTS } from '../dist/graphql/queries';

import { setupApolloClientMock } from './mocks/utils';

describe('Apollo middleware', () => {
  it('create a calendar event and retrieve it', async () => {
    const client = await setupApolloClientMock();

    const createCalendarEvent = await client.mutate({
      mutation: CREATE_CALENDAR_EVENT,
      variables: {
        title: 'Event 1',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + 10,
        location: null,
        invitees: [],
      },
    });

    const result = await client.query({
      query: GET_MY_CALENDAR_EVENTS
    });

    expect(result.data.myCalendarEvents.length).to.equal(1);
    expect(result.data.myCalendarEvents[0].id).to.equal(
      createCalendarEvent.data.createCalendarEvent.id
    );
    expect(result.data.myCalendarEvents[0].title).to.equal('Event 1');
  });
});
