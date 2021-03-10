import { CalendarEventsService } from '../calendar-events.service';
import { BaseElement } from '@holochain-open-dev/common';
export declare abstract class BaseCalendarElement extends BaseElement {
    abstract get _calendarEventsService(): CalendarEventsService;
}
