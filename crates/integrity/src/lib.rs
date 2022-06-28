// use chrono::{serde::ts_milliseconds};
use hdk::prelude::*;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum EventLocation {
    Resource(EntryHash),
    Custom(String),
}

#[hdk_entry(id = "calendar_event", visibility = "public")]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct CalendarEvent {
    pub title: String,
    pub start_time: Timestamp,
    pub end_time: Timestamp,

    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}
