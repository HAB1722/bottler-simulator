import React from 'react';
import { Clock, Calendar, Zap, Target } from 'lucide-react';

const GameStats = ({ gameState }) => {
  const { production, finance, quality, market } = gameState;

  // Calculate session stats (these would be tracked in a real implementation)
  const sessionStats = {
    playTime: '2h 34m', // This would be calculated from actual play time
    decisionsToday: 47, // Track user interactions
    efficiencyGain: '+12%', // Compare to starting efficiency
    profitGrowth: '+156%' // Compare to starting profit
  };

  const milestones = [
    {
      title: 'Production Milestone',
      current: production.totalBottlesProduced,
      next: 2000000,
      unit: 'bottles',
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Revenue Milestone',
      current: finance.cash,
      next: 750000,
      unit: 'cash',
      icon: Zap,
      color: 'green'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Statistics</h3>
      
      {/* Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <Clock className="mx-auto text-blue-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.playTime}</div>
          <div className="text-sm text-gray-600">Play Time</div>
        </div>
        <div className="text-center">
          <Calendar className="mx-auto text-green-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.decisionsToday}</div>
          <div className="text-sm text-gray-600">Decisions Made</div>
        </div>
        <div className="text-center">
          <Zap className="mx-auto text-yellow-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.efficiencyGain}</div>
          <div className="text-sm text-gray-600">Efficiency Gain</div>
        </div>
        <div className="text-center">
          <Target className="mx-auto text-purple-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.profitGrowth}</div>
          <div className="text-sm text-gray-600">Profit Growth</div>
        </div>
      </div>

      {/* Next Milestones */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Next Milestones</h4>
        {milestones.map((milestone, index) => {
          const progress = (milestone.current / milestone.next) * 100;
          const Icon = milestone.icon;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon className={`text-${milestone.color}-500 mr-2`} size={16} />
                  <span className="font-medium text-gray-800">{milestone.title}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {formatNumber(milestone.current)} / {formatNumber(milestone.next)}
                </span>
              </div>
              
              <div className="resource-bar mb-2">
                <div
                  className={`resource-fill bg-${milestone.color}-500`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-600">
                {Math.round(progress)}% complete • {formatNumber(milestone.next - milestone.current)} to go
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameStats;