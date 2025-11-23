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
        subtitle: "Invest through Benji app in an ETF starting from 10 USDC.",
        status: "verify",
        points: 350,
        icon: "franklin"
      },
      {
        title: "Soroswap",
        subtitle: "Swap XLM to USDC from 140XLM.",
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
      <nav className="relative z-10 px-8 py-4 border-b border-gray-800" style={{ backgroundColor: '#020923' }}>
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          {/* Left: Logo + Title */}
          <div className="flex items-center flex-1">
            <div className="relative" style={{ width: '60px', height: '60px' }}>
              <img src="/images/buho1.png" alt="INZPEKTOR Logo" className="object-contain w-full h-full" />
            </div>
            <span className="text-xl font-semibold text-white">INZPEKTOR</span>
          </div>

          {/* Right: Wallet + Points + Profile */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            {/* Wallet Connect */}
            <WalletConnect />

            {/* Disconnect Button (only show when connected) */}
            {isConnected && (
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
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
      <main className="container relative z-10 px-8 py-12 mx-auto">
        {/* Title Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight text-white font-manrope" style={{ letterSpacing: '0.05em' }}>
            You're Clean Hands, now let's build your on-chain reputation!
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-400" style={{ letterSpacing: '0.02em' }}>
            Now boost your on-chain reputation, connect and verify with these methods to score more points.
          </p>
        </div>

        {/* Cards Side by Side */}
        <div className="px-4 mx-auto mb-16 max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:gap-8">
        {/* InZpektor Score Card */}
            <div className="flex justify-center flex-1">
          <div
                className="relative w-full p-4 overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl sm:p-5 hover:-translate-y-3"
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
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                    mixBlendMode: 'overlay'
                  }}
                ></div>
            {/* Fingerprint Icon */}
            <div className="absolute z-20 top-4 right-4 sm:top-5 sm:right-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-neon-green bg-opacity-20">
                    <i className="text-base fas fa-fingerprint text-neon-green sm:text-lg"></i>
              </div>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Top Section */}
                  <div className="flex items-start justify-between px-2 mb-4">
                <div>
                  <h2 className="mb-1 text-xs font-bold tracking-wider text-white uppercase font-manrope">
                    INZPEKTOR ID
                  </h2>
                  <p className="text-xs text-neon-green opacity-90">{userData.inspektorScore.version}</p>
                </div>
              </div>

              {/* Center Section */}
              <div className="flex items-center justify-center flex-1 px-4 my-4">
                    <h3 className="w-full text-lg font-bold leading-tight tracking-wide text-center uppercase text-neon-green sm:text-xl lg:text-2xl font-space-grotesk">
                  {userData.inspektorScore.status}
                </h3>
              </div>

              {/* Bottom Section */}
                  <div className="flex flex-wrap items-end justify-between gap-4 px-2 mt-auto">
                    <span className="text-white font-medium text-xs sm:text-sm truncate max-w-[45%]">
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
              <div className="w-full p-4 border border-gray-800 shadow-xl rounded-2xl sm:p-6" style={{ minHeight: '400px', height: '400px', backgroundColor: '#0a1120' }}>
                {/* Title */}
                <h2 className="mb-2 text-xl font-bold sm:text-2xl text-neon-green font-manrope" style={{ letterSpacing: '0.03em' }}>
                  My Points & DeFi Yield Boost
                </h2>
                <p className="mb-4 text-xs text-gray-400 sm:text-sm" style={{ letterSpacing: '0.02em' }}>
                  Accumulate points by completing tasks and verifying credentials. More points unlock higher DeFi yields, boosting your earnings potential.
                </p>

                <div className="flex flex-col gap-4 h-[calc(100%-120px)]">
                  {/* Current Points */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full sm:w-12 sm:h-12 bg-neon-green">
                      <i className="text-lg text-white fas fa-star sm:text-xl"></i>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-gray-400" style={{ letterSpacing: '0.02em' }}>Current Points</p>
                      <p className="text-2xl font-bold text-white sm:text-3xl" style={{ letterSpacing: '0.05em' }}>
                        {userData.points.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Yield Slider */}
                  <div className="flex flex-col justify-end flex-1 w-full">
                    {/* Yield Levels */}
                    <div className="relative">
                      {/* Yield Indicator */}
                      <div
                        className="absolute z-10 flex flex-col items-center mb-1 transition-all duration-500 transform -translate-x-1/2 bottom-full"
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
                        <p className="text-lg font-bold text-neon-green">
                          {(() => {
                            const points = userData.points;
                            if (points >= 550) return '8%';
                            if (points >= 320) return '6.5%';
                            if (points >= 200) return '5.5%';
                            return '';
                          })()}
                        </p>
                      </div>

                      <div className="flex items-end justify-between pt-12 mb-2">
                        <div className="text-center">
                          <p className="text-gray-500 text-[10px]">0</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-1 text-xs font-semibold text-neon-green">4.25%</p>
                          <p className="text-gray-500 text-[10px]">100</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-1 text-xs font-semibold text-neon-green">5.5%</p>
                          <p className="text-gray-500 text-[10px]">200</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-1 text-xs font-semibold text-neon-green">6.5%</p>
                          <p className="text-gray-500 text-[10px]">320</p>
                        </div>
                        <div className="text-center">
                          <p className="mb-1 text-xs font-semibold text-neon-green">8%</p>
                          <p className="text-gray-500 text-[10px]">550</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-3 overflow-visible bg-gray-800 rounded-full">
                        <div
                          className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-neon-green to-emerald-400"
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
                          className="absolute z-20 flex items-center justify-center w-5 h-5 transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-lg top-1/2 bg-neon-green"
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
        <div className="mx-auto space-y-12 max-w-7xl">
          {/* Proof of Digital Presence */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of Digital Presence</h2>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-400" style={{ letterSpacing: '0.02em' }}>
              As the saying goes, if you have nothing to hide, you have nothing to fear! Connect a social media platform,
              it's optional, but it boosts your score and strengthens your Clean Hands credibility.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {userData.digitalProofs.map((proof, index) => (
                <div
                  key={index}
                  className="flex flex-col flex-shrink-0 p-5 border border-gray-800 rounded-xl card-hover"
                  style={{
                    width: '342px',
                    height: '257px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
                    {proof.icon === 'identity' && (
                      <i className="text-5xl fas fa-shield-halved text-neon-green"></i>
                    )}
                    {proof.icon === 'facebook' && (
                      <i className="text-5xl fas fa-lock text-neon-green"></i>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 w-full">
                    <h3 className="w-full mb-2 font-semibold text-center text-white" style={{ fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="flex-1 w-full px-2 mb-4 text-xs text-center text-gray-400" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center w-full mt-auto mb-3">
                      <button className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>

                    {/* Yield Button */}
                    <div className="w-full text-center">
                      <button className="text-sm font-semibold transition-opacity cursor-pointer text-neon-green hover:opacity-80" style={{ letterSpacing: '0.05em' }}>
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
              <h2 className="text-2xl font-bold text-white font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of Physical Verification</h2>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-400" style={{ letterSpacing: '0.02em' }}>
              Physical verification ensures the presence of a real, unique individual behind each identity,
              strengthening trust, reducing fraud risk, and aligning with compliance standards.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {userData.physicalProofs.map((proof, index) => (
                <div
                  key={index}
                  className="relative flex flex-col flex-shrink-0 p-5 border border-gray-800 rounded-xl card-hover"
                  style={{
                    width: '342px',
                    height: '257px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
                    {proof.icon === 'government' && (
                      <img src="/images/idcard.png" alt="Government ID" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                    {proof.icon === 'biometrics' && (
                      <i className="text-5xl fas fa-fingerprint text-neon-green"></i>
                    )}
                    {proof.icon === 'phone' && (
                      <i className="text-5xl fas fa-shield-halved text-neon-green"></i>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 w-full">
                    <h3 className="w-full mb-2 font-semibold text-center text-white" style={{ fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="flex-1 w-full px-2 mb-4 text-xs text-center text-gray-400" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center w-full mt-auto mb-3">
                      <button className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>

                    {/* Points Button */}
                    <div className="w-full mt-auto text-center">
                      <button className="text-sm font-semibold transition-opacity cursor-pointer text-neon-green hover:opacity-80">
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
              <h2 className="text-2xl font-bold text-white font-manrope" style={{ letterSpacing: '0.03em' }}>Proof of DeFi</h2>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-400" style={{ letterSpacing: '0.02em' }}>
              Let's see how you interact with these protocols, get your points!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {userData.defiProofs.map((proof, index) => (
                <div
                  key={index}
                  className="flex flex-col flex-shrink-0 p-5 border border-gray-800 rounded-xl card-hover"
                  style={{
                    width: '342px',
                    height: '257px',
                    backgroundColor: '#0a1120'
                  }}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
                    {proof.icon === 'franklin' && (
                      <img src="/images/image.png" alt="Franklin Templeton" style={{ width: '64px', height: '64px' }} className="object-contain" />
                    )}
                    {proof.icon === 'soroswap' && (
                      <img src="/images/soroswap.png" alt="Soroswap" style={{ width: '64px', height: '64px' }} className="object-contain" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 w-full">
                    <h3 className="w-full mb-2 font-semibold text-center text-white" style={{ fontSize: '16px', lineHeight: '1.4', letterSpacing: '0.03em' }}>
                      {proof.title}
                    </h3>
                    <p className="flex-1 w-full px-2 mb-4 text-xs text-center text-gray-400" style={{ fontSize: '12px', lineHeight: '1.5', maxWidth: '100%', letterSpacing: '0.02em' }}>
                      {proof.subtitle}
                    </p>

                    {/* Verify Button */}
                    <div className="flex items-center justify-center w-full mt-auto mb-3">
                      <button className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700" style={{ maxWidth: '100%', letterSpacing: '0.05em' }}>
                        Verify
                      </button>
                    </div>

                    {/* Points Button */}
                    <div className="w-full text-center">
                      <button className="text-sm font-semibold transition-opacity cursor-pointer text-neon-green hover:opacity-80" style={{ letterSpacing: '0.05em' }}>
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
