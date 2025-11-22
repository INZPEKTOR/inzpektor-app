import { useState, useEffect, useCallback } from 'react'
import { Client } from '../../packages/ultrahonk_zk/dist/index.js'
import {
  createUltrahonkClient,
  setVerificationKey,
  isVerified,
  verifyProof,
  verifyProofWithStoredVk,
} from '../contracts/ultrahonk'

interface UseUltrahonkOptions {
  rpcUrl: string
  networkPassphrase?: string
  contractId?: string
}

/**
 * Hook personalizado para interactuar con el contrato ultrahonk_zk
 * @param options - Opciones de configuración del cliente
 * @returns Objeto con el cliente y funciones utilitarias
 */
export function useUltrahonk({ rpcUrl, networkPassphrase, contractId }: UseUltrahonkOptions) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Inicializar el cliente al montar el componente
  useEffect(() => {
    try {
      const ultrahonkClient = createUltrahonkClient(rpcUrl, networkPassphrase, contractId)
      setClient(ultrahonkClient)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create client'))
    }
  }, [rpcUrl, networkPassphrase, contractId])

  // Wrapper para setVerificationKey
  const handleSetVk = useCallback(
    async (vkJson: Buffer) => {
      if (!client) throw new Error('Client not initialized')
      setLoading(true)
      setError(null)
      try {
        const result = await setVerificationKey(client, vkJson)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to set VK')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [client]
  )

  // Wrapper para isVerified
  const handleIsVerified = useCallback(
    async (proofId: Buffer): Promise<boolean> => {
      if (!client) throw new Error('Client not initialized')
      setLoading(true)
      setError(null)
      try {
        const result = await isVerified(client, proofId)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to check verification')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [client]
  )

  // Wrapper para verifyProof
  const handleVerifyProof = useCallback(
    async (vkJson: Buffer, proofBlob: Buffer) => {
      if (!client) throw new Error('Client not initialized')
      setLoading(true)
      setError(null)
      try {
        const result = await verifyProof(client, vkJson, proofBlob)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to verify proof')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [client]
  )

  // Wrapper para verifyProofWithStoredVk
  const handleVerifyProofWithStoredVk = useCallback(
    async (proofBlob: Buffer) => {
      if (!client) throw new Error('Client not initialized')
      setLoading(true)
      setError(null)
      try {
        const result = await verifyProofWithStoredVk(client, proofBlob)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to verify proof with stored VK')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [client]
  )

  return {
    client,
    loading,
    error,
    setVk: handleSetVk,
    checkIsVerified: handleIsVerified,
    verifyProof: handleVerifyProof,
    verifyProofWithStoredVk: handleVerifyProofWithStoredVk,
  }
}

/**
 * Ejemplo de uso en un componente:
 *
 * function MyComponent() {
 *   const { client, loading, error, verifyProof } = useUltrahonk({
 *     rpcUrl: 'http://localhost:8000/rpc'
 *   })
 *
 *   const handleVerify = async () => {
 *     const vkBuffer = Buffer.from(vkJsonString)
 *     const proofBuffer = Buffer.from(proofData)
 *
 *     try {
 *       const tx = await verifyProof(vkBuffer, proofBuffer)
 *       // Firmar y enviar con el wallet del usuario
 *     } catch (error) {
 *       console.error('Error:', error)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={handleVerify} disabled={loading}>
 *       {loading ? 'Verificando...' : 'Verificar Prueba'}
 *     </button>
 *   )
 * }
 */
