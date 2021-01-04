# CalendarEventsModule

Small module to create and see calendar events, in holochain RSM.

This module is designed to be included in other DNAs, assuming as little as possible from those. It is packaged as a holochain zome, and an npm package that offers native Web Components that can be used across browsers and frameworks.

> Please note, this module is in its early infancy, right now more usable as a reference for building reusable modules. Help is appreciated and much needed!

## Documentation

See our [`storybook`](https://holochain-open-dev.github.io/calendar-events-module).

## Assumptions

These are the things you need to know to decide if you can use this module in your happ:

- Zome:
  - Optional dependency with the [resource-bookings-zome](https://github/holochain-open-dev/resource-bookings-zome), when it is completed.
- UI module:
  - No framework or library assumed.

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

1. Install the module with `npm install @holochain-open-dev/calendar-events`.

2. In the root file of your application, install the module:

```js
import { CalendarEventsModule } from "@holochain-open-dev/calendar-events";
async function initApp() {
  const client = await setupClient(`ws://localhost:8888`);

  const calendarEventsModule = new CalendarEventsModule(client);

  await calendarEventsModule.install();
}
```

3. Once you have installed the module, all the elements you see in our storybook will become available for you to use in your HTML, like this:

```html
...
<body>
  <hod-my-calendar></hod-my-calendar>
</body>
```

Take into account that at this point the elements already expect a holochain conductor running at `ws://localhost:8888`.

## Developer setup

This respository is structured in the following way:

- `ui/`: UI library.
- `zome/`: example DNA with the `calendar_events` code.
- Top level `Cargo.toml` is a virtual package necessary for other DNAs to include this zome by pointing to this git repository.

Read the [UI developer setup](/ui/README.md) and the [Zome developer setup](/zome/README.md).
