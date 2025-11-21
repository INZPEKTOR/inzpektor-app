import React from 'react';
import InspektorScoreCard from './InspektorScoreCard';

/**
 * Example page demonstrating the InspektorScoreCard component usage
 */
const ExamplePage = () => {
  return (
    <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Digital Identity Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
            Manage your proofs of inspektor and digital presence. The more proofs you add, the more you strengthen your digital identity.
          </p>
        </div>

        {/* Default Card */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Default Card
          </h2>
          <InspektorScoreCard />
        </div>

        {/* Custom Card Example */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Custom Card Example
          </h2>
          <InspektorScoreCard
            title="INZPEKTOR ID"
            subtitle="V.2.0"
            statusText="PROOF OF CLEAN HANDS VERIFIED"
            wallet="user.eth"
            label="MINTED"
            date="2024.08.15"
            icon={
              <svg 
                className="w-8 h-8 sm:w-10 sm:h-10 text-neon-green" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            }
          />
        </div>

        {/* Multiple Cards Example */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Multiple Cards Grid
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
            <InspektorScoreCard
              title="INZPEKTOR ID"
              subtitle="V.1.0"
              statusText="VERIFIED"
              wallet="alice.eth"
              label="MINTED"
              date="2024.07.20"
            />
            <InspektorScoreCard
              title="INZPEKTOR ID"
              subtitle="V.1.0"
              statusText="VERIFIED"
              wallet="bob.eth"
              label="MINTED"
              date="2024.07.25"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplePage;

