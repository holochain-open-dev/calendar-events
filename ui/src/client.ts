import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { calendarEventsResolvers } from './graphql/resolvers';
import { calendarEventsTypeDefs } from './graphql/schema';
import { SchemaLink } from '@apollo/client/link/schema';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
import { serializeHash } from '@holochain-open-dev/common';

const rootTypeDef = gql`
  type Query {
    membrane(membraneId: ID!): CalendarEventsMembrane!
  }

  type Mutation {
    _: Boolean
  }
`;
function resolvers(cellId: CellId) {
  return {
    Query: {
      membrane() {
        return {
          id: serializeHash(cellId[0]),
        };
      },
    },
  };
}

export const allTypeDefs = [rootTypeDef, calendarEventsTypeDefs];

export function createApolloClient(
  appWebsocket: AppWebsocket,
  cellId: CellId
): ApolloClient<any> {
  const executableSchema = makeExecutableSchema({
    typeDefs: allTypeDefs,
    resolvers: [
      resolvers(cellId),
      calendarEventsResolvers(appWebsocket, cellId),
    ],
    inheritResolversFromInterfaces: true,
  });

  const schemaLink = new SchemaLink({ schema: executableSchema });

  return new ApolloClient({
    typeDefs: allTypeDefs,

    cache: new InMemoryCache(),
    link: schemaLink,
  });
}
