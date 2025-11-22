import * as Client from 'inzpektor_id_nft';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CASPMLQS2X5CMDAFSAKJCBP3HTPEM73W4QCARBFSU4A6RGSIE46SGSCL',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
