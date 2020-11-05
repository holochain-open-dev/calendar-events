```js script
import { html } from '@open-wc/demoing-storybook';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';

export default {
  title: 'HodCreateCalendarEvent',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: {
    component: 'hod-create-calendar-event',
    options: { selectedPanel: 'storybookjs/knobs/panel' },
  },
};
```

# `<hod-create-calendar-event>`

Form to create a new calendar event in your calendar.

## Features

- Creates the calendar event in the backend and dispatches an `event-created` event.

## API

<sb-props of="hod-create-calendar-event"></sb-props>

### Installation & Usage

Please note that this custom element needs to be installed together with all the other elements of the `CalendarEventsModule`. Go to [https://github.com/holochain-open-dev/calendar-events-module](https://github.com/holochain-open-dev/calendar-events-module) for installation instructions.

After having installed the `CalendarEventsModule`, just add the element to your html:

```html
<body>
  <hod-create-calendar-event></hod-create-calendar-event>
</body>
```

### Variants

```js preview-story
export const Default = () =>
  html`
    <div style="height: 200px; width: 300px; padding: 16px;">
      <hod-create-calendar-event></hod-create-calendar-event>
    </div>
  `;
```

```js preview-story
export const InitialEventProperties = () => {
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = Math.floor(Date.now() / 1000) + 3600;
  return html`
    <div style="height: 200px; width: 300px; padding: 16px;">
      <hod-create-calendar-event
        .initialEventProperties=${{ startTime, endTime }}
      ></hod-create-calendar-event>
    </div>
  `;
};
```
