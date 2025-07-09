import React from 'react';
import { Zap, Cog, TrendingUp, Lock } from 'lucide-react';

const UpgradeCenter = ({ gameState, updateGameState }) => {
  const { upgrades, finance } = gameState;

  const purchaseUpgrade = (upgradeId) => {
    const upgrade = upgrades.available.find(u => u.id === upgradeId);
    if (!upgrade || finance.cash < upgrade.cost) return;

    updateGameState(prevState => ({
      ...prevState,
      finance: {
        ...prevState.finance,
        cash: prevState.finance.cash - upgrade.cost
      },
      upgrades: {
        ...prevState.upgrades,
        purchased: [...prevState.upgrades.purchased, upgrade],
        available: prevState.upgrades.available.filter(u => u.id !== upgradeId)
      }
    }));
  };

  const UpgradeCard = ({ upgrade, isPurchased = false }) => {
    const canAfford = finance.cash >= upgrade.cost;
    
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all duration-200 ${
        isPurchased ? 'border-green-200 bg-green-50' : 
        canAfford ? 'border-gray-200 hover:border-blue-300' : 'border-gray-200 opacity-60'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${
              isPurchased ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {upgrade.category === 'production' && <Cog className="text-blue-600" size={20} />}
              {upgrade.category === 'efficiency' && <Zap className="text-yellow-600" size={20} />}
              {upgrade.category === 'quality' && <TrendingUp className="text-green-600" size={20} />}
              {upgrade.category === 'automation' && <Cog className="text-purple-600" size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{upgrade.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{upgrade.category}</p>
            </div>
          </div>
          {isPurchased && (
            <div className="text-green-600 text-sm font-medium">OWNED</div>
          )}
        </div>

        <p className="text-gray-700 mb-4">{upgrade.description}</p>

        <div className="space-y-2 mb-4">
          {upgrade.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-600">
              ${upgrade.cost.toLocaleString()}
            </div>
            {upgrade.requirements && (
              <div className="text-xs text-gray-500">
                Requires: {upgrade.requirements}
              </div>
            )}
          </div>
          {!isPurchased && (
            <button
              onClick={() => purchaseUpgrade(upgrade.id)}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                canAfford
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAfford ? 'Purchase' : 'Insufficient Funds'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const categories = ['production', 'efficiency', 'quality', 'automation'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Upgrade Center</h2>
        <div className="text-sm text-gray-600">
          Available Budget: ${finance.cash.toLocaleString()}
        </div>
      </div>

      {/* Purchased Upgrades */}
      {upgrades.purchased.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Owned Upgrades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upgrades.purchased.map((upgrade) => (
              <UpgradeCard key={upgrade.id} upgrade={upgrade} isPurchased={true} />
            ))}
          </div>
        </div>
      )}

      {/* Available Upgrades by Category */}
      {categories.map((category) => {
        const categoryUpgrades = upgrades.available.filter(u => u.category === category);
        if (categoryUpgrades.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize flex items-center">
              {category === 'production' && <Cog className="mr-2 text-blue-600" size={20} />}
              {category === 'efficiency' && <Zap className="mr-2 text-yellow-600" size={20} />}
              {category === 'quality' && <TrendingUp className="mr-2 text-green-600" size={20} />}
              {category === 'automation' && <Cog className="mr-2 text-purple-600" size={20} />}
              {category} Upgrades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryUpgrades.map((upgrade) => (
                <UpgradeCard key={upgrade.id} upgrade={upgrade} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Upgrade Benefits Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Upgrade Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              +{upgrades.totalBenefits.productionBoost}%
            </div>
            <div className="text-sm text-gray-600">Production Boost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              +{upgrades.totalBenefits.efficiencyBoost}%
            </div>
            <div className="text-sm text-gray-600">Efficiency Boost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{upgrades.totalBenefits.qualityBoost}%
            </div>
            <div className="text-sm text-gray-600">Quality Boost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              -{upgrades.totalBenefits.costReduction}%
            </div>
            <div className="text-sm text-gray-600">Cost Reduction</div>
          </div>
        </div>
      </div>

      {/* Research & Development */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Lock className="mr-2 text-gray-600" size={20} />
          Research & Development
        </h3>
        <div className="space-y-4">
          {upgrades.research.map((research, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">{research.name}</div>
                <div className="text-sm text-gray-600">{research.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Unlocks in: {research.timeToUnlock}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">
                  Research Cost: ${research.researchCost.toLocaleString()}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${research.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradeCenter;