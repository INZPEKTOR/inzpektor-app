import * as Client from 'inzpektor_handler';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CBEH3DBKOXXNNOBOQRW2UJKSC2MFREHOUFUPA7ZM4WZTUHJJ6AMLBAMJ',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
