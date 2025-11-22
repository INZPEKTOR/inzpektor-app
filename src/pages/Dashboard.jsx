import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';

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
        title: "Government ID",
        subtitle: "Verify using your Government-issued ID.",
        points: 30,
        icon: "government"
      },
      {
        title: "Biometrics",
        subtitle: "Liveness and uniqueness verification.",
        points: 30,
        icon: "biometrics"
      },
      {
        title: "Phone Verification",
        subtitle: "Verify with your phone number.",
        points: 30,
        icon: "phone"
      },
    ],
    inspektorScore: {
      status: "PROOF OF CLEAN HANDS VERIFIED",
      version: "v1.0",
      mintedDate: "2025.11.21"
    }
  };

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
      <main className="container mx-auto px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            You're Clean Hands, now let's build your on-chain reputation!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Now boost your on-chain reputation, connect and verify with these methods to score more points.
          </p>
        </div>

        {/* InZpektor Score Card */}
        <div className="w-full flex justify-center mb-16 px-4 sm:px-6 lg:px-8">
          <div 
            className="gradient-card rounded-2xl p-5 sm:p-6 relative overflow-hidden mx-auto w-full" 
            style={{ 
              maxWidth: '700px', 
              minWidth: '640px', 
              minHeight: '340px', 
              maxHeight: '380px', 
              height: '360px', 
              boxShadow: '0 0 40px rgba(139, 254, 195, 0.4)' 
            }}
          >
            {/* Fingerprint Icon */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fas fa-fingerprint text-neon-green text-lg sm:text-xl"></i>
              </div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              {/* Top Section */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">
                    INZPEKTOR ID
                  </h2>
                  <p className="text-neon-green text-xs opacity-90">{userData.inspektorScore.version}</p>
                </div>
              </div>
              
              {/* Center Section */}
              <div className="flex-1 flex items-center justify-center px-4 my-4">
                <h3 className="text-neon-green font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide uppercase text-center leading-tight font-space-grotesk">
                  {userData.inspektorScore.status}
                </h3>
              </div>
              
              {/* Bottom Section */}
              <div className="flex justify-between items-end flex-wrap gap-4 mt-auto">
                <span className="text-white font-medium text-sm sm:text-base">
                  {isConnected ? publicKey : userData.username}
                </span>
                <div className="text-right">
                  <span className="text-neon-green text-xs uppercase tracking-wide block mb-1">MINTED</span>
                  <p className="text-white font-medium text-sm sm:text-base">{userData.inspektorScore.mintedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Sections */}
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Proof of Digital Presence */}
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-white text-2xl font-bold">Proof of Digital Presence</h2>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-4xl mx-auto text-center">
              As the saying goes, if you have nothing to hide, you have nothing to fear! Connect a social media platform, 
              it's optional, but it boosts your score and strengthens your Clean Hands credibility.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {userData.digitalProofs.map((proof, index) => (
                <div 
                  key={index}
                  className="bg-card-bg rounded-xl p-5 border border-gray-800 card-hover flex flex-col flex-shrink-0" 
                  style={{ width: '342px', height: '257px' }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {proof.icon === 'identity' && (
                      <img src="/images/gmail2.png" alt="Email" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                    {proof.icon === 'facebook' && (
                      <img src="/images/facebook.png" alt="Facebook" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-white font-semibold mb-2 text-center">{proof.title}</h3>
                    <p className="text-gray-400 text-xs mb-4 text-center flex-1">{proof.subtitle}</p>
                    
                    {/* Verify Button */}
                    <div className="flex items-center justify-center mt-auto mb-3">
                      <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors cursor-pointer">
                        Verify
                      </button>
                    </div>
                    
                    {/* Points Button */}
                    <div className="text-center">
                      <button className="text-neon-green font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer">
                        +{proof.points} POINTS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proof of Physical Verification */}
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-white text-2xl font-bold">Proof of Physical Verification</h2>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-4xl mx-auto text-center">
              Physical verification ensures the presence of a real, unique individual behind each identity, 
              strengthening trust, reducing fraud risk, and aligning with compliance standards.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {userData.physicalProofs.map((proof, index) => (
                <div 
                  key={index}
                  className="bg-card-bg rounded-xl p-5 border border-gray-800 card-hover flex flex-col relative flex-shrink-0" 
                  style={{ width: '342px', height: '257px' }}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {proof.icon === 'government' && (
                      <img src="/images/idcard.png" alt="Government ID" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                    {proof.icon === 'biometrics' && (
                      <img src="/images/huella3.png" alt="Biometrics" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                    {proof.icon === 'phone' && (
                      <img src="/images/iconcel.png" alt="Phone" style={{ width: '60px', height: '60px' }} className="object-contain" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-white font-semibold mb-2 text-center">{proof.title}</h3>
                    <p className="text-gray-400 text-xs mb-4 text-center flex-1">{proof.subtitle}</p>
                    
                    {/* Points Button */}
                    <div className="text-center mt-auto">
                      <button className="text-neon-green font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer">
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
