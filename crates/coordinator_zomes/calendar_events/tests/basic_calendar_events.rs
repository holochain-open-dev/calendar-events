use calendar_events_integrity::*;
// use hc_zome_calendar_events::*;
use hdk::prelude::holo_hash::*;
use hdk::prelude::*;
// use chrono::DateTime;
// use chrono::Utc;

use holochain::test_utils::consistency_10s;
use holochain::{conductor::config::ConductorConfig, sweettest::*};


#[tokio::test(flavor = "multi_thread")]
async fn create_and_get_calendar_event() {
    // use prebuilt DNA file
    let dna_path = std::env::current_dir()
        .unwrap()
        .join("../../../workdir/calendar_events-test.dna");
    let dna = SweetDnaFile::from_bundle(&dna_path).await.unwrap();

    // Set up conductors
    let mut conductors = SweetConductorBatch::from_config(2, ConductorConfig::default()).await;
    let apps = conductors.setup_app("calendar_events", &[dna]).await.unwrap();
    conductors.exchange_peer_info().await;

    let ((alice,), (bobbo,)) = apps.into_tuples();

    let alice_transactions = alice.zome("calendar_events_coordinator");
    // let bob_transactions = bobbo.zome("hc_zome_calendar_events_coordinator");

    println!("Alice {}", alice.agent_pubkey());
    println!("Bob {}", bobbo.agent_pubkey());

    consistency_10s(&[&alice, &bobbo]).await;

    // Check that there are no calendar events initially
    let all_calendar_events: Vec<Record> = conductors[0]
    .call(&alice_transactions, "get_all_calendar_events", ())
    .await;
    assert_eq!(all_calendar_events.len(), 0);



    // Alice creates a calendar event and tries to get it
    let calendar_event_input = CalendarEvent {
        title: "Test Event".into(),
        start_time: Timestamp::from_micros(1656416717000000),
        end_time: Timestamp::from_micros(1656377117000000),
        location: Some(EventLocation::Custom("Sweettest Happyplace".into())),
        invitees: vec![bobbo.agent_pubkey().clone()],
    };

    println!("calendar_event_input: {:?}\n", calendar_event_input);

    let action_hash: ActionHash = conductors[0]
    .call(&alice_transactions, "create_calendar_event", calendar_event_input)
    .await;

    println!("published calendar event with action hash {:?}\n", action_hash.clone());

    consistency_10s(&[&alice, &bobbo]).await;

    let calendar_event_elements: Vec<Record> = conductors[0]
    .call(&alice_transactions, "get_all_calendar_events", ())
    .await;

    let response_action_hash: Option<ActionHash> = match calendar_event_elements.clone().pop() {
        Some(el) => Some(el.action_address().to_owned()),
        None => None
    };

    println!("response_action_hash: {:?}\n", response_action_hash);
    assert_eq!(response_action_hash, Some(action_hash.clone()));


    let calendar_event_element: Record = conductors[0]
    .call(&alice_transactions, "get_calendar_event", action_hash.clone())
    .await;

    // let calendar_event: CalendarEvent = calendar_event_element.entry().to_app_option().unwrap().unwrap();
    let response_action_hash = calendar_event_element.action_address().to_owned();

    println!("calendar_event_element: {:?}\n", calendar_event_element);
    assert_eq!(response_action_hash, action_hash);


}