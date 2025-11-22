# inzpektor_id_nft

Librería JS para interactuar con el smart contract `inzpektor_id_nft` en Soroban.

## Descripción

Este contrato implementa un NFT con expiración que representa la identidad verificada del usuario.

## Instalación

Este paquete está incluido en el monorepo de inzpektor-app. Para compilarlo:

```bash
cd packages/inzpektor_id_nft
npm run build
```

## Uso

```javascript
import { Client, networks } from './packages/inzpektor_id_nft/dist/index.js'

const contract = new Client({
  ...networks.standalone,
  rpcUrl: 'http://localhost:8000/rpc',
})

// Usar los métodos del contrato
const tokenId = await contract.mint({
  to: userAddress,
  expires_at: expirationTimestamp
})
```

## Métodos principales

### Métodos NFT estándar
- `mint`: Mintea un nuevo NFT con expiración
- `transfer`: Transfiere un NFT a otro usuario
- `transfer_from`: Transfiere un NFT desde una dirección específica
- `approve`: Aprueba a otro usuario para transferir un NFT específico
- `approve_for_all`: Aprueba a un operador para todos los NFTs
- `balance`: Obtiene el balance de NFTs de una cuenta
- `owner_of`: Obtiene el propietario de un NFT
- `name`: Obtiene el nombre de la colección
- `symbol`: Obtiene el símbolo de la colección
- `token_uri`: Obtiene el URI de un token específico

### Métodos de expiración
- `is_expired`: Verifica si un token ha expirado
- `get_expiration`: Obtiene la fecha de expiración de un token

### Métodos de enumeración
- `total_supply`: Obtiene el total de NFTs minteados
- `get_token_id`: Obtiene un token ID por índice
- `get_owner_token_id`: Obtiene un token ID de un propietario por índice

### Inicialización
- `initialize`: Inicializa el contrato con un propietario

## Compilación

```bash
npm run build
```

Esto genera los archivos en `dist/`:
- `index.js` - Código JavaScript compilado
- `index.d.ts` - Definiciones de tipos TypeScript
