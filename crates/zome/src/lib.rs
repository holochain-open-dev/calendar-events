use hdk::prelude::*;

use hc_zome_calendar_events_integrity;

entry_defs![
    PathEntry::entry_def(),
    calendar_event::CalendarEvent::entry_def()
];

/** Calendar events **/

#[hdk_extern]
pub fn create_calendar_event(
    calendar_event: CalendarEvent,
) -> ExternResult<HeaderHashB64> {
    let agent_info = agent_info()?;

    let header_hash = create_entry(&calendar_event)?;

    let path = calendar_events_path();

    path.ensure()?;

    create_link(path.path_entry_hash()?, header_hash.clone(), HdkLinkType::Any, ())?;

    Ok(header_hash)
}

#[hdk_extern]
pub fn get_my_calendar_events(_: ()) -> ExternResult<Vec<CalendarEventOutput>> {
    let path = calendar_events_path();

    let links = get_links(path.path_entry_hash()?, None)?;

    let events = links
        .iter()
        .map(|link| {
            let element = get(link.target.clone(), GetOptions::default())?
                .ok_or(err("Could not get calendar event"))?;

            let calendar_event: CalendarEvent = element
                .entry()
                .to_app_option()?
                .ok_or(err("Could not get calendar event"))?;

            Ok(CalendarEventOutput {
                entry_hash: link.target.clone().into(),
                entry: calendar_event,
            })
        })
        .collect::<ExternResult<Vec<CalendarEventOutput>>>()?;

    Ok(events)
}

#[hdk_extern]
pub fn get_calendar_event(calendar_event_hash: EntryHashB64) -> ExternResult<CalendarEvent> {
    let element = get(EntryHash::from(calendar_event_hash), GetOptions::default())?
        .ok_or(err("Could not get calendar event"))?;

    let calendar_event: CalendarEvent = element
        .entry()
        .to_app_option()?
        .ok_or(err("Could not get calendar event"))?;

    Ok(calendar_event)
}

/** Private helpers **/

fn calendar_events_path() -> Path {
    Path::from(format!("calendar_events"))
}
