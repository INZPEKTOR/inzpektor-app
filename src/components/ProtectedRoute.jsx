import { Navigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function ProtectedRoute({ children }) {
  const { isConnected, publicKey, initialized } = useWallet();

  // Wait for wallet context to initialize before checking auth
  if (!initialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isConnected || !publicKey) {
    return <Navigate to="/" replace />;
  }

  return children;
}
