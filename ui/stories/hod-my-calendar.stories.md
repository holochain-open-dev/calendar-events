```js script
import { html } from 'lit-element';
import { withKnobs, withWebComponentsKnobs } from '@open-wc/demoing-storybook';

import { MembraneContextProvider } from '@holochain-open-dev/membrane-context';
import { HodMyCalendar } from '../dist';

customElements.define('membrane-context-provider', MembraneContextProvider);
customElements.define('hod-my-calendar', HodMyCalendar);

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

1. Import and define the `HodMyCalendar` class:

```js
import { HodMyCalendar } from '@holochain-open-dev/calendar-events';

customElements.define('hod-my-calendar', HodMyCalendar);
```

2. Import and define the `MembraneContextProvider`:

```js
import { MembraneContextProvider } from '@holochain-open-dev/membrane-context';

customElements.define('membrane-context-provider', MembraneContextProvider);
```

3. Define the element anywhere in your html:

```html
<body>
  <membrane-context-provider id="context">
    <hod-my-calendar> </hod-my-calendar>
  </membrane-context-provider>
</body>
```

### Variants

```js preview-story
export const Default = () =>
  html` <hod-my-calendar style="flex: 1"></hod-my-calendar> `;
```

```js preview-story
export const MonthView = () =>
  html`
    <hod-my-calendar
      initial-view="dayGridMonth"
      style="flex: 1"
    ></hod-my-calendar>
  `;
```
