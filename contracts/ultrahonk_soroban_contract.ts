import * as Client from 'ultrahonk_soroban_contract';
import { rpcUrl } from './util';

export default new Client.Client({
  networkPassphrase: 'Standalone Network ; February 2017',
  contractId: 'CDAJPESIFIQVP7WPKKJ4URAE2VOSME5THCFLS34BCJYZPT2BK24SYFU4',
  rpcUrl,
  allowHttp: true,
  publicKey: undefined,
});
