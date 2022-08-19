import { Record, AgentPubKey, CellId } from '@holochain/client';

export interface CalendarEvent {
  title: string;
  startTime: number;
  endTime: number;
  invitees: AgentPubKey[];
  location: string;
}

export interface RecordInfo {
  element: Record;
  provenance: CellId;
}
