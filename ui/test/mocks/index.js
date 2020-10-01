import { gql, ApolloClient, InMemoryCache } from '@apollo/client/core';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { AppWebsocket } from '@holochain/conductor-api';

import { calendarEventsResolvers, calendarEventsTypeDefs } from '../../dist';
import { AppWebsocketMock } from './AppWebsocket.mock';
import { CalendarEventsMock } from './calendar-events.mock';

const rootTypeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const allTypeDefs = [rootTypeDef, calendarEventsTypeDefs];

export async function getAppWebsocket() {
  if (process.env.E2E) return AppWebsocket.connect('ws://localhost:8888');
  else {
    const dnaMock = new CalendarEventsMock();
    return new AppWebsocketMock(dnaMock);
  }
}

/**
 * If process.env.E2E is undefined, it will mock the backend
 * If process.env.E2E is defined, it will try to connect to holochain at ws://localhost:8888
 */
export async function setupApolloClientMock() {
  const appWebsocket = await getAppWebsocket();

  const appInfo = await appWebsocket.appInfo({ app_id: 'test-app' });

  const cellId = appInfo.cell_data[0][0];

  const executableSchema = makeExecutableSchema({
    typeDefs: allTypeDefs,
    resolvers: [calendarEventsResolvers(appWebsocket, cellId)],
  });

  const schemaLink = new SchemaLink({ schema: executableSchema });

  return new ApolloClient({
    typeDefs: allTypeDefs,

    cache: new InMemoryCache(),
    link: schemaLink,
  });
}
