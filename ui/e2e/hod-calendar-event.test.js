import { gql } from '@apollo/client/core';
import { html, fixture, expect } from '@open-wc/testing';

import {
  CREATE_CALENDAR_EVENT,
  calendarEventsTypeDefs,
  calendarEventsResolvers,
} from '../dist';

const rootTypeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export async function setupClient(url) {
  const appWebsocket = await AppWebsocket.connect(String(url));

  const appInfo = await appWebsocket.appInfo({ app_id: 'test-app' });

  const cellId = appInfo.cell_data[0][0];

  const executableSchema = makeExecutableSchema({
    typeDefs: [rootTypeDef, calendarEventsTypeDefs],
    resolvers: [calendarEventsResolvers(appWebsocket, cellId)],
  });

  const schemaLink = new SchemaLink({ schema: executableSchema });

  return new ApolloClient({
    typeDefs: allTypeDefs,

    cache: new InMemoryCache(),
    link: schemaLink,
  });
}

describe('HodCalendarEvent', () => {
  it('GraphQl schema and resolvers work', async () => {
    const client = await setupClient('ws://localhost:8888');

    const calendarHash = await client.mutate({
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
      query: gql`
        {
          allCalendarEvents {
            id
            title
          }
        }
      `,
    });

    expect(result.length).to.equal(1);
    expect(result[0].id).to.equal(calendarHash);
    expect(result[0].title).to.equal('Event 1');
  });
});
