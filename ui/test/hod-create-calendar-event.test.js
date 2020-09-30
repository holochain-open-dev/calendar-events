import { html, fixture, expect } from '@open-wc/testing';

import { defineHodCreateCalendarEvent, GET_MY_CALENDAR_EVENTS } from '../dist';
import { setupApolloClientMock, sleep } from './mocks/utils.js';

describe('HodCreateCalendarEvent', () => {
  it('<hod-create-calendar-event> creates a new event', async () => {
    const client = await setupApolloClientMock();
    defineHodCreateCalendarEvent(client);

    const el = await fixture(
      html`
        <hod-create-calendar-event
          .initialEventProperties=${{
            startTime: Math.floor(Date.now() / 1000),
            endTime: Math.floor(Date.now() / 1000) + 10,
          }}
        ></hod-create-calendar-event>
      `
    );
    el.shadowRoot.querySelector('#event-title').value = 'Event 1';
    el.shadowRoot.querySelector('#create-event-button').click();

    const result = await client.query({
      query: GET_MY_CALENDAR_EVENTS,
      fetchPolicy: 'network-only',
    });

    expect(result.data.myCalendarEvents.length).to.equal(1);
    expect(result.data.myCalendarEvents[0].title).to.equal('Event 1');
  });
});
