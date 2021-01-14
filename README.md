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

6. Add the zome into your `*.dna.workdir/dna.json` file.
7. Compile the DNA with the usual `CARGO_TARGET=target cargo build --release --target wasm32-unknown-unknown`.

### Including the UI

See the list of available elements [here](https://holochain-open-dev.github.io/calendar-events).

1. Install the module with `npm install https://github.com/holochain-open-dev/calendar-events`.

2. Import and define the the elements you want to include:

```js
import { HodMyCalendar } from "@holochain-open-dev/calendar-events";
```

3. Import and define the `membrane-context-provider` element from `@holochain-open-dev/membrane-context`:

```js
import { MembraneContextProvider } from "@holochain-open-dev/membrane-context";

customElements.define("membrane-context-provider", MembraneContextProvider);
```

4. Include the elements in your html inside an initialized instance of the membrane context provider:

```html
<body>
  <membrane-context-provider id="context">
    <hod-my-calendar> </hod-my-calendar>
  </membrane-context-provider>

  <script type="module">
    import ConductorApi from "@holochain/conductor-api";
    import { HodMyCalendar } from "@holochain-open-dev/calendar-events";
    import { MembraneContextProvider } from "@holochain-open-dev/membrane-context";

    (async function () {
      const appWebsocket = await ConductorApi.AppWebsocket.connect(
        "ws://localhost:8888"
      );

      const appInfo = await appWebsocket.appInfo({
        installed_app_id: "test-app",
      });
      const cellId = appInfo.cell_data[0][0];

      customElements.define(
        "membrane-context-provider",
        MembraneContextProvider
      );

      const context = document.getElementById("context");
      context.appWebsocket = appWebsocket;
      context.cellId = cellId;

      customElements.define("hod-my-calendar", HodMyCalendar);
    })();
  </script>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

## Developer setup

This respository is structured in the following way:

- `ui/`: UI library.
- `zome/`: example DNA with the `calendar_events` code.
- Top level `Cargo.toml` is a virtual package necessary for other DNAs to include this zome by pointing to this git repository.

Read the [UI developer setup](/ui/README.md) and the [Zome developer setup](/zome/README.md).
