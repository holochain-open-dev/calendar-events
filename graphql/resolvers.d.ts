import { Resolvers } from '@apollo/client/core';
import { AppWebsocket, CellId } from '@holochain/conductor-api';
export declare const calendarEventsResolvers: (appWebsocket: AppWebsocket, cellId: CellId, zomeName?: string) => Resolvers;
