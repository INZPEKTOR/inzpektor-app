/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_STELLAR_NETWORK?: string;
  readonly PUBLIC_STELLAR_NETWORK_PASSPHRASE?: string;
  readonly PUBLIC_STELLAR_RPC_URL?: string;
  readonly PUBLIC_STELLAR_HORIZON_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
