use crate::utils;
use hdk3::prelude::timestamp::Timestamp;
use hdk3::prelude::*;

#[derive(Clone, SerializedBytes, Serialize, Deserialize)]
pub enum EventLocation {
    Resource(EntryHash),
    Custom(String),
}

#[hdk_entry(id = "calendar_event", visibility = "public")]
#[serde(rename_all = "camelCase")]
#[derive(Clone)]
pub struct CalendarEvent {
    pub created_by: AgentPubKey,
    pub title: String,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}

#[derive(Clone, Serialize, Deserialize, SerializedBytes)]
#[serde(rename_all = "camelCase")]
pub struct CreateCalendarEventInput {
    pub title: String,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub location: Option<EventLocation>,
    pub invitees: Vec<AgentPubKey>,
}
/**
 * Creates a new calendar event, linking from the creator and the invitees public key
 */
pub fn create_calendar_event(
    calendar_event_input: CreateCalendarEventInput,
) -> ExternResult<EntryHash> {
    let agent_info = agent_info!()?;

    let calendar_event = CalendarEvent {
        created_by: agent_info.agent_latest_pubkey.clone(),
        title: calendar_event_input.title,
        start_time: calendar_event_input.start_time,
        end_time: calendar_event_input.end_time,
        location: calendar_event_input.location,
        invitees: calendar_event_input.invitees,
    };

    create_entry!(calendar_event.clone())?;

    let calendar_event_hash = hash_entry!(calendar_event.clone())?;

    let path = my_calendar_events_path()?;

    path.ensure()?;

    create_link!(path.hash()?, calendar_event_hash.clone())?;

    for invitee in calendar_event.invitees {
        let invitee_path = calendar_events_path_for_agent(invitee);
        invitee_path.ensure()?;

        create_link!(invitee_path.hash()?, calendar_event_hash.clone())?;
    }

    Ok(calendar_event_hash)
}

/**
 * Returns the calendar in which the agent is the creator or is an invitee
 */
pub fn get_my_calendar_events() -> ExternResult<Vec<(EntryHash, CalendarEvent)>> {
    let path = my_calendar_events_path()?;

    let links = get_links!(path.hash()?)?;

    links
        .into_inner()
        .iter()
        .map(|link| utils::try_get_and_convert::<CalendarEvent>(link.target.clone()))
        .collect()
}

/** Private helpers **/
fn my_calendar_events_path() -> ExternResult<Path> {
    let agent_info = agent_info!()?;
    Ok(calendar_events_path_for_agent(
        agent_info.agent_latest_pubkey,
    ))
}

fn calendar_events_path_for_agent(public_key: AgentPubKey) -> Path {
    Path::from(format!("calendar_events.{:?}", public_key))
}
