import { html, fixture, expect, waitUntil } from '@open-wc/testing';

import { CalendarEventsModule } from '../dist';
import { setupApolloClientMock } from '../test/mocks/utils.js';

describe('top-level workflows', () => {
  it('create calendar event and retrieve it', async () => {
    const client = await setupApolloClientMock();

    if (!CalendarEventsModule.isInstalled()) {
      await new CalendarEventsModule(client).install();
    }

    const el = await fixture(html` <hod-my-calendar></hod-my-calendar> `);

    const fullCalendar = el.shadowRoot.querySelector('#calendar');
    expect(fullCalendar.innerHTML.includes('Event 1')).to.be.not.ok;

    fullCalendar.querySelector('.fc-timegrid-slot').click();
/* 
    TODO: uncomment when we find a way to click the middle of the screen

    await waitUntil(
      () => el.shadowRoot.querySelector('#create-event-menu').isSurfaceOpen
    );

    const createCalendarEl = el.shadowRoot.querySelector(
      'hod-create-calendar-event'
    );
    createCalendarEl.shadowRoot.querySelector('#event-title').value = 'Event 1';
    createCalendarEl.shadowRoot.querySelector('#create-event-button').click();
    console.log('asdf1');
    await waitUntil(
      () => !el.shadowRoot.querySelector('#create-event-menu').isSurfaceOpen
    );

    console.log('asdf2');
    await waitUntil(() => fullCalendar.innerHTML.includes('Event 1'));

    console.log('asdf3');
    expect(fullCalendar.innerHTML).to.include('Event 1');
 */  });
});
