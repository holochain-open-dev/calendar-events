import { ScopedElementsMixin as Scoped } from '@open-wc/scoped-elements';
import { CalendarEventsService } from '../calendar-events.service';
import { BaseElement } from '@holochain-open-dev/common';

export abstract class BaseCalendarElement extends BaseElement {
  abstract get _calendarEventsService(): CalendarEventsService;
}
