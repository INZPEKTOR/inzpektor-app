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
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 grid-pattern opacity-10"></div>
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-float"></div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ripple">
              <div className="w-32 h-32 rounded-full border-2 border-neon-green opacity-30"></div>
            </div>
            <div className="absolute inset-0 animate-ripple" style={{ animationDelay: '0.5s' }}>
              <div className="w-32 h-32 rounded-full border-2 border-neon-green opacity-30"></div>
            </div>
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-neon-green/20 to-transparent rounded-full flex items-center justify-center border-2 border-neon-green animate-float">
              <i className="fas fa-shield-halved text-5xl text-neon-green animate-pulse"></i>
            </div>
          </div>
          <p className="text-gray-400 text-lg animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 grid-pattern opacity-10 pointer-events-none"></div>
      <div className="hidden sm:block fixed top-0 right-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="hidden sm:block fixed bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Top Navbar */}
      <nav className="relative z-20 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo + Title */}
          <div className="flex items-center flex-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-neon-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <img src="/images/buho1.png" alt="INZPEKTOR Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="text-white text-lg sm:text-xl font-bold ml-3 font-space-grotesk">INZPEKTOR</span>
          </div>
          
          {/* Right: Wallet Info + Disconnect */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end">
            <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-2 hover:border-neon-green/50 transition-all duration-300 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-neon-green to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-user text-black text-xs sm:text-sm"></i>
              </div>
              <span className="text-white text-xs sm:text-sm hidden md:inline font-mono max-w-[150px] truncate">{publicKey}</span>
              <i className="fas fa-chevron-down text-gray-400 text-xs hidden sm:inline"></i>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="px-3 sm:px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl font-semibold text-xs sm:text-sm hover:bg-gray-700 hover:border-neon-green transition-all duration-300"
            >
              <span className="hidden sm:inline">Disconnect</span>
              <i className="fas fa-sign-out-alt sm:hidden"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center p-3 sm:p-6" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="w-full max-w-4xl">
          {/* Main Card */}
          <div className="relative text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden group animate-slideInUp">
            {/* Decorative elements */}
            <div className="absolute inset-0 grid-pattern opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              {/* Icon with animation */}
              <div className="relative mb-4 sm:mb-5">
                <div className="absolute inset-0 animate-ripple">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-neon-green opacity-20 mx-auto"></div>
                </div>
                <div className="absolute inset-0 animate-ripple" style={{ animationDelay: '0.5s' }}>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-neon-green opacity-20 mx-auto"></div>
                </div>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-neon-green/20 blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center border-4 border-neon-green shadow-lg animate-float">
                    <i className="fas fa-shield-check text-4xl sm:text-5xl text-neon-green"></i>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-green to-white font-space-grotesk animate-slideInUp px-4">
                Identity Verification Required
              </h1>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-neon-green to-emerald-400 mx-auto mb-3 sm:mb-4 rounded-full"></div>
              
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-5 sm:mb-6 max-w-2xl mx-auto px-4 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                Complete the KYC process to unlock full platform access and verify your clean hands status
              </p>

              {/* Requirements Card */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 relative overflow-hidden group/card animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/20 rounded-full flex items-center justify-center mr-2">
                      <i className="fas fa-clipboard-list text-neon-green text-sm sm:text-base"></i>
                    </div>
                    <h2 className="text-neon-green font-bold text-lg sm:text-xl">Requirements</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-neon-green/50 transition-all duration-300 group/item">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-neon-green/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-2 group-hover/item:scale-110 transition-transform">
                        <i className="fas fa-id-card text-xl sm:text-2xl text-neon-green"></i>
                      </div>
                      <h3 className="text-white font-semibold mb-1 text-xs sm:text-sm">Government ID</h3>
                      <p className="text-gray-400 text-xs">Valid ID card or passport</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-neon-green/50 transition-all duration-300 group/item">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-neon-green/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-2 group-hover/item:scale-110 transition-transform">
                        <i className="fas fa-video text-xl sm:text-2xl text-neon-green"></i>
                      </div>
                      <h3 className="text-white font-semibold mb-1 text-xs sm:text-sm">Camera Access</h3>
                      <p className="text-gray-400 text-xs">For biometric verification</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-neon-green/50 transition-all duration-300 group/item">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-neon-green/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-2 group-hover/item:scale-110 transition-transform">
                        <i className="fas fa-clock text-xl sm:text-2xl text-neon-green"></i>
                      </div>
                      <h3 className="text-white font-semibold mb-1 text-xs sm:text-sm">5 Minutes</h3>
                      <p className="text-gray-400 text-xs">Quick verification process</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5 px-4 max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center space-x-1.5 sm:space-x-2 p-2 sm:p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-neon-green/30 transition-all">
                  <i className="fas fa-shield-halved text-neon-green text-sm sm:text-base"></i>
                  <span className="text-gray-300 text-xs font-medium">Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2 p-2 sm:p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-neon-green/30 transition-all">
                  <i className="fas fa-lock text-neon-green text-sm sm:text-base"></i>
                  <span className="text-gray-300 text-xs font-medium">Encrypted Data</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2 p-2 sm:p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-neon-green/30 transition-all">
                  <i className="fas fa-user-shield text-neon-green text-sm sm:text-base"></i>
                  <span className="text-gray-300 text-xs font-medium">Privacy Protected</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2 p-2 sm:p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-neon-green/30 transition-all">
                  <i className="fas fa-check-double text-neon-green text-sm sm:text-base"></i>
                  <span className="text-gray-300 text-xs font-medium">GDPR Compliant</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate('/kyc')}
                className="relative px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-neon-green to-emerald-400 text-black font-bold rounded-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group/btn animate-scaleIn mb-3"
                style={{ animationDelay: '0.4s' }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Begin Verification Process
                  <i className="fas fa-arrow-right ml-2 group-hover/btn:translate-x-2 transition-transform duration-300"></i>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute inset-0 animate-glow"></div>
              </button>

              <p className="text-gray-500 text-xs">
                <i className="fas fa-info-circle mr-1"></i>
                Your data is encrypted and never shared with third parties
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
