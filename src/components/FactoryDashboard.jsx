import React, { useState, useEffect } from 'react';
import ProductionLines from './ProductionLines';
import ResourceManagement from './ResourceManagement';
import MarketDemand from './MarketDemand';
import FinancialOverview from './FinancialOverview';
import QualityControl from './QualityControl';
import UpgradeCenter from './UpgradeCenter';
import ProgressTracker from './ProgressTracker';
import GameStats from './GameStats';
import NotificationSystem from './NotificationSystem';
import { useGameState } from '../hooks/useGameState';

const FactoryDashboard = () => {
  const { gameState, updateGameState } = useGameState();
  const [activeTab, setActiveTab] = useState('production');

  const tabs = [
    { id: 'production', label: 'Production', icon: '🏭' },
    { id: 'resources', label: 'Resources', icon: '📦' },
    { id: 'market', label: 'Market', icon: '📈' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'quality', label: 'Quality', icon: '✅' },
    { id: 'upgrades', label: 'Upgrades', icon: '⚡' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'production':
        return <ProductionLines gameState={gameState} updateGameState={updateGameState} />;
      case 'resources':
        return <ResourceManagement gameState={gameState} updateGameState={updateGameState} />;
      case 'market':
        return <MarketDemand gameState={gameState} updateGameState={updateGameState} />;
      case 'finance':
        return <FinancialOverview gameState={gameState} updateGameState={updateGameState} />;
      case 'quality':
        return <QualityControl gameState={gameState} updateGameState={updateGameState} />;
      case 'upgrades':
        return <UpgradeCenter gameState={gameState} updateGameState={updateGameState} />;
      default:
        return <ProductionLines gameState={gameState} updateGameState={updateGameState} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Notification System */}
      <NotificationSystem gameState={gameState} />

      {/* Progress Tracker */}
      <ProgressTracker gameState={gameState} />

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Daily Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            ${gameState.finance.dailyRevenue.toLocaleString()}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Bottles Produced</div>
          <div className="text-2xl font-bold text-blue-600">
            {gameState.production.totalBottlesProduced.toLocaleString()}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Quality Score</div>
          <div className="text-2xl font-bold text-purple-600">
            {gameState.quality.overallScore}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Market Share</div>
          <div className="text-2xl font-bold text-orange-600">
            {gameState.market.marketShare}%
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'production' && (
          <>
            <GameStats gameState={gameState} />
            <ProductionLines gameState={gameState} updateGameState={updateGameState} />
          </>
        )}
        {activeTab !== 'production' && renderTabContent()}
      </div>
    </div>
  );
};

export default FactoryDashboard;