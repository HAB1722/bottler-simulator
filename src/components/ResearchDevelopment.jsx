import React from 'react';
import { Beaker, Lightbulb, TrendingUp, Clock, DollarSign, CheckCircle } from 'lucide-react';

const ResearchDevelopment = ({ gameState, updateGameState }) => {
  // Add safety checks
  if (!gameState || !gameState.research || !gameState.finance) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">Loading research data...</div>
      </div>
    );
  }

  const { research, finance } = gameState;

  const startResearchProject = (projectId) => {
    const project = research.availableProjects.find(p => p.id === projectId);
    if (!project || finance.cash < project.cost) return;

    updateGameState(prevState => ({
      ...prevState,
      research: {
        ...prevState.research,
        currentProjects: [...prevState.research.currentProjects, {
          ...project,
          startDate: Date.now(),
          progress: 0
        }],
        availableProjects: prevState.research.availableProjects.filter(p => p.id !== projectId)
      },
      finance: {
        ...prevState.finance,
        cash: prevState.finance.cash - project.cost
      }
    }));
  };

  const adjustResearchBudget = (amount) => {
    updateGameState(prevState => ({
      ...prevState,
      research: {
        ...prevState.research,
        monthlyBudget: Math.max(0, amount)
      }
    }));
  };

  const ProjectCard = ({ project, isActive = false, isCompleted = false }) => {
    const canAfford = finance.cash >= project.cost;
    
    return (
      <div className={`border-2 rounded-lg p-6 transition-all duration-200 ${
        isCompleted ? 'border-green-200 bg-green-50' :
        isActive ? 'border-blue-200 bg-blue-50' :
        canAfford ? 'border-gray-200 hover:border-blue-300' : 'border-gray-200 opacity-60'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${
              isCompleted ? 'bg-green-100' :
              isActive ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {project.category === 'quality' && <CheckCircle className="text-green-600" size={20} />}
              {project.category === 'efficiency' && <TrendingUp className="text-blue-600" size={20} />}
              {project.category === 'sustainability' && <Beaker className="text-purple-600" size={20} />}
              {project.category === 'marketing' && <Lightbulb className="text-orange-600" size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{project.category}</p>
            </div>
          </div>
          {isCompleted && (
            <div className="text-green-600 text-sm font-medium">COMPLETED</div>
          )}
          {isActive && (
            <div className="text-blue-600 text-sm font-medium">IN PROGRESS</div>
          )}
        </div>

        <p className="text-gray-700 mb-4">{project.description}</p>

        <div className="space-y-2 mb-4">
          <div className="text-sm font-medium text-gray-800">Benefits:</div>
          {project.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {project.unlocks && project.unlocks.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-800 mb-1">Unlocks:</div>
            <div className="text-sm text-purple-600">
              {project.unlocks.join(', ')}
            </div>
          </div>
        )}

        {isActive && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(project.progress)}%</span>
            </div>
            <div className="resource-bar">
              <div
                className="resource-fill bg-blue-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {Math.round((100 - project.progress) * project.duration / 100)} days remaining
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-green-600">
              ${project.cost.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              ${project.dailyCost}/day for {project.duration} days
            </div>
            {project.requirements && (
              <div className="text-xs text-gray-500 mt-1">
                Requires: {project.requirements}
              </div>
            )}
          </div>
          {!isActive && !isCompleted && (
            <button
              onClick={() => startResearchProject(project.id)}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                canAfford
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAfford ? 'Start Research' : 'Insufficient Funds'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const categories = ['quality', 'efficiency', 'sustainability', 'marketing'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Research & Development</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">R&D Budget</div>
          <div className="text-lg font-semibold text-blue-600">
            ${research.monthlyBudget.toLocaleString()}/month
          </div>
        </div>
      </div>

      {/* R&D Budget Control */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="mr-2" size={20} />
          Research Budget Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${research.monthlyBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {research.completed.length}
            </div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {research.currentProjects.length}
            </div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">Adjust Monthly R&D Budget</div>
          <div className="flex space-x-2">
            <button
              onClick={() => adjustResearchBudget(research.monthlyBudget - 1000)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
            >
              -$1,000
            </button>
            <button
              onClick={() => adjustResearchBudget(research.monthlyBudget + 1000)}
              className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 text-sm"
            >
              +$1,000
            </button>
            <button
              onClick={() => adjustResearchBudget(research.monthlyBudget + 5000)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
            >
              +$5,000
            </button>
          </div>
        </div>
      </div>

      {/* Active Research Projects */}
      {research.currentProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Active Research Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {research.currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} isActive={true} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Research */}
      {research.completed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Research</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {research.completed.map((project) => (
              <ProjectCard key={project.id} project={project} isCompleted={true} />
            ))}
          </div>
        </div>
      )}

      {/* Available Research Projects by Category */}
      {categories.map((category) => {
        const categoryProjects = research.availableProjects.filter(p => p.category === category);
        if (categoryProjects.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize flex items-center">
              {category === 'quality' && <CheckCircle className="mr-2 text-green-600" size={20} />}
              {category === 'efficiency' && <TrendingUp className="mr-2 text-blue-600" size={20} />}
              {category === 'sustainability' && <Beaker className="mr-2 text-purple-600" size={20} />}
              {category === 'marketing' && <Lightbulb className="mr-2 text-orange-600" size={20} />}
              {category} Research
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Research Benefits Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Research Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{research.technologies.benefits.qualityBonus}%
            </div>
            <div className="text-sm text-gray-600">Quality Bonus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              +{research.technologies.benefits.efficiencyBonus}%
            </div>
            <div className="text-sm text-gray-600">Efficiency Bonus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              -{research.technologies.benefits.costReduction}%
            </div>
            <div className="text-sm text-gray-600">Cost Reduction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              +{research.technologies.benefits.marketingBonus}%
            </div>
            <div className="text-sm text-gray-600">Marketing Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchDevelopment;