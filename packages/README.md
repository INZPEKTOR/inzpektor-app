# Inzpektor Contracts Packages

Esta carpeta contiene los paquetes TypeScript generados automáticamente para interactuar con los smart contracts de Soroban del proyecto Inzpektor.

## Estructura

```
packages/
├── ultrahonk_zk/        # Contrato de verificación de pruebas ZK UltraHonk
├── inzpektor_handler/   # Contrato coordinador principal
└── inzpektor_id_nft/    # Contrato NFT de identidad con expiración
```

## Paquetes

### ultrahonk_zk
Contrato para verificar pruebas zero-knowledge usando el sistema UltraHonk de Aztec.

**Métodos principales:**
- `set_vk`: Establece la clave de verificación
- `verify_proof`: Verifica una prueba ZK
- `verify_proof_with_stored_vk`: Verifica usando la VK almacenada
- `is_verified`: Verifica si una prueba fue validada previamente

### inzpektor_handler
Contrato coordinador que integra la verificación ZK con el minteo de NFTs de identidad.

**Métodos principales:**
- `initialize`: Inicializa el contrato
- `mint_inzpektor_id`: Mintea un NFT tras verificar la prueba
- `get_nft_owner`: Obtiene el propietario de un NFT
- `is_nft_expired`: Verifica si un NFT expiró
- `get_nft_metadata`: Obtiene metadatos del NFT

### inzpektor_id_nft
Contrato NFT que representa la identidad verificada del usuario con fecha de expiración.

**Métodos principales:**
- `mint`: Mintea un nuevo NFT con expiración
- `transfer`: Transfiere un NFT
- `is_expired`: Verifica si expiró
- `get_expiration`: Obtiene fecha de expiración
- Métodos estándar de NFT (approve, balance, owner_of, etc.)

## Compilación

Para compilar todos los paquetes:

```bash
npm run build:contracts
```

Para compilar paquetes individuales:

```bash
npm run build:ultrahonk   # Compila ultrahonk_zk
npm run build:handler     # Compila inzpektor_handler
npm run build:nft         # Compila inzpektor_id_nft
```

## Uso en el Frontend

Los paquetes están disponibles para importar en el código del frontend:

```javascript
import { Client as UltrahonkClient } from '../packages/ultrahonk_zk/dist/index.js'
import { Client as HandlerClient } from '../packages/inzpektor_handler/dist/index.js'
import { Client as NFTClient } from '../packages/inzpektor_id_nft/dist/index.js'
```

## Estructura de cada paquete

Cada paquete tiene la siguiente estructura:

```
package-name/
├── src/
│   └── index.ts       # Código fuente TypeScript
├── dist/
│   ├── index.js       # Código compilado
│   └── index.d.ts     # Definiciones de tipos
├── package.json       # Configuración del paquete
├── tsconfig.json      # Configuración de TypeScript
└── README.md          # Documentación del paquete
```

## Dependencias

Todos los paquetes dependen de:
- `@stellar/stellar-sdk@^14.1.1` - SDK de Stellar para Soroban
- `buffer@6.0.3` - Polyfill de Buffer para el navegador
- `typescript@^5.6.2` - Compilador TypeScript (devDependency)

## Notas

- Los archivos en `dist/` son generados automáticamente, no los edites manualmente
- Los archivos `src/index.ts` son generados por el CLI de Soroban
- Para regenerar los bindings, usa el comando `soroban contract bindings ts`
