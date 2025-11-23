import * as Client from '../../packages/inzpektor_handler/dist/index.js';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CCL55D53F4CI6CUWKVJCQTD36LJUP37HBK2FXGIP5UMP3BMYWWQUPJAU',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
