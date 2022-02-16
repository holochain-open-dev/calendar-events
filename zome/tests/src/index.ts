import {
  Orchestrator,
  Config,
  InstallAgentsHapps,
  Player,
} from "@holochain/tryorama";
import path from "path";

const conductorConfig = Config.gen({});

// Construct proper paths for your DNAs
const calendarEvents = path.join(__dirname, "../../workdir/dna/calendar_events-test.dna");

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

const orchestrator = new Orchestrator();

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [calendarEvents],
  ],
  // agent 1
  [
    // happ 0
    [calendarEvents],
  ],
];

orchestrator.registerScenario(
  "create and get a calendar event",
  async (s, t) => {
    const [player]: Player[] = await s.players([conductorConfig]);
    const [[alice_happ], [bob_happ]] = await player.installAgentsHapps(
      installation
    );

    const alice_calendar = alice_happ.cells[0];
    const bob_calendar = bob_happ.cells[0];

    let calendarEvent = await alice_calendar.call(
      "calendar_events",
      "create_calendar_event",
      {
        title: "Event 1",
        startTime: Date.now(),
        endTime: Date.now() + 10000,
        location: { Custom: "hiii" },
        invitees: [],
      }
    );
    t.ok(calendarEvent.entryHash);

    await sleep(30);

    let calendarEvents = await alice_calendar.call(
      "calendar_events",
      "get_my_calendar_events",
      null
    );
    t.equal(calendarEvents.length, 1);

    calendarEvents = await bob_calendar.call(
      "calendar_events",
      "get_my_calendar_events",
      null
    );
    t.equal(calendarEvents.length, 1);
  }
);

orchestrator.run();
