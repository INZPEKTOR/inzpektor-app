import * as Client from 'ultrahonk_zk';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CCQJGX5U6TIW5I2W6AXT53JENLCTO7YERYABTUSI46U3CXLBQFUFRDZ7',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
