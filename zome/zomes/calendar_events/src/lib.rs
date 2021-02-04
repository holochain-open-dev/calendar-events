use hdk3::prelude::*;

mod calendar_event;
mod utils;

use calendar_event::CalendarEventOutput;

pub fn error<T>(reason: &str) -> ExternResult<T> {
    Err(HdkError::Wasm(WasmError::Zome(String::from(reason))))
}

entry_defs![
    Path::entry_def(),
    calendar_event::CalendarEvent::entry_def()
];

/** Calendar events **/

#[hdk_extern]
pub fn create_calendar_event(
    calendar_event_input: calendar_event::CreateCalendarEventInput,
) -> ExternResult<CalendarEventOutput> {
    calendar_event::create_calendar_event(calendar_event_input)
}

#[hdk_extern]
pub fn get_my_calendar_events(_: ()) -> ExternResult<Vec<CalendarEventOutput>> {
    let calendar_events = calendar_event::get_my_calendar_events()?;

    Ok(GetMyCalendarEventsOutput(calendar_events))
}
