// use chrono::{serde::ts_milliseconds};
use hdi::prelude::*;



#[hdk_entry_defs]
#[unit_enum(UnitEntryTypes)]
pub enum EntryTypes {
	CalendarEvent(CalendarEvent),
}

#[hdk_link_types]
pub enum LinkTypes {
    CalendarEventsPath,
    PathToCalendarEvent,
}


#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum EventLocation {
    Resource(EntryHash),
    Custom(String),
}

#[hdk_entry_helper]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct CalendarEvent {
    pub title: String,
    pub start_time: Timestamp,
    pub end_time: Timestamp,

    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}
