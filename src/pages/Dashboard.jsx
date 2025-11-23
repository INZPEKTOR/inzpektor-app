import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import FloatingCharsBackground from '../components/FloatingCharsBackground';

export default function Dashboard() {
  const { isConnected, publicKey, disconnectWallet } = useWallet();

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
        subtitle: "Invest in an ETF starting from 10 USDC.",
        status: "verify",
        points: 350,
        icon: "franklin"
      },
      {
        title: "Soroswap",
        subtitle: "swap XLM to USDC from 140XLM",
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
    <div className="min-h-screen relative" style={{ backgroundColor: '#020923' }}>
      {/* Animated Background */}
      <FloatingCharsBackground />
      
      {/* Top Navbar */}
      <nav className="border-b border-gray-800 px-8 py-4 relative z-10" style={{ backgroundColor: '#020923' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo + Title */}
          <div className="flex items-center flex-1">
            <div className="relative" style={{ width: '60px', height: '60px' }}>
              <img src="/images/buho1.png" alt="INZPEKTOR Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white text-xl font-semibold">INZPEKTOR</span>
          </div>
          
          {/* Right: Wallet + Points + Profile */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* Wallet Connect */}
            <WalletConnect />
            
            {/* Disconnect Button (only show when connected) */}
            {isConnected && (
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors"
              >
                Disconnect
              </button>
            )}
            
            {/* Points */}
            <div className="flex items-center space-x-2 text-neon-green">
              <i className="fas fa-check-circle"></i>
              <span className="font-semibold">{userData.points}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-12 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight font-manrope" style={{ letterSpacing: '0.05em' }}>
            You're Clean Hands, now let's build your on-chain reputation!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed" style={{ letterSpacing: '0.02em' }}>
            Now boost your on-chain reputation, connect and verify with these methods to score more points.
          </p>
        </div>

        {/* Cards Side by Side */}
        <div className="max-w-7xl mx-auto mb-16 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        {/* InZpektor Score Card */}
            <div className="flex-1 flex justify-center">
          <div 
                className="rounded-2xl p-4 sm:p-5 relative overflow-hidden w-full transition-all duration-300 cursor-pointer hover:-translate-y-3" 
            style={{ 
                  maxWidth: '100%',
                  minHeight: '400px', 
                  height: '400px',
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
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                    mixBlendMode: 'overlay'
                  }}
                ></div>
            {/* Fingerprint Icon */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-fingerprint text-neon-green text-base sm:text-lg"></i>
              </div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              {/* Top Section */}
                  <div className="flex justify-between items-start mb-4 px-2">
                <div>
                  <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-1 font-manrope">
                    INZPEKTOR ID
                  </h2>
                  <p className="text-neon-green text-xs opacity-90">{userData.inspektorScore.version}</p>
                </div>
              </div>
              
              {/* Center Section */}
              <div className="flex-1 flex items-center justify-center px-4 my-4">
                    <h3 className="text-neon-green font-bold text-lg sm:text-xl lg:text-2xl tracking-wide uppercase text-center leading-tight font-space-grotesk w-full">
                  {userData.inspektorScore.status}
                </h3>
              </div>
              
              {/* Bottom Section */}
                  <div className="flex justify-between items-end flex-wrap gap-4 mt-auto px-2">
                    <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[45%]">
                  {isConnected ? publicKey : userData.username}
                </span>
                <div className="text-right">
                  <span className="text-neon-green text-xs uppercase tracking-wide block mb-1">MINTED</span>
                      <p className="text-white font-medium text-xs sm:text-sm">{userData.inspektorScore.mintedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Points & DeFi Yield Boost Section */}
            <div className="flex-1 flex justify-center">
              <div className="border border-gray-800 rounded-2xl p-4 sm:p-6 w-full shadow-xl" style={{ minHeight: '400px', height: '400px', backgroundColor: '#0a1120' }}>
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-neon-green mb-2 font-manrope" style={{ letterSpacing: '0.03em' }}>
                  My Points & DeFi Yield Boost
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mb-4" style={{ letterSpacing: '0.02em' }}>
                  Accumulate points by completing tasks and verifying credentials. More points unlock higher DeFi yields, boosting your earnings potential.
                </p>

                <div className="flex flex-col gap-4 h-[calc(100%-120px)]">
                  {/* Current Points */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neon-green rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-star text-white text-lg sm:text-xl"></i>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1" style={{ letterSpacing: '0.02em' }}>Current Points</p>
                      <p className="text-white text-2xl sm:text-3xl font-bold" style={{ letterSpacing: '0.05em' }}>
                        {userData.points.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Yield Slider */}
                  <div className="flex-1 w-full flex flex-col justify-end">
                    {/* Yield Levels */}
                    <div className="relative">
                      {/* Yield Indicator */}
                      <div 
                        className="absolute bottom-full transform -translate-x-1/2 flex flex-col items-center mb-1 transition-all duration-500 z-10"
                        style={{ 
                          left: `${(() => {
                            const points = userData.points;
                            if (points >= 550) return 100;
                            if (points >= 320) return (320 / 550) * 100;
                            if (points >= 200) return (200 / 550) * 100;
                            if (points >= 100) return (100 / 550) * 100;
                            return (points / 550) * 100;
                          })()}%`
                        }}
                      >
                        <p className="text-neon-green text-lg font-bold">
                          {(() => {
                            const points = userData.points;
                            if (points >= 550) return '8%';
                            if (points >= 320) return '6.5%';
                            if (points >= 200) return '5.5%';
                            return '';
                          })()}
                        </p>
                      </div>

                      <div className="flex justify-between items-end mb-2 pt-12">
                        <div className="text-center">
                          <p className="text-gray-500 text-[10px]">0</p>
                        </div>
                        <div className="text-center">
                          <p className="text-neon-green text-xs font-semibold mb-1">4.25%</p>
                          <p className="text-gray-500 text-[10px]">100</p>
                        </div>
                        <div className="text-center">
                          <p className="text-neon-green text-xs font-semibold mb-1">5.5%</p>
                          <p className="text-gray-500 text-[10px]">200</p>
                        </div>
                        <div className="text-center">
                          <p className="text-neon-green text-xs font-semibold mb-1">6.5%</p>
                          <p className="text-gray-500 text-[10px]">320</p>
                        </div>
                        <div className="text-center">
                          <p className="text-neon-green text-xs font-semibold mb-1">8%</p>
                          <p className="text-gray-500 text-[10px]">550</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-3 bg-gray-800 rounded-full overflow-visible">
                        <div 
                          className="h-full bg-gradient-to-r from-neon-green to-emerald-400 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(() => {
                              const points = userData.points;
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
                          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-neon-green rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-500 z-20"
                          style={{ 
                            left: `${(() => {
                              const points = userData.points;
                              if (points >= 550) return 100;
                              if (points >= 320) return (320 / 550) * 100;
                              if (points >= 200) return (200 / 550) * 100;
                              if (points >= 100) return (100 / 550) * 100;
                              return (points / 550) * 100;
                            })()}%` 
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Proof of Digital Presence */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <h2 className="text-white text-2xl font-bold font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of Digital Presence</h2>
            </div>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed" style={{ letterSpacing: '0.02em' }}>
              As the saying goes, if you have nothing to hide, you have nothing to fear! Connect a social media platform, 
              it's optional, but it boosts your score and strengthens your Clean Hands credibility.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {userData.digitalProofs.map((proof, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-5 border border-gray-800 card-hover flex flex-col flex-shrink-0" 
                  style={{ 
                    width: '342px', 
                    height: '257px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {proof.icon === 'identity' && (
                      <i className="fas fa-shield-halved text-neon-green text-5xl"></i>
                    )}
                    {proof.icon === 'facebook' && (
                      <i className="fas fa-lock text-neon-green text-5xl"></i>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col w-full">
                    <h3 className="text-white font-semibold mb-2 text-center w-full" style={{ fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-4 text-center flex-1 w-full px-2" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>
                    
                    {/* Verify Button */}
                    <div className="flex items-center justify-center mt-auto mb-3 w-full">
                      <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors cursor-pointer" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>
                    
                    {/* Yield Button */}
                    <div className="text-center w-full">
                      <button className="text-neon-green font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer" style={{ letterSpacing: '0.05em' }}>
                        +3% yield
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of Physical Verification */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <h2 className="text-white text-2xl font-bold font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of Physical Verification</h2>
            </div>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed" style={{ letterSpacing: '0.02em' }}>
              Physical verification ensures the presence of a real, unique individual behind each identity, 
              strengthening trust, reducing fraud risk, and aligning with compliance standards.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {userData.physicalProofs.map((proof, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-5 border border-gray-800 card-hover flex flex-col relative flex-shrink-0" 
                  style={{ 
                    width: '342px', 
                    height: '257px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {proof.icon === 'government' && (
                      <img src="/images/idcard.png" alt="Government ID" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                    {proof.icon === 'biometrics' && (
                      <i className="fas fa-fingerprint text-neon-green text-5xl"></i>
                    )}
                    {proof.icon === 'phone' && (
                      <i className="fas fa-shield-halved text-neon-green text-5xl"></i>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col w-full">
                    <h3 className="text-white font-semibold mb-2 text-center w-full" style={{ fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-4 text-center flex-1 w-full px-2" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center mt-auto mb-3 w-full">
                      <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors cursor-pointer" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>
                    
                    {/* Points Button */}
                    <div className="text-center mt-auto w-full">
                      <button className="text-neon-green font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer">
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
            <div className="mb-4">
              <h2 className="text-white text-2xl font-bold font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of DeFi</h2>
            </div>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed" style={{ letterSpacing: '0.02em' }}>
              Let's see how you interact with these protocols, get your points!
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {userData.defiProofs.map((proof, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-5 border border-gray-800 card-hover flex flex-col flex-shrink-0" 
                  style={{ 
                    width: '342px', 
                    height: '257px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {proof.icon === 'franklin' && (
                      <img src="/images/image.png" alt="Franklin Templeton" style={{ width: '64px', height: '64px' }} className="object-contain" />
                    )}
                    {proof.icon === 'soroswap' && (
                      <img src="/images/soroswap.png" alt="Soroswap" style={{ width: '64px', height: '64px' }} className="object-contain" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col w-full">
                    <h3 className="text-white font-semibold mb-2 text-center w-full" style={{ fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-4 text-center flex-1 w-full px-2" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>
                    
                    {/* Verify Button */}
                    <div className="flex items-center justify-center mt-auto mb-3 w-full">
                      <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors cursor-pointer" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>
                    
                    {/* Points Button */}
                    <div className="text-center w-full">
                      <button className="text-neon-green font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer" style={{ letterSpacing: '0.05em' }}>
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
    </div>
  );
}
