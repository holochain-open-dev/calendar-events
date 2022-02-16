# Zome Developer Setup

This folder has an example DNA for the `hc_zome_calendar_events` zome. The actual code for the zome is in `zomes/calendar_events`.

## Building

Be inside the nix-shell (`nix-shell .` at the root level project folder)

```bash
CARGO_TARGET_DIR=target cargo build --release --target wasm32-unknown-unknown
hc dna pack zome/workdir/dna
hc app pack zome/workdir/happ
```

This should create a `workdir/happ/sample.happ` file.

## Testing

After having built the DNA:

```bash
cd test
npm install
npm test
```

## Running

After having built the DNA:

```bash
hc s generate workdir/happ/sample.happ --run=8888
```

Now `holochain` will be listening at port `8888`;
