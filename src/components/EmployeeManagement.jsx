import React from 'react';
import { Users, TrendingUp, DollarSign, Award, UserPlus, BookOpen } from 'lucide-react';

const EmployeeManagement = ({ gameState, updateGameState }) => {
  // Add safety checks
  if (!gameState || !gameState.employees || !gameState.finance) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">Loading employee data...</div>
      </div>
    );
  }

  const { employees, finance } = gameState;

  const hireEmployee = (candidateIndex) => {
    const candidate = employees.hiring.available[candidateIndex];
    if (!candidate || finance.cash < candidate.hiringCost) return;

    updateGameState(prevState => ({
      ...prevState,
      employees: {
        ...prevState.employees,
        total: prevState.employees.total + 1,
        departments: {
          ...prevState.employees.departments,
          [candidate.department]: {
            ...prevState.employees.departments[candidate.department],
            workers: prevState.employees.departments[candidate.department].workers + 1,
            positions: prevState.employees.departments[candidate.department].positions.map(pos =>
              pos.name === candidate.position 
                ? { ...pos, count: pos.count + 1 }
                : pos
            )
          }
        },
        hiring: {
          ...prevState.employees.hiring,
          available: prevState.employees.hiring.available.filter((_, index) => index !== candidateIndex)
        },
        totalWageCost: prevState.employees.totalWageCost + (candidate.wage * 40 * 4) // Monthly cost
      },
      finance: {
        ...prevState.finance,
        cash: prevState.finance.cash - candidate.hiringCost
      }
    }));
  };

  const startTraining = (programIndex) => {
    const program = employees.training.programs[programIndex];
    if (!program || finance.cash < program.cost) return;

    updateGameState(prevState => ({
      ...prevState,
      finance: {
        ...prevState.finance,
        cash: prevState.finance.cash - program.cost
      }
    }));

    // Apply training benefits after duration (simplified for demo)
    setTimeout(() => {
      updateGameState(prevState => ({
        ...prevState,
        employees: {
          ...prevState.employees,
          satisfaction: Math.min(100, prevState.employees.satisfaction + 5)
        }
      }));
    }, 2000);
  };

  const DepartmentCard = ({ department, data }) => {
    const efficiencyColor = data.efficiency > 80 ? 'green' : data.efficiency > 60 ? 'yellow' : 'red';
    const moraleColor = data.morale > 75 ? 'green' : data.morale > 50 ? 'yellow' : 'red';
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">{department}</h3>
            <p className="text-sm text-gray-600">{data.workers} employees</p>
          </div>
          <Users className="text-blue-500" size={24} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600">Avg. Wage</div>
            <div className="text-lg font-bold text-green-600">${data.averageWage}/hr</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Skill Level</div>
            <div className="text-lg font-bold text-blue-600">{data.skillLevel.toFixed(1)}/5</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Efficiency</span>
              <span>{data.efficiency}%</span>
            </div>
            <div className="resource-bar">
              <div
                className={`resource-fill bg-${efficiencyColor}-500`}
                style={{ width: `${data.efficiency}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Morale</span>
              <span>{data.morale}%</span>
            </div>
            <div className="resource-bar">
              <div
                className={`resource-fill bg-${moraleColor}-500`}
                style={{ width: `${data.morale}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="text-sm font-medium text-gray-800 mb-2">Positions:</div>
          <div className="space-y-1">
            {data.positions.map((position, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{position.name}:</span>
                <span className="font-medium">{position.count} @ ${position.wage}/hr</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Employees</div>
          <div className="text-lg font-semibold text-blue-600">{employees.total}</div>
          <div className="text-sm text-gray-600">
            ${employees.totalWageCost.toLocaleString()}/month wages
          </div>
        </div>
      </div>

      {/* Employee Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{employees.total}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${employees.totalWageCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Wages</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              employees.satisfaction > 75 ? 'text-green-600' : 
              employees.satisfaction > 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {employees.satisfaction}%
            </div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{employees.turnoverRate}%</div>
            <div className="text-sm text-gray-600">Annual Turnover</div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Departments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(employees.departments).map(([dept, data]) => (
            <DepartmentCard key={dept} department={dept} data={data} />
          ))}
        </div>
      </div>

      {/* Hiring */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <UserPlus className="mr-2" size={20} />
          Available Candidates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {employees.hiring.available.map((candidate, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="font-medium text-gray-800 mb-2">{candidate.name}</div>
              <div className="text-sm text-gray-600 mb-3">
                {candidate.department} • {candidate.position}
              </div>
              <div className="space-y-1 text-sm mb-3">
                <div className="flex justify-between">
                  <span>Wage:</span>
                  <span className="font-medium">${candidate.wage}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Skill Level:</span>
                  <span className="font-medium">{candidate.skill}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Hiring Cost:</span>
                  <span className="font-medium">${candidate.hiringCost}</span>
                </div>
              </div>
              <div className="text-xs text-green-600 mb-3">{candidate.benefits}</div>
              <button
                onClick={() => hireEmployee(index)}
                disabled={finance.cash < candidate.hiringCost}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  finance.cash >= candidate.hiringCost
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {finance.cash >= candidate.hiringCost ? 'Hire' : 'Insufficient Funds'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Training Programs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="mr-2" size={20} />
          Training Programs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {employees.training.programs.map((program, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="font-medium text-gray-800 mb-2">{program.name}</div>
              <div className="space-y-1 text-sm mb-3">
                <div className="flex justify-between">
                  <span>Cost:</span>
                  <span className="font-medium">${program.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{program.duration} days</span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  For: {program.requirement}
                </div>
              </div>
              <div className="text-xs text-green-600 mb-3">{program.benefits}</div>
              <button
                onClick={() => startTraining(index)}
                disabled={finance.cash < program.cost}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  finance.cash >= program.cost
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {finance.cash >= program.cost ? 'Start Training' : 'Insufficient Funds'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Benefits */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="mr-2" size={20} />
          Employee Benefits & Policies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Health Insurance</span>
              <div className={`w-3 h-3 rounded-full ${
                employees.benefits.healthInsurance ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="text-sm text-gray-600">
              {employees.benefits.healthInsurance ? 'Provided' : 'Not provided'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Cost: $200/employee/month
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Paid Time Off</span>
              <div className={`w-3 h-3 rounded-full ${
                employees.benefits.paidTimeOff ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="text-sm text-gray-600">
              {employees.benefits.paidTimeOff ? '2 weeks/year' : 'Not provided'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Impact: +10% morale
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Performance Bonus</span>
              <div className={`w-3 h-3 rounded-full ${
                employees.benefits.performanceBonus ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="text-sm text-gray-600">
              {employees.benefits.performanceBonus ? 'Up to 10%' : 'Not offered'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Impact: +15% productivity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;