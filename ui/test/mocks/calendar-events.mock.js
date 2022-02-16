import { randomEntryHash, randomPubKey } from 'holochain-ui-test-utils';

export class CalendarEventsMock {
  constructor() {
    this.calendarEvents = [];
  }

  create_calendar_event(calendarInput) {
    const calendarEntry = {
      entryHash: randomEntryHash(),
      entry: {
        ...calendarInput,
        createdBy: randomPubKey(),
      },
    };
    this.calendarEvents.push(calendarEntry);

    return calendarEntry;
  }

  get_my_calendar_events() {
    return this.calendarEvents;
  }
}
