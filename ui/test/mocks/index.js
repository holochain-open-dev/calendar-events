import ConductorApi from '@holochain/conductor-api';

import { AppWebsocketMock, DnaMock } from 'holochain-ui-test-utils';
import { CalendarEventsMock } from './calendar-events.mock';

const dnaMock = new DnaMock({
  calendar_events: new CalendarEventsMock(),
});
export async function getAppWebsocket() {
  let appWebsocket = new AppWebsocketMock([dnaMock]);
  if (process.env.CONDUCTOR_URL)
    appWebsocket = await ConductorApi.AppWebsocket.connect(
      process.env.CONDUCTOR_URL
    );

  const appInfo = await appWebsocket.appInfo({ installed_app_id: 'test-app' });

  const cellId = appInfo.cell_data[1][0];

  return {
    appWebsocket,
    cellId,
  };
}
