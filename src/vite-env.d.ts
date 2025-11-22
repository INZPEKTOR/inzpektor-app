/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Stellar Configuration
  readonly PUBLIC_INZPEKTOR_STELLAR_SECRET_KEY: string
  readonly PUBLIC_INZPEKTOR_HANDLER_CONTRACT_ID: string
  readonly PUBLIC_ULTRAHONK_ZK_CONTRACT_ID: string
  readonly PUBLIC_INZPEKTOR_ID_NFT_CONTRACT_ID: string
  readonly PUBLIC_STELLAR_NETWORK: string
  readonly PUBLIC_STELLAR_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
