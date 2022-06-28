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


#[tokio::test(flavor = "multi_thread")]
async fn simple_transaction() {
    // Use prebuilt DNA file
    let dna_path = std::env::current_dir()
        .unwrap()
        .join("./workdir/mutual_credit.dna");
    let dna = SweetDnaFile::from_bundle(&dna_path).await.unwrap();

    // Set up conductors
    let mut conductors = SweetConductorBatch::from_config(2, ConductorConfig::default()).await;
    let apps = conductors.setup_app("mutual_credit", &[dna]).await.unwrap();
    conductors.exchange_peer_info().await;

    let ((alice,), (bobbo,)) = apps.into_tuples();

    let alice_transactions = alice.zome("transactions");
    let bob_transactions = bobbo.zome("transactions");
    let alice_transaction_requests = alice.zome("transaction_requests");
    let bob_transaction_requests = bobbo.zome("transaction_requests");

    println!("Alice {}", alice.agent_pubkey());
    println!("Bob {}", bobbo.agent_pubkey());

    consistency_10s(&[&alice, &bobbo]).await;

    let map: BTreeMap<HeaderHashB64, Transaction> = conductors[0]
        .call(&alice_transactions, "query_my_transactions", ())
        .await;
    assert_eq!(map.len(), 0);

    let map: BTreeMap<HeaderHashB64, Transaction> = conductors[1]
        .call(&bob_transactions, "query_my_transactions", ())
        .await;
    assert_eq!(map.len(), 0);

    let transaction_request_input = CreateTransactionRequestInput {
        transaction_request_type: TransactionRequestType::Send,
        counterparty_pub_key: AgentPubKeyB64::from(bobbo.agent_pubkey().clone()),
        amount: 10.0,
    };

    let (transaction_request_hash, _): (HeaderHashB64, TransactionRequest) = conductors[0]
        .call(
            &alice_transaction_requests,
            "create_transaction_request",
            transaction_request_input,
        )
        .await;

    consistency_10s(&[&alice, &bobbo]).await;

    let transaction_requests: BTreeMap<HeaderHashB64, TransactionRequest> = conductors[0]
        .call(
            &alice_transaction_requests,
            "get_my_transaction_requests",
            (),
        )
        .await;

    assert_eq!(transaction_requests.len(), 1);

    let transaction_requests: BTreeMap<HeaderHashB64, TransactionRequest> = conductors[1]
        .call(&bob_transaction_requests, "get_my_transaction_requests", ())
        .await;

    assert_eq!(transaction_requests.len(), 1);

    let _txn: (HeaderHashB64, Transaction) = conductors[1]
        .call(
            &bob_transaction_requests,
            "accept_transaction_request",
            transaction_request_hash,
        )
        .await;

    consistency_10s(&[&alice, &bobbo]).await;
    consistency_10s(&[&alice, &bobbo]).await;
    consistency_10s(&[&alice, &bobbo]).await;

    let transactions: BTreeMap<HeaderHashB64, Transaction> = conductors[0]
        .call(&alice_transactions, "query_my_transactions", ())
        .await;
    assert_eq!(transactions.len(), 1);
    assert_eq!(transactions.into_iter().next().unwrap().1.amount, 10.0);

    let transactions: BTreeMap<HeaderHashB64, Transaction> = conductors[1]
        .call(&bob_transactions, "query_my_transactions", ())
        .await;
    assert_eq!(transactions.len(), 1);
    assert_eq!(transactions.into_iter().next().unwrap().1.amount, 10.0);

    let transactions: BTreeMap<HeaderHashB64, Transaction> = conductors[0]
        .call(
            &alice_transactions,
            "get_transactions_for_agent",
            AgentPubKeyB64::from(bobbo.agent_pubkey().clone()),
        )
        .await;
    assert_eq!(transactions.len(), 1);

    let transactions: BTreeMap<HeaderHashB64, Transaction> = conductors[1]
        .call(
            &bob_transactions,
            "get_transactions_for_agent",
            AgentPubKeyB64::from(alice.agent_pubkey().clone()),
        )
        .await;
    assert_eq!(transactions.len(), 1);

    let transaction_requests: BTreeMap<HeaderHashB64, TransactionRequest> = conductors[0]
        .call(
            &alice_transaction_requests,
            "get_my_transaction_requests",
            (),
        )
        .await;

    assert_eq!(transaction_requests.len(), 1);

    let transaction_requests: BTreeMap<HeaderHashB64, TransactionRequest> = conductors[1]
        .call(&bob_transaction_requests, "get_my_transaction_requests", ())
        .await;

    assert_eq!(transaction_requests.len(), 1);
}
