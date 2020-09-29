import { randomHash } from './utils';

export class AppWebsocketMock {
  constructor(dnaMock) {
    this.dnaMock = dnaMock;
  }

  async appInfo() {
    return {
      cell_data: [[[randomHash(), randomHash()], 'mock-nick']],
    };
  }

  async callZome({ cap, cell_id, zome_name, fn_name, payload, provenance }) {
    try {
      return this.dnaMock[fn_name](payload);
    } catch (e) {
      throw new Error(`Mock does not include function ${fn_name}`);
    }
  }
}
