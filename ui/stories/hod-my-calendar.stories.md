```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';
import { CalendarEventsModule } from '../dist';
import { setupApolloClientMock } from '../test/mocks/utils';

setupApolloClientMock().then(client =>
  new CalendarEventsModule({ apolloClient: client }).install()
);

export default {
  title: 'HodMyCalendar',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    component: 'hod-my-calendar',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
  },
};
```

# `<hod-my-calendar>`

Displays all your relevant calendar events.

## Features

- Automatically fetches the calendar events from the holochain backend
- Only shows calendar events that you have created or you are invited to
- Create calendar events with selecting the time in the calendar itself and reload the events

## API

<sb-props of="hod-my-calendar"></sb-props>

### Installation & Usage

Please note that this custom element needs to be installed together with all the other elements of the `CalendarEventsModule`. Go to [https://github.com/holochain-open-dev/calendar-events-module](https://github.com/holochain-open-dev/calendar-events-module) for installation instructions.

After having installed the `CalendarEventsModule`, just add the element to your html:

```html
<body>
  <hod-my-calendar></hod-my-calendar>
</body>
```

### Variants

```js preview-story
export const Default = () => html` <hod-my-calendar></hod-my-calendar> `;
```

```js preview-story
export const MonthView = () =>
  html` <hod-my-calendar initial-view="dayGridMonth"></hod-my-calendar> `;
```
