import { Orchestrator, Config } from "@holochain/tryorama";

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const orchestrator = new Orchestrator();

export const simpleConfig = {
  alice: Config.dna("../calendar_events.dna.gz", null),
  bobbo: Config.dna("../calendar_events.dna.gz", null),
};

const dateToTimestamp = (date) => [
  Math.floor(date / 1000),
  (date % 1000) * 1000,
];

orchestrator.registerScenario(
  "create and get a calendar event",
  async (s, t) => {
    const { conductor } = await s.players({
      conductor: Config.gen(simpleConfig),
    });
    await conductor.spawn();

    let calendarEvent = await conductor.call(
      "alice",
      "calendar_events",
      "create_calendar_event",
      {
        title: "Event 1",
        startTime: [Math.floor(Date.now() / 1000), 0],
        endTime: [Math.floor(Date.now() / 1000) + 1000, 0],
        location: { Custom: "hiii" },
        invitees: [],
      }
    );
    t.ok(calendarEvent.entry_hash);

    await sleep(10);

    let calendarEvents = await conductor.call(
      "alice",
      "calendar_events",
      "get_my_calendar_events",
      null
    );
    t.equal(calendarEvents.length, 1);

    calendarEvents = await conductor.call(
      "bobbo",
      "calendar_events",
      "get_my_calendar_events",
      null
    );
    t.equal(calendarEvents.length, 0);
  }
);

orchestrator.run();
