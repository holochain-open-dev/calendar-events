import { Constructor, property, query } from 'lit-element/lib/decorators';
import { ScopedElementsMixin as Scoped } from '@open-wc/scoped-elements';
import { CalendarEventsService } from '../calendar-events.service';
import { membraneContext } from '@holochain-open-dev/membrane-context';
import { LitElement } from 'lit-element';
import { AppWebsocket, CellId } from '@holochain/conductor-api';

export class BaseElement extends membraneContext(
  Scoped(LitElement) as Constructor<LitElement>
) {
  get calendarEventsService(): CalendarEventsService {
    return new CalendarEventsService(
      this.membraneContext.appWebsocket as AppWebsocket,
      this.membraneContext.cellId as CellId
    );
  }
}
