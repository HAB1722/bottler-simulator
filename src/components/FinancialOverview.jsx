import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, FileText, CreditCard } from 'lucide-react';
import { safeToLocaleString, safeCurrency } from '../utils/safeFormatting';

const FinancialOverview = ({ gameState, updateGameState }) => {
  // Add safety checks for all required data
  if (!gameState || !gameState.finance) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">Loading financial data...</div>
      </div>
    );
  }

  const { finance, profitLoss = {}, loans = {} } = gameState;

  // Provide default values for missing data
  const safeFinance = {
    cash: 0,
    dailyRevenue: 0,
    dailyExpenses: 0,
    netProfit: 0,
    cashChange: 0,
    revenueChange: 0,
    expenseChange: 0,
    profitChange: 0,
    revenueBreakdown: [],
    expenseBreakdown: [],
    cashFlowProjection: [],
    ratios: {
      grossMargin: 0,
      netMargin: 0,
      roi: 0,
      costPerUnit: 0,
      revenuePerUnit: 0,
      breakEven: 0,
      revenueGrowth: 0,
      profitGrowth: 0,
      marketGrowth: 0
    },
    ...finance
  };

  const safeProfitLoss = {
    revenue: {
      productSales: 0,
      premiumSales: 0,
      contractSales: 0,
      total: 0
    },
    expenses: {
      rawMaterials: 0,
      labor: 0,
      utilities: 0,
      maintenance: 0,
      loanPayments: 0,
      research: 0,
      insurance: 0,
      rent: 0,
      total: 0
    },
    grossProfit: 0,
    netProfit: 0,
    margins: {
      gross: 0,
      net: 0
    },
    ...profitLoss
  };

  const safeLoans = {
    totalDebt: 0,
    monthlyPayments: 0,
    creditScore: 650,
    active: [],
    available: [],
    ...loans
  };

  const applyForLoan = (loanId, amount) => {
    // Implementation for loan application
    console.log(`Applying for loan ${loanId} with amount ${amount}`);
  };

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

      {/* Detailed P&L Statement */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2" size={20} />
          Profit & Loss Statement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue */}
          <div>
            <h4 className="font-medium text-green-800 mb-3">Revenue</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Sales:</span>
                <span className="font-medium">{safeCurrency(profitLoss.revenue.productSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Premium Sales:</span>
                <span className="font-medium">{safeCurrency(profitLoss.revenue.premiumSales)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contract Sales:</span>
                <span className="font-medium">{safeCurrency(profitLoss.revenue.contractSales)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total Revenue:</span>
                <span className="text-green-600">{safeCurrency(profitLoss.revenue.total)}</span>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div>
            <h4 className="font-medium text-red-800 mb-3">Expenses</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Raw Materials:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.rawMaterials)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Labor:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.labor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilities:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.utilities)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maintenance:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.maintenance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Payments:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.loanPayments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Research:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.research)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.insurance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rent:</span>
                <span className="font-medium">{safeCurrency(profitLoss.expenses.rent)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total Expenses:</span>
                <span className="text-red-600">{safeCurrency(profitLoss.expenses.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {safeCurrency(profitLoss.grossProfit)}
              </div>
              <div className="text-sm text-gray-600">Gross Profit</div>
              <div className="text-xs text-gray-500">{profitLoss.margins.gross}% margin</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${
                profitLoss.netProfit > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {safeCurrency(profitLoss.netProfit)}
              </div>
              <div className="text-sm text-gray-600">Net Profit</div>
              <div className="text-xs text-gray-500">{profitLoss.margins.net}% margin</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {safeCurrency(loans.totalDebt)}
              </div>
              <div className="text-sm text-gray-600">Total Debt</div>
              <div className="text-xs text-gray-500">{safeCurrency(loans.monthlyPayments)}/month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="mr-2" size={20} />
          Loan Management
        </h3>
        
        {/* Active Loans */}
        {loans.active.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Active Loans</h4>
            <div className="space-y-3">
              {loans.active.map((loan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{loan.name}</div>
                      <div className="text-sm text-gray-600">
                        {loan.interestRate}% APR • {loan.remainingMonths} months left
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{safeCurrency(loan.remainingBalance)}</div>
                      <div className="text-sm text-gray-600">{safeCurrency(loan.monthlyPayment)}/month</div>
                    </div>
                  </div>
                  <div className="resource-bar">
                    <div
                      className="resource-fill bg-blue-500"
                      style={{ width: `${((loan.termMonths - loan.remainingMonths) / loan.termMonths) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Loans */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Available Loans</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loans.available.map((loan) => (
              <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-800 mb-2">{loan.name}</div>
                <div className="text-sm text-gray-600 mb-3">{loan.description}</div>
                <div className="space-y-1 text-sm mb-3">
                  <div className="flex justify-between">
                    <span>Max Amount:</span>
                    <span className="font-medium">{safeCurrency(loan.maxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span className="font-medium">{loan.interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term:</span>
                    <span className="font-medium">{loan.termMonths} months</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Requirements: {loan.requirements}
                </div>
                <button
                  onClick={() => applyForLoan(loan.id, loan.maxAmount * 0.5)}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Apply for 50%
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Information */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{loans.creditScore}</div>
              <div className="text-sm text-gray-600">Credit Score</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {safeCurrency(loans.totalDebt)}
              </div>
              <div className="text-sm text-gray-600">Total Debt</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {safeCurrency(loans.monthlyPayments)}
              </div>
              <div className="text-sm text-gray-600">Monthly Payments</div>
            </div>
          </div>
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