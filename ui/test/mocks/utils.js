import { Buffer } from 'buffer';

import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { calendarEventsTypeDefs, calendarEventsResolvers } from '../../dist';
import { AppWebsocketMock } from './AppWebsocket.mock';
import { CalendarEventsMock } from './calendar-events.mock';

export function randomByte() {
  return Math.floor(Math.random() * 1000) % 256;
}

export function randomHash() {
  return {
    hash: Buffer.from(
      Array(35)
        .fill(false)
        .map(_ => randomByte())
    ),
    hash_type: Buffer.from(
      Array(3)
        .fill(false)
        .map(_ => randomByte())
    ),
  };
}

const rootTypeDef = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const allTypeDefs = [rootTypeDef, calendarEventsTypeDefs];

export async function setupApolloClientMock() {
  const dnaMock = new CalendarEventsMock();
  const appWebsocket = new AppWebsocketMock(dnaMock);

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
