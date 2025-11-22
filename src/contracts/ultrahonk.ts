/**
 * Utilidades para interactuar con el contrato ultrahonk_zk en Soroban
 */

import { Client, networks } from '../../packages/ultrahonk_zk/dist/index.js'

/**
 * Configuración de red por defecto
 * Puedes cambiar esto según el ambiente (standalone, testnet, mainnet)
 */
const DEFAULT_NETWORK = networks.standalone

/**
 * Crea una instancia del cliente del contrato ultrahonk_zk
 * @param rpcUrl - URL del servidor RPC de Soroban
 * @param networkPassphrase - Passphrase de la red (opcional, usa standalone por defecto)
 * @param contractId - ID del contrato (opcional, usa el del network por defecto)
 * @returns Cliente del contrato configurado
 */
export function createUltrahonkClient(
  rpcUrl: string,
  networkPassphrase?: string,
  contractId?: string
) {
  return new Client({
    networkPassphrase: networkPassphrase || DEFAULT_NETWORK.networkPassphrase,
    contractId: contractId || DEFAULT_NETWORK.contractId,
    rpcUrl,
  })
}

/**
 * Establece la clave de verificación en el contrato
 * @param client - Cliente del contrato
 * @param vkJson - Buffer con el JSON de la clave de verificación
 * @returns Hash de la clave de verificación
 */
export async function setVerificationKey(
  client: Client,
  vkJson: Buffer
) {
  try {
    const tx = await client.set_vk({ vk_json: vkJson })
    // Aquí necesitarás firmar y enviar la transacción
    // const result = await tx.signAndSend()
    return tx
  } catch (error) {
    console.error('Error setting verification key:', error)
    throw error
  }
}

/**
 * Verifica si un proof_id fue previamente verificado
 * @param client - Cliente del contrato
 * @param proofId - Buffer con el ID de la prueba
 * @returns true si fue verificado, false en caso contrario
 */
export async function isVerified(
  client: Client,
  proofId: Buffer
): Promise<boolean> {
  try {
    const tx = await client.is_verified({ proof_id: proofId })
    return tx.result
  } catch (error) {
    console.error('Error checking if verified:', error)
    throw error
  }
}

/**
 * Verifica una prueba UltraHonk con la clave de verificación proporcionada
 * @param client - Cliente del contrato
 * @param vkJson - Buffer con el JSON de la clave de verificación
 * @param proofBlob - Buffer con la prueba a verificar
 * @returns ID de la prueba verificada
 */
export async function verifyProof(
  client: Client,
  vkJson: Buffer,
  proofBlob: Buffer
) {
  try {
    const tx = await client.verify_proof({
      vk_json: vkJson,
      proof_blob: proofBlob,
    })
    // Aquí necesitarás firmar y enviar la transacción
    // const result = await tx.signAndSend()
    return tx
  } catch (error) {
    console.error('Error verifying proof:', error)
    throw error
  }
}

/**
 * Verifica una prueba usando la clave de verificación almacenada en el contrato
 * @param client - Cliente del contrato
 * @param proofBlob - Buffer con la prueba a verificar
 * @returns ID de la prueba verificada
 */
export async function verifyProofWithStoredVk(
  client: Client,
  proofBlob: Buffer
) {
  try {
    const tx = await client.verify_proof_with_stored_vk({
      proof_blob: proofBlob,
    })
    // Aquí necesitarás firmar y enviar la transacción
    // const result = await tx.signAndSend()
    return tx
  } catch (error) {
    console.error('Error verifying proof with stored VK:', error)
    throw error
  }
}

/**
 * Ejemplo de uso:
 *
 * const client = createUltrahonkClient('http://localhost:8000/rpc')
 * const vkBuffer = Buffer.from(vkJsonString)
 * const proofBuffer = Buffer.from(proofData)
 *
 * const tx = await verifyProof(client, vkBuffer, proofBuffer)
 * // Firmar y enviar con el wallet del usuario
 */
