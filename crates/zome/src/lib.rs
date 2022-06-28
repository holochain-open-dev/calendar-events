use std::collections::BTreeMap;

use hdk::prelude::*;

use hc_zome_calendar_events_integrity::{self, CalendarEvent};

entry_defs![PathEntry::entry_def(), CalendarEvent::entry_def()];

/** Calendar events **/

#[hdk_extern]
pub fn create_calendar_event(calendar_event: CalendarEvent) -> ExternResult<HeaderHash> {
    let header_hash = create_entry(&calendar_event)?;

    let path = calendar_events_path();

    path.ensure()?;

    create_link(
        path.path_entry_hash()?,
        header_hash.clone(),
        HdkLinkType::Any,
        (),
    )?;

    Ok(header_hash)
}

#[hdk_extern]
pub fn get_all_calendar_events(_: ()) -> ExternResult<BTreeMap<HeaderHash, CalendarEvent>> {
    let path = calendar_events_path();

    let links = get_links(path.path_entry_hash()?, None)?;

    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(link.target.into(), GetOptions::default()))
        .collect();

    let maybe_elements = HDK.with(|hdk| hdk.borrow().get(get_input))?;

    let mut all_calendar_events: BTreeMap<HeaderHash, CalendarEvent> = BTreeMap::new();

    for maybe_el in maybe_elements {
        if let Some(el) = maybe_el {
            let calendar_event: CalendarEvent = el
                .entry()
                .to_app_option()?
                .ok_or(WasmError::Guest("Could not get calendar event".into()))?;

            all_calendar_events.insert(el.header_address().clone(), calendar_event);
        }
    }

    Ok(all_calendar_events)
}

/** Private helpers **/

fn calendar_events_path() -> Path {
    Path::from(format!("calendar_events"))
}
