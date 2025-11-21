/**
 * Next.js Example - How to use InspektorScoreCard in a Next.js app
 * 
 * Place this file in: pages/index.js or app/page.js (depending on your Next.js version)
 */

import InspektorScoreCard from '../components/InspektorScoreCard';

// For Next.js App Router (app directory)
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Digital Identity Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your proofs of inspektor and digital presence.
          </p>
        </div>

        {/* Card Component */}
        <InspektorScoreCard
          title="INZPEKTOR ID"
          subtitle="V.1.0"
          statusText="PROOF OF CLEAN HANDS VERIFIED"
          wallet="emmilll.eth"
          label="MINTED"
          date="2024.07.26"
        />
      </div>
    </div>
  );
}

// For Next.js Pages Router (pages directory)
// export default function Home() {
//   return (
//     <div className="min-h-screen bg-black py-12 sm:py-16 lg:py-20">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
//             Digital Identity Dashboard
//           </h1>
//         </div>
//         <InspektorScoreCard
//           title="INZPEKTOR ID"
//           subtitle="V.1.0"
//           statusText="PROOF OF CLEAN HANDS VERIFIED"
//           wallet="emmilll.eth"
//           label="MINTED"
//           date="2024.07.26"
//         />
//       </div>
//     </div>
//   );
// }

