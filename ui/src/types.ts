import { AgentPubKeyB64, Element } from '@holochain-open-dev/core-types';
import { AgentPubKey, CellId } from '@holochain/client';

export interface CalendarEvent {
  title: string;
  startTime: number;
  endTime: number;
  invitees: AgentPubKey[];
  location: string;
}

export interface ElementInfo {
  element: Element;
  provenance: CellId;
}
