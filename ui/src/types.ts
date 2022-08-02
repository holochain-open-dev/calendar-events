import { AgentPubKey, CellId, Record } from '@holochain/client';

export interface CalendarEvent {
  title: string;
  startTime: number;
  endTime: number;
  invitees: AgentPubKey[];
  location: string;
}

export interface RecordInfo {
  record: Record,
  provenance: CellId,
}
