# ultrahonk_zk

Librería JS para interactuar con el smart contract `ultrahonk_zk` en Soroban.

## Instalación

Este paquete está incluido en el monorepo de inzpektor-app. Para compilarlo:

```bash
cd packages/ultrahonk_zk
npm run build
```

## Uso

```javascript
import { Client, networks } from './packages/ultrahonk_zk/dist/index.js'

const contract = new Client({
  ...networks.standalone,
  rpcUrl: 'http://localhost:8000/rpc',
})

// Usar los métodos del contrato
const result = await contract.verify_proof({
  vk_json: vkBuffer,
  proof_blob: proofBuffer
})
```

## Métodos disponibles

- `set_vk`: Establece la clave de verificación JSON
- `is_verified`: Verifica si un proof_id fue previamente verificado
- `verify_proof`: Verifica una prueba UltraHonk
- `verify_proof_with_stored_vk`: Verifica usando la VK almacenada en chain

## Compilación

El paquete se compila automáticamente con TypeScript:

```bash
npm run build
```

Esto genera los archivos en `dist/`:
- `index.js` - Código JavaScript compilado
- `index.d.ts` - Definiciones de tipos TypeScript
