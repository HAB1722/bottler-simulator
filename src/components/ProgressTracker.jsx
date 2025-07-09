import React from 'react';
import { Trophy, TrendingUp, Star, Award, Clock, DollarSign } from 'lucide-react';

const ProgressTracker = ({ gameState }) => {
  const { production, finance, quality, market, gameProgress } = gameState;

  // Realistic achievements for a struggling factory
  const achievements = [
    {
      id: 'first_week',
      title: 'First Week Survivor',
      description: 'Keep the factory running for 7 days',
      progress: Math.min(100, (gameProgress.daysPassed / 7) * 100),
      completed: gameProgress.daysPassed >= 7,
      icon: Clock,
      color: 'blue'
    },
    {
      id: 'positive_cash_flow',
      title: 'Positive Cash Flow',
      description: 'Achieve positive daily cash flow',
      progress: finance.netProfit > 0 ? 100 : Math.max(0, ((finance.netProfit + 5000) / 5000) * 100),
      completed: finance.netProfit > 0,
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'quality_improvement',
      title: 'Quality Improvement',
      description: 'Reach 85% overall quality score',
      progress: Math.min(100, (quality.overallScore / 85) * 100),
      completed: quality.overallScore >= 85,
      icon: Star,
      color: 'purple'
    },
    {
      id: 'market_growth',
      title: 'Market Growth',
      description: 'Increase market share to 5%',
      progress: Math.min(100, (market.marketShare / 5) * 100),
      completed: market.marketShare >= 5,
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 'first_upgrade',
      title: 'First Upgrade',
      description: 'Purchase your first equipment upgrade',
      progress: gameProgress.milestones?.firstUpgrade ? 100 : 0,
      completed: gameProgress.milestones?.firstUpgrade || false,
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: 'debt_free',
      title: 'Debt Free',
      description: 'Pay off initial debt and build reserves',
      progress: Math.min(100, (finance.cash / 100000) * 100),
      completed: finance.cash >= 100000,
      icon: Award,
      color: 'green'
    }
  ];

  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalAchievements = achievements.length;

  // Business health indicators
  const healthIndicators = [
    {
      name: 'Cash Flow',
      value: finance.netProfit,
      status: finance.netProfit > 5000 ? 'excellent' : finance.netProfit > 0 ? 'good' : finance.netProfit > -2000 ? 'warning' : 'critical',
      format: (val) => `$${val.toLocaleString()}/day`
    },
    {
      name: 'Production Rate',
      value: production.productionRate * 60,
      status: production.productionRate * 60 > 800 ? 'excellent' : production.productionRate * 60 > 400 ? 'good' : production.productionRate * 60 > 200 ? 'warning' : 'critical',
      format: (val) => `${Math.round(val)} bottles/hour`
    },
    {
      name: 'Quality Score',
      value: quality.overallScore,
      status: quality.overallScore > 90 ? 'excellent' : quality.overallScore > 80 ? 'good' : quality.overallScore > 70 ? 'warning' : 'critical',
      format: (val) => `${val.toFixed(1)}%`
    },
    {
      name: 'Market Position',
      value: market.marketShare,
      status: market.marketShare > 10 ? 'excellent' : market.marketShare > 5 ? 'good' : market.marketShare > 2 ? 'warning' : 'critical',
      format: (val) => `${val.toFixed(1)}%`
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Health Dashboard */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Business Health</h3>
          <div className="text-sm text-gray-600">
            Day {Math.floor(gameProgress.daysPassed)} • {completedAchievements}/{totalAchievements} Goals
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {healthIndicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-gray-600 mb-1">{indicator.name}</div>
              <div className={`text-lg font-bold text-${getStatusColor(indicator.status)}-600`}>
                {indicator.format(indicator.value)}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full bg-${getStatusColor(indicator.status)}-100 text-${getStatusColor(indicator.status)}-800 inline-block mt-1`}>
                {indicator.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Achievement Progress</h3>
          <div className="text-sm text-gray-600">
            {completedAchievements}/{totalAchievements} Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                  achievement.completed
                    ? `border-${achievement.color}-200 bg-${achievement.color}-50`
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon
                    className={`mr-2 ${
                      achievement.completed
                        ? `text-${achievement.color}-600`
                        : 'text-gray-400'
                    }`}
                    size={20}
                  />
                  <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round(achievement.progress)}%</span>
                  </div>
                  <div className="resource-bar">
                    <div
                      className={`resource-fill ${
                        achievement.completed
                          ? `bg-${achievement.color}-500`
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
                
                {achievement.completed && (
                  <div className={`text-xs font-medium text-${achievement.color}-600`}>
                    ✓ COMPLETED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Survival Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Survival Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(gameProgress.daysPassed)}
            </div>
            <div className="text-sm text-blue-700">Days in Business</div>
            <div className="text-xs text-blue-600 mt-1">
              Target: 30 days
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {finance.cash > 0 ? Math.floor(finance.cash / Math.abs(finance.dailyExpenses)) : 0}
            </div>
            <div className="text-sm text-green-700">Days of Cash Left</div>
            <div className="text-xs text-green-600 mt-1">
              At current burn rate
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {gameProgress.totalDecisions}
            </div>
            <div className="text-sm text-purple-700">Total Decisions</div>
            <div className="text-xs text-purple-600 mt-1">
              Management actions taken
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;