import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';

export interface CalendarEvent {
  title: string;
  createdBy: AgentPubKeyB64;
  startTime: number;
  endTime: number;
  invitees: AgentPubKeyB64[];
  location: string;
}

export const CALENDAR_EVENTS_SERVICE_CONTEXT =
  'hc_zome_calendar_events/service';
