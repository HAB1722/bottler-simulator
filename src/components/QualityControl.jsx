import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Award } from 'lucide-react';

const QualityControl = ({ gameState, updateGameState }) => {
  const { quality } = gameState;

  const QualityMetric = ({ title, value, target, status, unit = '%' }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'excellent': return 'green';
        case 'good': return 'blue';
        case 'warning': return 'yellow';
        case 'critical': return 'red';
        default: return 'gray';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'excellent': return <CheckCircle className="text-green-500" size={20} />;
        case 'good': return <CheckCircle className="text-blue-500" size={20} />;
        case 'warning': return <AlertCircle className="text-yellow-500" size={20} />;
        case 'critical': return <XCircle className="text-red-500" size={20} />;
        default: return <div className="w-5 h-5 bg-gray-400 rounded-full" />;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {getStatusIcon(status)}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Current</span>
            <span>Target: {target}{unit}</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {value}{unit}
          </div>
          <div className="resource-bar">
            <div
              className={`resource-fill bg-${getStatusColor(status)}-500`}
              style={{ width: `${Math.min(100, (value / target) * 100)}%` }}
            />
          </div>
        </div>

        <div className={`text-sm font-medium text-${getStatusColor(status)}-600 capitalize`}>
          {status}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quality Control</h2>
        <div className="flex items-center space-x-2">
          <Award className="text-yellow-500" size={24} />
          <span className="text-lg font-semibold text-gray-800">
            Overall Score: {quality.overallScore}%
          </span>
        </div>
      </div>

      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QualityMetric
          title="Water Purity"
          value={quality.waterPurity}
          target={99.9}
          status={quality.waterPurity >= 99.5 ? 'excellent' : quality.waterPurity >= 99 ? 'good' : 'warning'}
        />
        <QualityMetric
          title="Bottle Integrity"
          value={quality.bottleIntegrity}
          target={99.5}
          status={quality.bottleIntegrity >= 99 ? 'excellent' : quality.bottleIntegrity >= 97 ? 'good' : 'warning'}
        />
        <QualityMetric
          title="Label Accuracy"
          value={quality.labelAccuracy}
          target={100}
          status={quality.labelAccuracy >= 99.5 ? 'excellent' : quality.labelAccuracy >= 98 ? 'good' : 'warning'}
        />
        <QualityMetric
          title="Fill Level"
          value={quality.fillLevel}
          target={100}
          status={quality.fillLevel >= 99 ? 'excellent' : quality.fillLevel >= 97 ? 'good' : 'warning'}
        />
        <QualityMetric
          title="Cap Seal"
          value={quality.capSeal}
          target={100}
          status={quality.capSeal >= 99.5 ? 'excellent' : quality.capSeal >= 98 ? 'good' : 'warning'}
        />
        <QualityMetric
          title="Contamination"
          value={quality.contamination}
          target={0}
          status={quality.contamination <= 0.1 ? 'excellent' : quality.contamination <= 0.5 ? 'good' : 'critical'}
          unit="ppm"
        />
      </div>

      {/* Quality Tests */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Quality Tests</h3>
        <div className="space-y-4">
          {quality.recentTests.map((test, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  test.result === 'pass' ? 'bg-green-500' :
                  test.result === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="font-medium">{test.testType}</div>
                  <div className="text-sm text-gray-600">Batch #{test.batchNumber}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  test.result === 'pass' ? 'text-green-600' :
                  test.result === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {test.result.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">{test.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications & Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quality.certifications.map((cert, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-800">{cert.name}</div>
                <div className={`w-3 h-3 rounded-full ${
                  cert.status === 'active' ? 'bg-green-500' :
                  cert.status === 'expiring' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Expires: {cert.expiryDate}
              </div>
              <div className={`text-xs font-medium ${
                cert.status === 'active' ? 'text-green-600' :
                cert.status === 'expiring' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {cert.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Improvement Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Improvement Actions</h3>
        <div className="space-y-3">
          {quality.improvementActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">{action.title}</div>
                <div className="text-sm text-gray-600">{action.description}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">
                  Cost: ${action.cost.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Impact: +{action.impact}% quality
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Trends */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Trends (Last 30 Days)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {quality.trends.defectRate}%
            </div>
            <div className="text-sm text-gray-600">Defect Rate</div>
            <div className="text-xs text-green-600">↓ 0.3% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {quality.trends.customerComplaints}
            </div>
            <div className="text-sm text-gray-600">Customer Complaints</div>
            <div className="text-xs text-red-600">↑ 2 from last month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {quality.trends.testsPassed}%
            </div>
            <div className="text-sm text-gray-600">Tests Passed</div>
            <div className="text-xs text-green-600">↑ 1.2% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControl;