import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';

export default function ConnectWallet() {
  const { isConnected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      console.log('Wallet connected! Redirecting to home...');
      navigate('/home');
    }
  }, [isConnected, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="text-center p-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/images/buho1.png" alt="INZPEKTOR" className="w-20 h-20 object-contain" />
        </div>
        
        <h1 className="text-5xl font-bold mb-3 text-white font-space-grotesk">
          INZPEKTOR
        </h1>
        <p className="text-lg text-gray-400 mb-10">
          ZK Clean Hands Verification
        </p>

        <WalletConnect />

        <p className="mt-8 text-sm text-gray-500">
          Select your Stellar wallet to continue
        </p>
      </div>
    </div>
  );
}
