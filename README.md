# CalendarEventsModule

Small module to create and see calendar events, in holochain RSM.

This module is designed to be included in other DNAs, assuming as little as possible from those. It is packaged as a holochain zome, and an npm package that offers native Web Components that can be used across browsers and frameworks.

> Please note, this module is in its early infancy, right now more usable as a reference for building reusable modules. Help is appreciated and much needed!

## Documentation

See our [`storybook`](https://holochain-open-dev.github.io/calendar-events).

## Installation and usage

### Including the zome in your DNA

1. Create a new folder in the `zomes` of the consuming DNA, with the name you want to give to this zome in your DNA.
2. Add a new `Cargo.toml` in that folder. In its content, paste the `Cargo.toml` content from any zome.
3. Change the `name` properties of the `Cargo.toml` file to the name you want to give to this zome in your DNA.
4. Add this zome as a dependency in the `Cargo.toml` file:

```toml
[dependencies]
calendar_events = {git = "https://github.com/holochain-open-dev/calendar-events-module", package = "calendar_events"}
```

5. Create a `src` folder besides the `Cargo.toml` with this content:

```rust
extern crate calendar_events;
```

6. Add the zome into your `*.dna.workdir/dna.yaml` file.
7. Compile the DNA with the usual `CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown`.

### Including the UI

See the list of available elements [here](https://holochain-open-dev.github.io/calendar-events).

1. Install the module with `npm install https://github.com/holochain-open-dev/calendar-events`.

2. Import and define the the elements you want to include:

```js
import ConductorApi from "@holochain/conductor-api";
import {
  HodMyCalendar,
  CalendarEventsService,
} from "@holochain-open-dev/calendar-events";

async function setupCalendarEvents() {
  const appWebsocket = await ConductorApi.AppWebsocket.connect(
    "ws://localhost:8888"
  );

  const appInfo = await appWebsocket.appInfo({
    installed_app_id: "test-app",
  });
  const cellId = appInfo.cell_data[0].cell_id;

  const service = new CalendarEventsService(appWebsocket, cellId);

  customElements.define(
    "hod-my-calendar",
    class extends HodMyCalendar {
      get _calendarEventsService() {
        return service;
      }
    }
  );
}
```

3. Include the elements in your html:

```html
<body>
  <hod-my-calendar> </hod-my-calendar>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

You can see a full working example [here](/ui/demo/index.html).

## Developer setup

Visit the [developer setup](/dev-setup.md).
