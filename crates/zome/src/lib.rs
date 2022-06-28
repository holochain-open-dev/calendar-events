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
pub fn get_all_calendar_events(_: ()) -> ExternResult<Vec<Element>> {
    let path = calendar_events_path();

    let links = get_links(path.path_entry_hash()?, None)?;

    let get_input: Vec<GetInput> = links
        .into_iter()
        .map(|link| GetInput::new(link.target.into(), GetOptions::default()))
        .collect();

    let maybe_elements = HDK.with(|hdk| hdk.borrow().get(get_input))?;

    let elements: Vec<Element> = maybe_elements.into_iter().filter_map(|el| el).collect();

    Ok(elements)
}

#[hdk_extern]
pub fn get_calendar_event(header_hash: HeaderHash) -> ExternResult<Option<Element>> {
    get(header_hash, GetOptions::default())
}

/** Private helpers **/

fn calendar_events_path() -> Path {
    Path::from(format!("calendar_events"))
}
