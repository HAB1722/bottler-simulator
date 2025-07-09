import React from 'react';
import FactoryDashboard from './components/FactoryDashboard';

const App = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          Al Rawdatain Water Bottling Factory
        </h1>
        <p className="text-blue-700 text-lg">Premium Water Production Simulator</p>
      </div>
      <FactoryDashboard />
    </div>
  </div>
);

export default App;