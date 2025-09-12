import React from 'react';

function App() {
  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url(/schutblad-opening.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Je bestaande app content komt hier */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Ethiek & Technologie Casus Generator
          </h1>
          <p className="text-gray-600">
            De achtergrond zou nu zichtbaar moeten zijn!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;