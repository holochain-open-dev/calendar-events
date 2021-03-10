# UI Developer Setup

UI module for the `calendar_events` zome.

All the instructions here assume you are running them inside the nix-shell at the root of the repository. For more info, see the [developer setup](/dev-setup.md).

## Setup

```bash
npm install
```

## Running

```bash
npm start
```

This will serve a local development server that serves the basic demo located in `demo/index.html` at `localhost:8080/demo`.
Take into account that this will run the holochain conductor in the background and connect the UI to the actual conductor.

## Building

```bash
npm run build
```

## Testing with Karma

To run the suite of karma tests, run

```bash
npm run test
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
npm run test:watch
```

## E2E tests

Run this from inside the `nix-shell` in which you have the `holochain` binary install.

```bash
npm run e2e
```

Take into account that this will run the holochain conductor in the background to perform the tests.

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run build-storybook
```

## Linting with ESLint, Prettier, and Types

To scan the project for linting errors, run

```bash
npm run lint
```

To automatically fix many linting errors, run

```bash
npm run format
```
