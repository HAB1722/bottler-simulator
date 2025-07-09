import React from 'react';
import { TrendingUp, TrendingDown, Target, Globe } from 'lucide-react';

const MarketDemand = ({ gameState, updateGameState }) => {
  const { market } = gameState;

  const adjustPricing = (productType, newPrice) => {
    updateGameState(prevState => ({
      ...prevState,
      market: {
        ...prevState.market,
        products: prevState.market.products.map(product =>
          product.type === productType ? { ...product, price: newPrice } : product
        )
      }
    }));
  };

  const ProductCard = ({ product }) => {
    const demandTrend = product.demandTrend > 0 ? 'up' : product.demandTrend < 0 ? 'down' : 'stable';
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.size}</p>
          </div>
          <div className="flex items-center">
            {demandTrend === 'up' && <TrendingUp className="text-green-500" size={20} />}
            {demandTrend === 'down' && <TrendingDown className="text-red-500" size={20} />}
            {demandTrend === 'stable' && <div className="w-5 h-5 bg-gray-400 rounded-full" />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600">Current Price</div>
            <div className="text-xl font-bold text-green-600">${product.price}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Market Price</div>
            <div className="text-xl font-bold text-blue-600">${product.marketPrice}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Daily Sales</div>
            <div className="text-lg font-medium">{product.dailySales.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Market Share</div>
            <div className="text-lg font-medium">{product.marketShare}%</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Demand Level</div>
          <div className="resource-bar">
            <div
              className={`resource-fill ${
                product.demand > 80 ? 'bg-green-500' :
                product.demand > 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${product.demand}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">{product.demand}% demand</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">Adjust Price</div>
          <div className="flex space-x-2">
            <button
              onClick={() => adjustPricing(product.type, Math.max(0.1, product.price - 0.1))}
              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
            >
              -$0.10
            </button>
            <button
              onClick={() => adjustPricing(product.type, product.price + 0.1)}
              className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 text-sm"
            >
              +$0.10
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Market Demand</h2>
        <div className="text-sm text-gray-600">
          Overall Market Share: {market.marketShare}%
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xl font-bold text-green-600">
                ${market.totalRevenue.toLocaleString()}
              </div>
            </div>
            <Globe className="text-green-500" size={24} />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Units Sold</div>
              <div className="text-xl font-bold text-blue-600">
                {market.unitsSold.toLocaleString()}
              </div>
            </div>
            <Target className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Avg Price</div>
              <div className="text-xl font-bold text-purple-600">
                ${market.averagePrice}
              </div>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Competition</div>
              <div className="text-xl font-bold text-orange-600">
                {market.competitionLevel}
              </div>
            </div>
            <div className="w-6 h-6 bg-orange-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {market.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* Market Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Trends</h3>
        <div className="space-y-4">
          {market.trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  trend.impact === 'positive' ? 'bg-green-500' :
                  trend.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <div className="font-medium">{trend.title}</div>
                  <div className="text-sm text-gray-600">{trend.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  trend.impact === 'positive' ? 'text-green-600' :
                  trend.impact === 'negative' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {trend.change}
                </div>
                <div className="text-xs text-gray-500">{trend.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {market.regions.map((region, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="font-medium text-gray-800 mb-2">{region.name}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Share:</span>
                  <span className="font-medium">{region.marketShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className={`font-medium ${
                    region.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {region.growth > 0 ? '+' : ''}{region.growth}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">${region.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDemand;