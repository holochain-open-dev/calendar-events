use chrono::{serde::ts_milliseconds, DateTime, Utc};
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

    #[serde(with = "ts_milliseconds")]
    pub start_time: DateTime<Utc>,
    #[serde(with = "ts_milliseconds")]
    pub end_time: DateTime<Utc>,

    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}
