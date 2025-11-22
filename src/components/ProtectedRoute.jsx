import { Navigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function ProtectedRoute({ children }) {
  const { isConnected, publicKey } = useWallet();

  if (!isConnected || !publicKey) {
    return <Navigate to="/" replace />;
  }

  return children;
}
