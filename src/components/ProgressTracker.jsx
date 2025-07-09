import React from 'react';
import { Trophy, TrendingUp, Star, Award } from 'lucide-react';

const ProgressTracker = ({ gameState }) => {
  const { production, finance, quality, market } = gameState;

  // Calculate achievements and milestones
  const achievements = [
    {
      id: 'first_million',
      title: 'First Million',
      description: 'Produce 1,000,000 bottles',
      progress: Math.min(100, (production.totalBottlesProduced / 1000000) * 100),
      completed: production.totalBottlesProduced >= 1000000,
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: 'cash_king',
      title: 'Cash King',
      description: 'Accumulate $1,000,000 in cash',
      progress: Math.min(100, (finance.cash / 1000000) * 100),
      completed: finance.cash >= 1000000,
      icon: Award,
      color: 'green'
    },
    {
      id: 'quality_master',
      title: 'Quality Master',
      description: 'Achieve 98% overall quality score',
      progress: Math.min(100, (quality.overallScore / 98) * 100),
      completed: quality.overallScore >= 98,
      icon: Star,
      color: 'purple'
    },
    {
      id: 'market_leader',
      title: 'Market Leader',
      description: 'Capture 25% market share',
      progress: Math.min(100, (market.marketShare / 25) * 100),
      completed: market.marketShare >= 25,
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalAchievements = achievements.length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Progress & Achievements</h3>
        <div className="text-sm text-gray-600">
          {completedAchievements}/{totalAchievements} Completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
};

export default ProgressTracker;