import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import FloatingCharsBackground from '../components/FloatingCharsBackground';
import EmailVerification from '../components/EmailVerification';
import { pointsService } from '../services/pointsService';

export default function Dashboard() {
  const { isConnected, publicKey, disconnectWallet } = useWallet();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user verification data on mount - create if doesn't exist
  useEffect(() => {
    if (!publicKey) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Try to fetch from backend API first
        const response = await fetch(`http://localhost:3000/api/verifications/${publicKey}`);

        if (response.ok) {
          const result = await response.json();
          setVerificationData(result.verification);
          setTotalPoints(result.total_points);
          setEmailVerified(result.email_verified);
          setError(null);
        } else if (response.status === 404) {
          // No existe, usar Supabase para crear
          let data = await pointsService.getByWallet(publicKey);
          if (!data) {
            data = await pointsService.getOrCreateByWallet(publicKey);
          }
          if (data) {
            setVerificationData(data);
            setTotalPoints(data.total_points);
            setEmailVerified(data.email_verified || false);
          }
          setError(null);
        } else {
          // Fallback a Supabase si el backend falla
          let data = await pointsService.getByWallet(publicKey);
          if (!data) {
            data = await pointsService.getOrCreateByWallet(publicKey);
          }
          if (data) {
            setVerificationData(data);
            setTotalPoints(data.total_points);
            setEmailVerified(data.email_verified || false);
          }
          setError(null);
        }
      } catch (err) {
        console.error('❌ Error:', err);
        // Fallback a Supabase si hay error de red
        try {
          let data = await pointsService.getByWallet(publicKey);
          if (!data) {
            data = await pointsService.getOrCreateByWallet(publicKey);
          }
          if (data) {
            setVerificationData(data);
            setTotalPoints(data.total_points);
            setEmailVerified(data.email_verified || false);
          }
          setError(null);
        } catch (supabaseErr) {
          setError(supabaseErr.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for points updates from email verification
    const handlePointsUpdate = (event) => {
      const { total_points, email_verified } = event.detail;
      setTotalPoints(total_points);
      setEmailVerified(email_verified);
    };

    window.addEventListener('pointsUpdated', handlePointsUpdate);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, [publicKey]);

  const userData = {
    username: "emmilili.xlm",
    points: 100,
    digitalProofs: [
      {
        title: "Email",
        subtitle: "Verify with your email address",
        status: "verify",
        points: 30,
        icon: "identity"
      },
      {
        title: "Facebook",
        subtitle: "Verify your Facebook account",
        status: "verify",
        points: 30,
        icon: "facebook"
      },
    ],
    physicalProofs: [
      {
        title: "Biometrics",
        subtitle: "Liveness and uniqueness verification.",
        status: "verify",
        points: 30,
        icon: "biometrics"
      },
      {
        title: "Phone Verification",
        subtitle: "Verify with your phone number.",
        status: "verify",
        points: 30,
        icon: "phone"
      },
    ],
    defiProofs: [
      {
        title: "Franklin Templeton",
        subtitle: "Invest through Benji in an ETF from 10 USDC.",
        status: "verify",
        points: 350,
        icon: "franklin"
      },
      {
        title: "Soroswap",
        subtitle: "Swap XLM to USDC from 140 XLM.",
        status: "verify",
        points: 350,
        icon: "soroswap"
      },
    ],
    inspektorScore: {
      status: "PROOF OF CLEAN HANDS VERIFIED",
      version: "v1.0",
      mintedDate: "2025.11.21"
    }
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#020923' }}>
      {/* Animated Background */}
      <FloatingCharsBackground />

      {/* Top Navbar */}
      <nav className="relative z-10 px-4 py-3 border-b border-gray-800 sm:px-6 md:px-8 md:py-4" style={{ backgroundColor: '#020923' }}>
        <div className="flex items-center justify-between gap-2 mx-auto sm:gap-3 max-w-7xl">
          {/* Left: Logo + Title */}
          <div className="flex items-center flex-shrink-0">
            <div className="relative" style={{ width: '40px', height: '40px' }}>
              <img src="/images/buho1.png" alt="INZPEKTOR Logo" className="object-contain w-full h-full" />
            </div>
            <span className="ml-2 text-base font-semibold text-white sm:text-lg md:text-xl">INZPEKTOR</span>
          </div>

          {/* Right: Wallet + Points + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Connected Wallet Display */}
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg sm:px-4 sm:py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white sm:text-sm">
                  {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                </span>
              </div>
            )}

            {/* Wallet Connect Button (only show when not connected) */}
            {!isConnected && <WalletConnect />}

            {/* Disconnect Button (only show when connected) */}
            {isConnected && (
              <button
                onClick={disconnectWallet}
                className="px-2 py-1.5 text-xs font-semibold text-white transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 sm:px-3 sm:py-2 sm:text-sm"
              >
                Disconnect
              </button>
            )}

            {/* Points */}
            <div className="flex items-center space-x-2">
              {error ? (
                <span className="text-sm text-red-500">Error loading points</span>
              ) : loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                <div className="flex items-center space-x-2 text-neon-green">
                  <i className="fas fa-check-circle"></i>
                  <span className="font-semibold">{totalPoints}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container relative z-10 px-8 py-12 mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="px-4 py-3 mb-6 text-red-200 bg-red-900 border border-red-500 rounded-lg">
            <strong>Error:</strong> {error}
            <p className="mt-1 text-sm">Make sure you've created the Supabase table. Check browser console for details.</p>
          </div>
        )}

        {/* Title Section */}
        <div className="max-w-4xl mx-auto mb-8 text-center md:mb-12">
          <h1 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl font-manrope" style={{ letterSpacing: '0.05em' }}>
            You're Clean Hands, now let's build your on-chain reputation!
          </h1>
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-400 sm:text-base md:text-lg" style={{ letterSpacing: '0.02em' }}>
            Now boost your on-chain reputation, connect and verify with these methods to score more points.
          </p>
        </div>

        {/* Cards Side by Side */}
        <div className="px-0 mx-auto mb-8 max-w-7xl sm:px-4 md:mb-16">
          <div className="flex flex-col items-stretch gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:gap-8">
        {/* InZpektor Score Card */}
            <div className="flex justify-center flex-1">
          <div
                className="relative w-full p-4 overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl sm:p-5 hover:-translate-y-2 md:hover:-translate-y-3"
            style={{
                  maxWidth: '100%',
                  minHeight: '300px',
                  height: 'auto',
                  background: 'linear-gradient(135deg, #3a4a5c 0%, #2a3542 25%, #1a2330 50%, #2a3542 75%, #3a4a5c 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.7), 0 10px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                }}
              >
                {/* Metallic shine effect */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                    mixBlendMode: 'overlay'
                  }}
                ></div>
            {/* Fingerprint Icon */}
            <div className="absolute z-20 top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 md:w-12 md:h-12 bg-neon-green bg-opacity-20">
                    <i className="text-sm fas fa-fingerprint text-neon-green sm:text-base md:text-lg"></i>
              </div>
            </div>

            <div className="relative z-10 flex flex-col min-h-[250px] sm:min-h-[300px] md:min-h-[350px]">
              {/* Top Section */}
                  <div className="flex items-start justify-between px-1 mb-3 sm:px-2 sm:mb-4">
                <div>
                  <h2 className="mb-1 text-xs font-bold tracking-wider text-white uppercase sm:text-sm font-manrope">
                    INZPEKTOR ID
                  </h2>
                  <p className="text-xs text-neon-green opacity-90">{userData.inspektorScore.version}</p>
                </div>
              </div>

              {/* Center Section */}
              <div className="flex items-center justify-center flex-1 px-2 my-3 sm:px-4 sm:my-4">
                    <h3 className="w-full text-base font-bold leading-tight tracking-wide text-center uppercase text-neon-green sm:text-lg md:text-xl lg:text-2xl font-space-grotesk">
                  {userData.inspektorScore.status}
                </h3>
              </div>

              {/* Bottom Section */}
                  <div className="flex flex-wrap items-end justify-between gap-2 px-1 mt-auto sm:gap-4 sm:px-2">
                    <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[60%] sm:max-w-[45%]">
                  {isConnected ? publicKey : userData.username}
                </span>
                <div className="text-right">
                  <span className="block mb-1 text-xs tracking-wide uppercase text-neon-green">MINTED</span>
                      <p className="text-xs font-medium text-white sm:text-sm">{userData.inspektorScore.mintedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Points & DeFi Yield Boost Section */}
            <div className="flex justify-center flex-1">
              <div className="w-full p-4 border border-gray-800 shadow-xl rounded-2xl sm:p-5 md:p-6" style={{ minHeight: '300px', height: 'auto', backgroundColor: '#0a1120' }}>
                {/* Title */}
                <h2 className="mb-2 text-lg font-bold sm:text-xl md:text-2xl text-neon-green font-manrope" style={{ letterSpacing: '0.03em' }}>
                  My Points & DeFi Yield Boost
                </h2>
                <p className="mb-3 text-xs leading-relaxed text-gray-400 sm:mb-4 sm:text-sm" style={{ letterSpacing: '0.02em' }}>
                  Accumulate points by completing tasks and verifying credentials. More points unlock higher DeFi yields, boosting your earnings potential.
                </p>

                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Current Points */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-neon-green">
                      <i className="text-base text-white fas fa-star sm:text-lg md:text-xl"></i>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-gray-400" style={{ letterSpacing: '0.02em' }}>Current Points</p>
                      <p className="text-2xl font-bold text-white sm:text-3xl" style={{ letterSpacing: '0.05em' }}>
                        {totalPoints.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Yield Slider */}
                  <div className="flex flex-col justify-end flex-1 w-full mt-2 sm:mt-4">
                    {/* Yield Levels */}
                    <div className="relative">
                      {/* Yield Indicator */}
                      <div
                        className="absolute z-10 flex flex-col items-center mb-1 transition-all duration-500 transform -translate-x-1/2 bottom-full"
                        style={{
                          left: `${(() => {
                            const points = totalPoints;
                            if (points >= 550) return 100;
                            if (points >= 320) return (320 / 550) * 100;
                            if (points >= 200) return (200 / 550) * 100;
                            if (points >= 100) return (100 / 550) * 100;
                            return (points / 550) * 100;
                          })()}%`
                        }}
                      >
                        <p className="text-base font-bold sm:text-lg text-neon-green">
                          {(() => {
                            const points = totalPoints;
                            if (points >= 550) return '8%';
                            if (points >= 320) return '6.5%';
                            if (points >= 200) return '5.5%';
                            return '';
                          })()}
                        </p>
                      </div>

                      <div className="flex items-end justify-between pt-8 mb-2 sm:pt-12">
                        <div className="text-center">
                          <p className="text-gray-500 text-[9px] sm:text-[10px]">0</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs font-semibold text-neon-green">4.25%</p>
                          <p className="text-gray-500 text-[9px] sm:text-[10px]">100</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs font-semibold text-neon-green">5.5%</p>
                          <p className="text-gray-500 text-[9px] sm:text-[10px]">200</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs font-semibold text-neon-green">6.5%</p>
                          <p className="text-gray-500 text-[9px] sm:text-[10px]">320</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-0.5 sm:mb-1 text-[10px] sm:text-xs font-semibold text-neon-green">8%</p>
                          <p className="text-gray-500 text-[9px] sm:text-[10px]">550</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-2.5 sm:h-3 overflow-visible bg-gray-800 rounded-full">
                        <div
                          className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-neon-green to-emerald-400"
                          style={{
                            width: `${(() => {
                              const points = totalPoints;
                              if (points >= 550) return 100;
                              if (points >= 320) return (320 / 550) * 100;
                              if (points >= 200) return (200 / 550) * 100;
                              if (points >= 100) return (100 / 550) * 100;
                              return (points / 550) * 100;
                            })()}%`
                          }}
                        ></div>

                        {/* Slider Handle */}
                        <div
                          className="absolute z-20 flex items-center justify-center w-4 h-4 transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-lg sm:w-5 sm:h-5 top-1/2 bg-neon-green"
                          style={{
                            left: `${(() => {
                              const points = totalPoints;
                              if (points >= 550) return 100;
                              if (points >= 320) return (320 / 550) * 100;
                              if (points >= 200) return (200 / 550) * 100;
                              if (points >= 100) return (100 / 550) * 100;
                              return (points / 550) * 100;
                            })()}%`
                          }}
                        >
                          <div className="w-1 h-1 bg-white rounded-full sm:w-1.5 sm:h-1.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Sections */}
        <div className="mx-auto space-y-8 max-w-7xl sm:space-y-10 md:space-y-12">
          {/* Proof of Digital Presence */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of Digital Presence</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400 sm:mb-6 sm:text-base md:text-lg" style={{ letterSpacing: '0.02em' }}>
              As the saying goes, if you have nothing to hide, you have nothing to fear! Connect a social media platform,
              it's optional, but it boosts your score and strengthens your Clean Hands credibility.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
              {userData.digitalProofs.map((proof, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 border border-gray-800 sm:p-5 rounded-xl card-hover"
                  style={{
                    width: '100%',
                    minHeight: '220px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-14 sm:h-14 md:w-16 md:h-16 sm:mb-4">
                    {proof.icon === 'identity' && (
                      <i className="text-4xl sm:text-5xl fas fa-shield-halved text-neon-green"></i>
                    )}
                    {proof.icon === 'facebook' && (
                      <i className="text-4xl sm:text-5xl fas fa-lock text-neon-green"></i>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 w-full">
                    <h3 className="w-full mb-2 text-sm font-semibold text-center text-white sm:text-base" style={{ lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="flex-1 w-full px-2 mb-3 text-xs text-center text-gray-400 sm:mb-4" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center w-full mt-auto mb-3">
                      {proof.icon === 'identity' ? (
                        emailVerified ? (
                          <button className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-black rounded-lg cursor-default bg-neon-green">
                            <i className="fas fa-check"></i>
                            Verified
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsEmailModalOpen(true)}
                            className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                          >
                            Verify
                          </button>
                        )
                      ) : (
                        <button className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                          Verify
                        </button>
                      )}
                    </div>

                    {/* Yield Button */}
                    <div className="w-full text-center">
                      {proof.icon === 'identity' && emailVerified ? (
                        <span className="text-sm font-semibold text-neon-green">
                          +{proof.points} POINTS EARNED
                        </span>
                      ) : (
                        <button className="text-sm font-semibold transition-opacity cursor-pointer text-neon-green hover:opacity-80" style={{ letterSpacing: '0.05em' }}>
                          +3% yield
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of Physical Verification */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of Physical Verification</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400 sm:mb-6 sm:text-base md:text-lg" style={{ letterSpacing: '0.02em' }}>
              Physical verification ensures the presence of a real, unique individual behind each identity,
              strengthening trust, reducing fraud risk, and aligning with compliance standards.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
              {userData.physicalProofs.map((proof, index) => (
                <div
                  key={index}
                  className="relative flex flex-col p-4 border border-gray-800 sm:p-5 rounded-xl card-hover"
                  style={{
                    width: '100%',
                    minHeight: '220px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-14 sm:h-14 md:w-16 md:h-16 sm:mb-4">
                    {proof.icon === 'government' && (
                      <img src="/images/idcard.png" alt="Government ID" style={{ width: '56px', height: '56px' }} className="object-contain" />
                    )}
                    {proof.icon === 'biometrics' && (
                      <i className="text-4xl sm:text-5xl fas fa-fingerprint text-neon-green"></i>
                    )}
                    {proof.icon === 'phone' && (
                      <i className="text-4xl sm:text-5xl fas fa-shield-halved text-neon-green"></i>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 w-full">
                    <h3 className="w-full mb-2 text-sm font-semibold text-center text-white sm:text-base" style={{ lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="flex-1 w-full px-2 mb-3 text-xs text-center text-gray-400 sm:mb-4" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center w-full mt-auto mb-2 sm:mb-3">
                      <button className="w-full px-3 py-2 text-xs font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer sm:px-4 sm:py-3 sm:text-sm hover:bg-gray-700" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>

                    {/* Points Button */}
                    <div className="w-full mt-auto text-center">
                      <button className="text-xs font-semibold transition-opacity cursor-pointer sm:text-sm text-neon-green hover:opacity-80">
                        +3% yield
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of DeFi */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-3 sm:mb-4">
              <h2 className="text-xl font-bold text-white sm:text-2xl font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of DeFi</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400 sm:mb-6 sm:text-base md:text-lg" style={{ letterSpacing: '0.02em' }}>
              Let's see how you interact with these protocols, get your points!
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
              {userData.defiProofs.map((proof, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 border border-gray-800 sm:p-5 rounded-xl card-hover"
                  style={{
                    width: '100%',
                    minHeight: '220px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 sm:w-14 sm:h-14 md:w-16 md:h-16 sm:mb-4">
                    {proof.icon === 'franklin' && (
                      <img src="/images/image.png" alt="Franklin Templeton" style={{ width: '56px', height: '56px' }} className="object-contain" />
                    )}
                    {proof.icon === 'soroswap' && (
                      <img src="/images/soroswap.png" alt="Soroswap" style={{ width: '56px', height: '56px' }} className="object-contain" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 w-full">
                    <h3 className="w-full mb-2 text-sm font-semibold text-center text-white sm:text-base" style={{ lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="flex-1 w-full px-2 mb-3 text-xs text-center text-gray-400 sm:mb-4" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center w-full mt-auto mb-2 sm:mb-3">
                      <button className="w-full px-3 py-2 text-xs font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer sm:px-4 sm:py-3 sm:text-sm hover:bg-gray-700" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>

                    {/* Points Button */}
                    <div className="w-full text-center">
                      <button className="text-xs font-semibold transition-opacity cursor-pointer sm:text-sm text-neon-green hover:opacity-80" style={{ letterSpacing: '0.05em' }}>
                        +{proof.points} POINTS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Email Verification Modal */}
      <EmailVerification
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}
