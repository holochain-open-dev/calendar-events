import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';
import { AgentPubKey } from '@holochain/client';

export interface CalendarEvent {
  title: string;
  startTime: number;
  endTime: number;
  invitees: AgentPubKey[];
  location: string;
}
