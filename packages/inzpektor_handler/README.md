# inzpektor_handler

Librería JS para interactuar con el smart contract `inzpektor_handler` en Soroban.

## Descripción

Este contrato actúa como el manejador principal que coordina la verificación de pruebas ZK y el minteo de NFTs de identidad.

## Instalación

Este paquete está incluido en el monorepo de inzpektor-app. Para compilarlo:

```bash
cd packages/inzpektor_handler
npm run build
```

## Uso

```javascript
import { Client, networks } from './packages/inzpektor_handler/dist/index.js'

const contract = new Client({
  ...networks.standalone,
  rpcUrl: 'http://localhost:8000/rpc',
})

// Usar los métodos del contrato
const tokenId = await contract.mint_inzpektor_id({
  user: userAddress,
  expires_at: expirationTimestamp,
  vk_json: vkBuffer,
  proof_blob: proofBuffer
})
```

## Métodos principales

- `initialize`: Inicializa el contrato con admin y contratos relacionados
- `mint_inzpektor_id`: Mintea un NFT de identidad después de verificar la prueba
- `get_nft_owner`: Obtiene el propietario de un NFT
- `is_nft_expired`: Verifica si un NFT ha expirado
- `get_nft_balance`: Obtiene el balance de NFTs de un usuario
- `get_nft_metadata`: Obtiene los metadatos del NFT
- `get_nft_expiration`: Obtiene la fecha de expiración de un NFT
- `get_verifier_contract`: Obtiene la dirección del contrato verificador

## Compilación

```bash
npm run build
```

Esto genera los archivos en `dist/`:
- `index.js` - Código JavaScript compilado
- `index.d.ts` - Definiciones de tipos TypeScript
