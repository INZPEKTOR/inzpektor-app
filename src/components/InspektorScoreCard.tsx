import React from 'react';

interface InspektorScoreCardProps {
  /** Main title (e.g., "INZPEKTOR ID") */
  title?: string;
  /** Subtitle below title (e.g., "V.1.0") */
  subtitle?: string;
  /** Center status text (e.g., "PROOF OF CLEAN HANDS VERIFIED") */
  statusText?: string;
  /** Wallet address (e.g., "emmilll.eth") */
  wallet?: string;
  /** Bottom right label (e.g., "MINTED") */
  label?: string;
  /** Date text (e.g., "2025.11.21") */
  date?: string;
  /** Optional custom icon component */
  icon?: React.ReactNode;
}

/**
 * InspektorScoreCard - A reusable digital identity score card component
 * 
 * Displays a futuristic card with dark gradient background and neon green accents.
 * Fully responsive and centered on desktop.
 */
const InspektorScoreCard: React.FC<InspektorScoreCardProps> = ({
  title = "INZPEKTOR ID",
  subtitle = "V.1.0",
  statusText = "PROOF OF CLEAN HANDS VERIFIED",
  wallet = "emmilll.eth",
  label = "MINTED",
  date = "2025.11.21",
  icon = null
}) => {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div 
        className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mx-auto w-full max-w-[700px] min-w-[640px]"
        style={{
          minHeight: '340px',
          maxHeight: '380px',
          height: '360px',
          background: 'linear-gradient(135deg, #1d415a 0%, #174536 100%)',
          boxShadow: '0 0 40px rgba(139, 254, 195, 0.4)',
          border: '1px solid rgba(139, 254, 195, 0.2)'
        }}
      >
        {/* Subtle inner radial gradient overlay for depth */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(139, 254, 195, 0.1) 0%, transparent 50%)'
          }}
        />
        
        {/* Fingerprint Icon - Absolute positioned in corner */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center">
            {icon || (
              <svg 
                className="w-6 h-6 sm:w-8 sm:h-8 text-neon-green" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Top Section */}
          <div className="flex justify-between items-start mb-6">
            {/* Top Left */}
            <div>
              <h2 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">
                {title}
              </h2>
              <p className="text-neon-green text-xs opacity-90">
                {subtitle}
              </p>
            </div>
          </div>
          
          {/* Center Section - Centered vertically and horizontally */}
          <div className="flex-1 flex items-center justify-center px-4 my-4">
            <h3 
              className="text-neon-green font-bold text-xl sm:text-2xl lg:text-3xl tracking-wide uppercase text-center leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {statusText}
            </h3>
          </div>
          
          {/* Bottom Section */}
          <div className="flex justify-between items-end flex-wrap gap-4 mt-auto">
            {/* Bottom Left */}
            <span className="text-white font-medium text-sm sm:text-base">
              {wallet}
            </span>
            
            {/* Bottom Right */}
            <div className="text-right">
              <span className="text-neon-green text-xs uppercase tracking-wide block mb-1">
                {label}
              </span>
              <p className="text-white font-medium text-sm sm:text-base">
                {date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspektorScoreCard;

