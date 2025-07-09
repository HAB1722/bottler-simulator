import React from 'react';
import { Package, Truck, AlertTriangle, Plus, Clock, DollarSign } from 'lucide-react';

const ResourceManagement = ({ gameState, updateGameState }) => {
  const { resources, finance } = gameState;

  const orderSupplies = (resourceType, quantity) => {
    const resource = resources[resourceType];
    const totalCost = quantity * resource.cost;
    
    if (finance.cash < totalCost) {
      alert(`Insufficient funds! Need $${totalCost.toLocaleString()} but only have $${finance.cash.toLocaleString()}`);
      return;
    }

    updateGameState(prevState => ({
      ...prevState,
      resources: {
        ...prevState.resources,
        [resourceType]: {
          ...prevState.resources[resourceType],
          ordered: prevState.resources[resourceType].ordered + quantity
        }
      },
      finance: {
        ...prevState.finance,
        cash: prevState.finance.cash - totalCost
      }
    }));

    // Simulate delivery time (immediate for demo, but could be delayed)
    setTimeout(() => {
      updateGameState(prevState => ({
        ...prevState,
        resources: {
          ...prevState.resources,
          [resourceType]: {
            ...prevState.resources[resourceType],
            current: Math.min(
              prevState.resources[resourceType].capacity,
              prevState.resources[resourceType].current + quantity
            ),
            ordered: Math.max(0, prevState.resources[resourceType].ordered - quantity)
          }
        }
      }));
    }, 2000); // 2 second delivery for demo
  };

  const getUrgencyLevel = (daysLeft) => {
    if (daysLeft < 0.5) return { level: 'critical', color: 'red', text: 'CRITICAL' };
    if (daysLeft < 1) return { level: 'urgent', color: 'orange', text: 'URGENT' };
    if (daysLeft < 3) return { level: 'warning', color: 'yellow', text: 'LOW' };
    return { level: 'good', color: 'green', text: 'GOOD' };
  };

  const ResourceCard = ({ resource, type }) => {
    const stockLevel = resource.current / resource.capacity;
    const urgency = getUrgencyLevel(resource.daysLeft);
    const canAffordSmallOrder = finance.cash >= (resource.capacity * 0.25 * resource.cost);
    const canAffordLargeOrder = finance.cash >= (resource.capacity * 0.5 * resource.cost);
    
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
        urgency.level === 'critical' ? 'border-red-500 bg-red-50' :
        urgency.level === 'urgent' ? 'border-orange-500 bg-orange-50' :
        urgency.level === 'warning' ? 'border-yellow-500 bg-yellow-50' :
        'border-gray-200'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
            <p className="text-sm text-gray-600">{resource.supplier}</p>
            <p className="text-xs text-gray-500">Quality: {resource.quality}</p>
          </div>
          <div className="flex items-center">
            <Package className="text-gray-400 mr-2" size={20} />
            <span className={`text-xs font-bold px-2 py-1 rounded text-${urgency.color}-800 bg-${urgency.color}-200`}>
              {urgency.text}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Stock Level</span>
            <span>{resource.current.toLocaleString()} / {resource.capacity.toLocaleString()}</span>
          </div>
          <div className="resource-bar">
            <div
              className={`resource-fill bg-${urgency.color}-500`}
              style={{ width: `${stockLevel * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{Math.round(stockLevel * 100)}% capacity</span>
            <span className={`font-medium text-${urgency.color}-600`}>
              {resource.daysLeft < 1 ? 
                `${Math.round(resource.daysLeft * 24)}h left` : 
                `${Math.round(resource.daysLeft)} days left`
              }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-600">Daily Usage:</span>
            <div className="font-medium">{resource.dailyUsage.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Unit Cost:</span>
            <div className="font-medium">${resource.cost}</div>
          </div>
          <div>
            <span className="text-gray-600">On Order:</span>
            <div className="font-medium text-blue-600">{resource.ordered.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Total Value:</span>
            <div className="font-medium">${(resource.current * resource.cost).toLocaleString()}</div>
          </div>
        </div>

        {urgency.level === 'critical' && (
          <div className="flex items-center text-sm text-red-600 mb-3 p-2 bg-red-100 rounded">
            <AlertTriangle size={16} className="mr-2" />
            <span className="font-medium">Production will stop soon!</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => orderSupplies(type, Math.floor(resource.capacity * 0.25))}
              disabled={!canAffordSmallOrder}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                canAffordSmallOrder
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Order 25%
              <div className="text-xs">
                ${(Math.floor(resource.capacity * 0.25) * resource.cost).toLocaleString()}
              </div>
            </button>
            <button
              onClick={() => orderSupplies(type, Math.floor(resource.capacity * 0.5))}
              disabled={!canAffordLargeOrder}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                canAffordLargeOrder
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Order 50%
              <div className="text-xs">
                ${(Math.floor(resource.capacity * 0.5) * resource.cost).toLocaleString()}
              </div>
            </button>
          </div>
          
          {/* Emergency order for critical resources */}
          {urgency.level === 'critical' && (
            <button
              onClick={() => orderSupplies(type, Math.floor(resource.capacity * 0.1))}
              className="w-full px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Emergency Order (10%)
              <div className="text-xs">
                ${(Math.floor(resource.capacity * 0.1) * resource.cost).toLocaleString()}
              </div>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Calculate total inventory value and critical resources
  const totalInventoryValue = Object.entries(resources)
    .filter(([key]) => key !== 'totalValue')
    .reduce((total, [, resource]) => total + (resource.current * resource.cost), 0);

  const criticalResources = Object.entries(resources)
    .filter(([key, resource]) => key !== 'totalValue' && resource.daysLeft < 1)
    .length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resource Management</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Inventory Value</div>
          <div className="text-lg font-semibold text-green-600">
            ${totalInventoryValue.toLocaleString()}
          </div>
          {criticalResources > 0 && (
            <div className="text-sm text-red-600 font-medium">
              {criticalResources} critical shortage{criticalResources > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Cash Warning */}
      {finance.cash < 50000 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="text-yellow-600 mr-2" size={20} />
            <div>
              <div className="font-medium text-yellow-800">Low Cash Warning</div>
              <div className="text-sm text-yellow-700">
                Available cash: ${finance.cash.toLocaleString()}. Consider prioritizing essential resources only.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(resources).map(([key, resource]) => {
          if (key === 'totalValue') return null;
          return <ResourceCard key={key} resource={resource} type={key} />;
        })}
      </div>

      {/* Supply Chain Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Truck className="mr-2" size={20} />
          Supply Chain Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-600">Active Suppliers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {criticalResources === 0 ? '100%' : `${Math.max(0, 100 - criticalResources * 20)}%`}
            </div>
            <div className="text-sm text-gray-600">Supply Security</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${(totalInventoryValue / Object.keys(resources).length * 1000).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Avg Order Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">Immediate</div>
            <div className="text-sm text-gray-600">Delivery Time</div>
          </div>
        </div>
      </div>

      {/* Supplier Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier Recommendations</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium text-blue-800">Premium Water Source</div>
              <div className="text-sm text-blue-600">Higher quality water at competitive rates</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600">Quality +15%</div>
              <div className="text-xs text-blue-500">Requires quality score >85%</div>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div>
              <div className="font-medium text-green-800">Bulk Packaging Supplier</div>
              <div className="text-sm text-green-600">Reduced costs for large orders</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">Cost -20%</div>
              <div className="text-xs text-green-500">Min order: 50K units</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;