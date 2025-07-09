import React from 'react';
import { Clock, Calendar, Zap, Target, AlertTriangle, TrendingDown } from 'lucide-react';

const GameStats = ({ gameState }) => {
  const { production, finance, quality, market, gameProgress } = gameState;

  // Calculate realistic session stats
  const playTimeMinutes = Math.floor((Date.now() - gameProgress.startTime) / (1000 * 60));
  const playTimeHours = Math.floor(playTimeMinutes / 60);
  const remainingMinutes = playTimeMinutes % 60;
  const playTimeDisplay = playTimeHours > 0 ? `${playTimeHours}h ${remainingMinutes}m` : `${playTimeMinutes}m`;

  // Calculate survival metrics
  const daysUntilBankruptcy = finance.cash / Math.abs(Math.min(0, finance.netProfit)) || Infinity;
  const criticalResources = Object.entries(gameState.resources)
    .filter(([key, resource]) => key !== 'totalValue' && resource.daysLeft < 1)
    .length;

  const sessionStats = {
    playTime: playTimeDisplay,
    decisionsToday: gameProgress.decisionsToday,
    survivalDays: Math.floor(gameProgress.daysPassed),
    criticalIssues: criticalResources + (finance.cash < 10000 ? 1 : 0) + (quality.overallScore < 80 ? 1 : 0)
  };

  // Realistic milestones based on current situation
  const milestones = [
    {
      title: 'Survival Milestone',
      current: Math.floor(gameProgress.daysPassed),
      next: 30,
      unit: 'days',
      icon: Target,
      color: 'blue',
      description: 'Stay in business for 30 days'
    },
    {
      title: 'Cash Stability',
      current: finance.cash,
      next: 100000,
      unit: 'cash',
      icon: Zap,
      color: finance.cash > 50000 ? 'green' : 'red',
      description: 'Build cash reserves'
    },
    {
      title: 'Quality Standard',
      current: quality.overallScore,
      next: 90,
      unit: '%',
      icon: TrendingDown,
      color: quality.overallScore > 85 ? 'green' : 'yellow',
      description: 'Achieve quality excellence'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.round(num).toLocaleString();
  };

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Factory Status</h3>
        {sessionStats.criticalIssues > 0 && (
          <div className="flex items-center text-red-600">
            <AlertTriangle size={16} className="mr-1" />
            <span className="text-sm font-medium">{sessionStats.criticalIssues} Critical Issues</span>
          </div>
        )}
      </div>
      
      {/* Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <Clock className="mx-auto text-blue-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.playTime}</div>
          <div className="text-sm text-gray-600">Session Time</div>
        </div>
        <div className="text-center">
          <Calendar className="mx-auto text-green-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.survivalDays}</div>
          <div className="text-sm text-gray-600">Days Survived</div>
        </div>
        <div className="text-center">
          <Zap className="mx-auto text-yellow-500 mb-2" size={24} />
          <div className="text-lg font-bold text-gray-800">{sessionStats.decisionsToday}</div>
          <div className="text-sm text-gray-600">Decisions Made</div>
        </div>
        <div className="text-center">
          <Target className="mx-auto text-purple-500 mb-2" size={24} />
          <div className={`text-lg font-bold ${getStatusColor(production.productionRate * 60, {good: 800, warning: 400})}`}>
            {Math.round(production.productionRate * 60)}
          </div>
          <div className="text-sm text-gray-600">Bottles/Hour</div>
        </div>
      </div>

      {/* Critical Alerts */}
      {(finance.cash < 20000 || criticalResources > 0 || quality.overallScore < 80) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-red-800 mb-2 flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            Immediate Action Required
          </h4>
          <div className="space-y-1 text-sm text-red-700">
            {finance.cash < 20000 && (
              <div>• Cash critically low: ${finance.cash.toLocaleString()} remaining</div>
            )}
            {criticalResources > 0 && (
              <div>• {criticalResources} resource(s) running out within 24 hours</div>
            )}
            {quality.overallScore < 80 && (
              <div>• Quality score below acceptable level: {quality.overallScore.toFixed(1)}%</div>
            )}
            {daysUntilBankruptcy < 7 && daysUntilBankruptcy !== Infinity && (
              <div>• Bankruptcy risk in {Math.ceil(daysUntilBankruptcy)} days at current rate</div>
            )}
          </div>
        </div>
      )}

      {/* Progress Milestones */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Progress Milestones</h4>
        {milestones.map((milestone, index) => {
          let progress;
          if (milestone.unit === '%') {
            progress = milestone.current;
          } else {
            progress = (milestone.current / milestone.next) * 100;
          }
          
          const Icon = milestone.icon;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Icon className={`text-${milestone.color}-500 mr-2`} size={16} />
                  <span className="font-medium text-gray-800">{milestone.title}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {milestone.unit === '%' ? 
                    `${milestone.current.toFixed(1)}% / ${milestone.next}%` :
                    `${formatNumber(milestone.current)} / ${formatNumber(milestone.next)}`
                  }
                </span>
              </div>
              
              <div className="resource-bar mb-2">
                <div
                  className={`resource-fill bg-${milestone.color}-500`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{milestone.description}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Challenges */}
      {gameProgress.challenges && gameProgress.challenges.filter(c => c.active).length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Active Challenges</h4>
          <div className="space-y-3">
            {gameProgress.challenges.filter(c => c.active).map((challenge, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-blue-800">{challenge.title}</div>
                  <div className="text-sm text-blue-600">
                    {challenge.progress}/{challenge.target}
                  </div>
                </div>
                <div className="text-sm text-blue-700 mb-2">{challenge.description}</div>
                <div className="resource-bar">
                  <div
                    className="resource-fill bg-blue-500"
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Reward: {typeof challenge.reward === 'number' ? `$${challenge.reward.toLocaleString()}` : challenge.reward}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;