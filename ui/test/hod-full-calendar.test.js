import { html, fixture, expect, waitUntil } from '@open-wc/testing';

import { HodFullCalendar, CREATE_CALENDAR_EVENT } from '../dist';
import { setupApolloClientMock } from './mocks/utils.js';

describe('HodFullCalendar', () => {
  it('<hod-full-calendar> renders a newly created event', async () => {
    const client = await setupApolloClientMock();
    window.customElements.define('hod-full-calendar', HodFullCalendar(client));

    await client.mutate({
      mutation: CREATE_CALENDAR_EVENT,
      variables: {
        title: 'Event 1',
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + 10,
        location: null,
        invitees: [],
      },
    });

    const el = await fixture(html` <hod-full-calendar></hod-full-calendar> `);

    const fullCalendar = el.shadowRoot.querySelector('#calendar');
    await waitUntil(() => fullCalendar.innerHTML.includes('Event 1'));

    expect(fullCalendar.innerHTML).to.include('Event 1');
  });
});
