import * as Client from '../../packages/inzpektor_handler';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CCTF5O6EDDWDZKBGXWNNBMJF5UVCF4PHMRZ6LSBUTE746TLTPLM5J5VJ',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
