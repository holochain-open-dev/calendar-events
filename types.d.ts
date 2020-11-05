export interface CalendarEvent {
    id: string;
    title: string;
    createdBy: string;
    startTime: number;
    endTime: number;
    invitees: string[];
    location: string;
}
