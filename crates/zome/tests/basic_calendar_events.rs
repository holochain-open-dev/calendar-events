use hc_zome_calendar_events_integrity::*;
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
        .join("../../workdir/calendar_events-test.dna");
    let dna = SweetDnaFile::from_bundle(&dna_path).await.unwrap();

    // Set up conductors
    let mut conductors = SweetConductorBatch::from_config(2, ConductorConfig::default()).await;
    let apps = conductors.setup_app("calendar_events", &[dna]).await.unwrap();
    conductors.exchange_peer_info().await;

    let ((alice,), (bobbo,)) = apps.into_tuples();

    let alice_transactions = alice.zome("calendar_events");
    // let bob_transactions = bobbo.zome("calendar_events");

    println!("Alice {}", alice.agent_pubkey());
    println!("Bob {}", bobbo.agent_pubkey());

    consistency_10s(&[&alice, &bobbo]).await;

    // Check that there are no calendar events initially
    let all_calendar_events: Vec<Element> = conductors[0]
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

    let header_hash: HeaderHash = conductors[0]
    .call(&alice_transactions, "create_calendar_event", calendar_event_input)
    .await;

    println!("published calendar event with header hash {:?}\n", header_hash.clone());

    consistency_10s(&[&alice, &bobbo]).await;

    let calendar_event_elements: Vec<Element> = conductors[0]
    .call(&alice_transactions, "get_all_calendar_events", ())
    .await;

    let response_header_hash: Option<HeaderHash> = match calendar_event_elements.clone().pop() {
        Some(el) => Some(el.header_address().to_owned()),
        None => None
    };

    println!("response_header_hash: {:?}\n", response_header_hash);
    assert_eq!(response_header_hash, Some(header_hash.clone()));


    let calendar_event_element: Element = conductors[0]
    .call(&alice_transactions, "get_calendar_event", header_hash.clone())
    .await;

    // let calendar_event: CalendarEvent = calendar_event_element.entry().to_app_option().unwrap().unwrap();
    let response_header_hash = calendar_event_element.header_address().to_owned();

    println!("calendar_event_element: {:?}\n", calendar_event_element);
    assert_eq!(response_header_hash, header_hash);


}