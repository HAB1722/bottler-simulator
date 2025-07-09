import React from 'react';
import { Play, Pause, Settings, TrendingUp } from 'lucide-react';

const ProductionLines = ({ gameState, updateGameState }) => {
  const { production } = gameState;

  const toggleProductionLine = (lineId) => {
    updateGameState(prevState => ({
      ...prevState,
      production: {
        ...prevState.production,
        lines: prevState.production.lines.map(line =>
          line.id === lineId ? { ...line, isActive: !line.isActive } : line
        )
      }
    }));
  };

  const adjustProductionSpeed = (lineId, speed) => {
    updateGameState(prevState => ({
      ...prevState,
      production: {
        ...prevState.production,
        lines: prevState.production.lines.map(line =>
          line.id === lineId ? { ...line, speed: Math.max(1, Math.min(10, speed)) } : line
        )
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Production Lines</h2>
        <div className="text-sm text-gray-600">
          Total Capacity: {production.totalCapacity.toLocaleString()} bottles/hour
        </div>
      </div>

      <div className="grid gap-6">
        {production.lines.map((line) => (
          <div key={line.id} className="production-line">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{line.name}</h3>
                <p className="text-sm text-gray-600">{line.type} - Level {line.level}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleProductionLine(line.id)}
                  className={`p-2 rounded-md transition-colors ${
                    line.isActive
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {line.isActive ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                  <Settings size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Output</div>
                <div className="text-xl font-bold text-blue-600">
                  {line.currentOutput.toLocaleString()} bottles/hour
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Efficiency</div>
                <div className="text-xl font-bold text-green-600">{line.efficiency}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className={`text-sm font-medium ${
                  line.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {line.isActive ? 'Running' : 'Stopped'}
                </div>
              </div>
            </div>

            {/* Production Speed Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Production Speed</span>
                <span className="text-sm font-medium">{line.speed}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustProductionSpeed(line.id, line.speed - 1)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  disabled={line.speed <= 1}
                >
                  -
                </button>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(line.speed / 10) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => adjustProductionSpeed(line.id, line.speed + 1)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  disabled={line.speed >= 10}
                >
                  +
                </button>
              </div>
            </div>

            {/* Maintenance Status */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  line.maintenanceStatus === 'good' ? 'bg-green-500' :
                  line.maintenanceStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-gray-600">
                  Maintenance: {line.maintenanceStatus}
                </span>
              </div>
              <div className="text-gray-600">
                Next service in: {line.nextMaintenance} hours
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Production Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Production Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {production.dailyProduction.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Bottles Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {production.averageEfficiency}%
            </div>
            <div className="text-sm text-gray-600">Average Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {production.uptime}%
            </div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionLines;