import { html, fixture, expect } from '@open-wc/testing';

import { HodFullCalendar } from '../dist/elements/hod-full-calendar';
import { CREATE_CALENDAR_EVENT } from '../dist/graphql/queries';
import { setupApolloClientMock } from './mocks/utils.js';

describe('HodCalendarEvent', () => {
  beforeAll(async () => {
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
  });

  it('<hod-full-calendar> renders a newly created event', async () => {
    const el = await fixture(html` <hod-full-calendar></hod-full-calendar> `);

    const fullCalendar = el.shadowRoot.querySelector('#full-calendar');

    expect(fullCalendar.innerHTML.includes('Event 1')).to.be.ok;
  });
});
