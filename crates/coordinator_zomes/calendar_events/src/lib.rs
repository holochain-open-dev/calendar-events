use hdk::{prelude::*, hash_path::path::TypedPath};

// use calendar_events_integrity::{self, LinkTypes, EntryTypes, CalendarEvent};
use calendar_events_integrity::*;

/** Calendar events **/

#[hdk_extern]
pub fn create_calendar_event(calendar_event: CalendarEvent) -> ExternResult<ActionHash> {

  let path = calendar_events_path()?;
  path.ensure()?;

  let action_hash = create_entry(EntryTypes::CalendarEvent(calendar_event))?;

  create_link(
    path.path_entry_hash()?,
    action_hash.clone(),
    LinkTypes::PathToCalendarEvent,
    (),
  )?;

  Ok(action_hash)
}

#[hdk_extern]
pub fn get_all_calendar_events(_: ()) -> ExternResult<Vec<Record>> {
  let path = calendar_events_path()?;

  let links = get_links(path.path_entry_hash()?,LinkTypes::PathToCalendarEvent, None)?;

  let get_input: Vec<GetInput> = links
      .into_iter()
      .map(|link| GetInput::new(ActionHash::from(link.target).into(), GetOptions::default()))
      .collect();

  let maybe_records = HDK.with(|hdk| hdk.borrow().get(get_input))?;

  let records: Vec<Record> = maybe_records.into_iter().filter_map(|rec| rec).collect();

  Ok(records)
}

#[hdk_extern]
pub fn get_calendar_event(action_hash: ActionHash) -> ExternResult<Option<Record>> {
  get(action_hash, GetOptions::default())
}

/** Private helpers **/

fn calendar_events_path() -> ExternResult<TypedPath> {

  let links = zome_info()?.zome_types.links;
  debug!("LINKS: {:?}", links);
  Path::from(format!("calendar_events"))
    .typed(LinkTypes::CalendarEventsPath)
}
