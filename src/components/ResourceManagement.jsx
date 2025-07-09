import React from 'react';
import { Package, Truck, AlertTriangle, Plus } from 'lucide-react';

const ResourceManagement = ({ gameState, updateGameState }) => {
  const { resources } = gameState;

  const orderSupplies = (resourceType, quantity) => {
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
        cash: prevState.finance.cash - (quantity * prevState.resources[resourceType].cost)
      }
    }));
  };

  const ResourceCard = ({ resource, type }) => {
    const stockLevel = resource.current / resource.capacity;
    const stockColor = stockLevel > 0.7 ? 'green' : stockLevel > 0.3 ? 'yellow' : 'red';
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
            <p className="text-sm text-gray-600">{resource.unit}</p>
          </div>
          <Package className="text-gray-400" size={24} />
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Stock Level</span>
            <span>{resource.current.toLocaleString()} / {resource.capacity.toLocaleString()}</span>
          </div>
          <div className="resource-bar">
            <div
              className={`resource-fill bg-${stockColor}-500`}
              style={{ width: `${stockLevel * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-600">Daily Usage:</span>
            <div className="font-medium">{resource.dailyUsage.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Cost per Unit:</span>
            <div className="font-medium">${resource.cost}</div>
          </div>
          <div>
            <span className="text-gray-600">On Order:</span>
            <div className="font-medium">{resource.ordered.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Days Left:</span>
            <div className={`font-medium ${
              resource.daysLeft < 3 ? 'text-red-600' : 
              resource.daysLeft < 7 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {resource.daysLeft}
            </div>
          </div>
        </div>

        {resource.daysLeft < 7 && (
          <div className="flex items-center text-sm text-orange-600 mb-3">
            <AlertTriangle size={16} className="mr-1" />
            Low stock warning
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => orderSupplies(type, Math.floor(resource.capacity * 0.25))}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Order 25%
          </button>
          <button
            onClick={() => orderSupplies(type, Math.floor(resource.capacity * 0.5))}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Order 50%
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resource Management</h2>
        <div className="text-sm text-gray-600">
          Total Inventory Value: ${resources.totalValue.toLocaleString()}
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Active Suppliers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-sm text-gray-600">On-Time Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">2.3</div>
            <div className="text-sm text-gray-600">Avg Delivery Days</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[
            { item: 'Plastic Bottles', quantity: '50,000', status: 'Delivered', date: '2024-01-15' },
            { item: 'Water Filters', quantity: '100', status: 'In Transit', date: '2024-01-14' },
            { item: 'Labels', quantity: '75,000', status: 'Processing', date: '2024-01-13' }
          ].map((order, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="font-medium">{order.item}</div>
                <div className="text-sm text-gray-600">Qty: {order.quantity}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  order.status === 'Delivered' ? 'text-green-600' :
                  order.status === 'In Transit' ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {order.status}
                </div>
                <div className="text-sm text-gray-600">{order.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;