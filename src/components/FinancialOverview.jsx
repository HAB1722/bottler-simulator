import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { safeToLocaleString, safeCurrency } from '../utils/safeFormatting';

const FinancialOverview = ({ gameState, updateGameState }) => {
  const { finance } = gameState;

  const MetricCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className={`text-2xl font-bold text-${color}-600`}>
            {safeCurrency(value)}
          </div>
          {change && (
            <div className={`flex items-center text-sm mt-1 ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="ml-1">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <Icon className={`text-${color}-500`} size={32} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <div className="text-sm text-gray-600">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Cash Balance"
          value={finance.cash}
          change={finance.cashChange}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Daily Revenue"
          value={finance.dailyRevenue}
          change={finance.revenueChange}
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="Daily Expenses"
          value={finance.dailyExpenses}
          change={finance.expenseChange}
          icon={TrendingDown}
          color="red"
        />
        <MetricCard
          title="Net Profit"
          value={finance.netProfit}
          change={finance.profitChange}
          icon={PieChart}
          color="purple"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Breakdown</h3>
        <div className="space-y-4">
          {finance.revenueBreakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{safeCurrency(item.amount)}</div>
                <div className="text-sm text-gray-600">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
        <div className="space-y-4">
          {finance.expenseBreakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{safeCurrency(item.amount)}</div>
                <div className="text-sm text-gray-600">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Flow Projection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow Projection (Next 7 Days)</h3>
        <div className="space-y-3">
          {finance.cashFlowProjection.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="text-gray-700">{day.date}</div>
              <div className="flex space-x-4 text-sm">
                <div className="text-green-600">+${day.income.toLocaleString()}</div>
                <div className="text-red-600">-${day.expenses.toLocaleString()}</div>
                <div className={`font-medium ${
                  day.netFlow > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {day.netFlow > 0 ? '+' : ''}{safeCurrency(day.netFlow)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Profitability</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Margin:</span>
              <span className="font-medium">{finance.ratios.grossMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Margin:</span>
              <span className="font-medium">{finance.ratios.netMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className="font-medium">{finance.ratios.roi}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Efficiency</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Unit:</span>
              <span className="font-medium">${finance.ratios.costPerUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue per Unit:</span>
              <span className="font-medium">${finance.ratios.revenuePerUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Break-even:</span>
              <span className="font-medium">{safeToLocaleString(finance.ratios.breakEven)} units</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Growth</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue Growth:</span>
              <span className={`font-medium ${
                finance.ratios.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {finance.ratios.revenueGrowth > 0 ? '+' : ''}{finance.ratios.revenueGrowth}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Growth:</span>
              <span className={`font-medium ${
                finance.ratios.profitGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {finance.ratios.profitGrowth > 0 ? '+' : ''}{finance.ratios.profitGrowth}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Market Growth:</span>
              <span className="font-medium">{finance.ratios.marketGrowth}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;