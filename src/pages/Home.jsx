import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function Home() {
  const { publicKey, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkKYCStatus = async () => {
      if (!publicKey) {
        navigate('/');
        return;
      }

      try {
        console.log('🔍 Checking KYC status for wallet:', publicKey);
        const response = await fetch(`http://localhost:3000/api/kyc/${publicKey}`);
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 KYC data received:', data);
          
          if (data.kyc && data.kyc.kyc_process === true) {
            console.log('✅ KYC is completed! Redirecting to dashboard...');
            navigate('/dashboard');
          } else {
            console.log('❌ KYC not completed, showing KYC prompt');
            setLoading(false);
          }
        } else {
          console.log('⚠️ No KYC record found');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error checking KYC status:', error);
        setLoading(false);
      }
    };

    checkKYCStatus();
  }, [publicKey, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-black border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo + Title */}
          <div className="flex items-center flex-1">
            <div className="relative" style={{ width: '60px', height: '60px' }}>
              <img src="/images/buho1.png" alt="INZPEKTOR Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-xl font-semibold">INZPEKTOR</span>
          </div>
          
          {/* Right: Wallet Info + Disconnect */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-green-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-black text-sm"></i>
              </div>
              <span className="text-white hidden sm:inline">{publicKey}</span>
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center p-5" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="text-center p-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl max-w-2xl">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold mb-4 text-white font-space-grotesk">
            Complete KYC Verification
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            To access the dashboard and all functionalities, you need to complete the KYC process.
          </p>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl mb-8">
            <h2 className="text-neon-green font-semibold mb-4 text-xl">What you'll need:</h2>
            <div className="space-y-3 text-left">
              <p className="text-gray-400 flex items-center">
                <span className="mr-3">📄</span> Government-issued ID or Passport
              </p>
              <p className="text-gray-400 flex items-center">
                <span className="mr-3">📷</span> Camera access for facial verification
              </p>
              <p className="text-gray-400 flex items-center">
                <span className="mr-3">⏱️</span> Approximately 5 minutes
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/kyc')}
            className="px-12 py-4 text-lg bg-neon-green text-black font-bold rounded-lg hover:opacity-90 transition-opacity mb-4"
          >
            Start KYC Process
          </button>
        </div>
      </div>
    </div>
  );
}
