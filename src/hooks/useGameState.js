import { useState, useEffect } from 'react';

const initialGameState = {
  // Start with a small, struggling factory
  production: {
    lines: [
      {
        id: 1,
        name: 'Basic Line A',
        type: 'Manual Bottling',
        level: 1,
        isActive: true,
        currentOutput: 500, // Much lower starting output
        maxOutput: 800,
        efficiency: 65, // Lower starting efficiency
        speed: 3, // Slower initial speed
        maintenanceStatus: 'warning', // Needs attention
        nextMaintenance: 12,
        operatingCost: 150 // Cost per hour to run
      },
      {
        id: 2,
        name: 'Basic Line B',
        type: 'Manual Bottling',
        level: 1,
        isActive: false, // Start with only one line active
        currentOutput: 0,
        maxOutput: 800,
        efficiency: 0,
        speed: 3,
        maintenanceStatus: 'critical', // Broken down
        nextMaintenance: 0,
        operatingCost: 150
      }
    ],
    totalCapacity: 1600,
    dailyProduction: 8000, // Much lower starting production
    totalBottlesProduced: 15000, // Start with some history
    averageEfficiency: 65,
    uptime: 78, // Lower uptime due to maintenance issues
    productionRate: 0 // Bottles per minute
  },
  
  // Limited starting resources - forces immediate decisions
  resources: {
    water: {
      name: 'Municipal Water',
      current: 15000, // Only 1.25 days supply
      capacity: 25000,
      unit: 'Liters',
      dailyUsage: 12000,
      cost: 0.003, // Higher cost for municipal water
      ordered: 0,
      daysLeft: 1.25,
      supplier: 'City Water Department',
      quality: 'Basic'
    },
    bottles: {
      name: 'Basic Plastic Bottles',
      current: 5000, // Very low stock
      capacity: 15000,
      unit: 'Units',
      dailyUsage: 8000,
      cost: 0.08, // Higher cost for small orders
      ordered: 0,
      daysLeft: 0.6,
      supplier: 'Local Plastics Co.',
      quality: 'Standard'
    },
    caps: {
      name: 'Standard Caps',
      current: 6000,
      capacity: 20000,
      unit: 'Units',
      dailyUsage: 8000,
      cost: 0.015,
      ordered: 0,
      daysLeft: 0.75,
      supplier: 'Cap Solutions Ltd.',
      quality: 'Basic'
    },
    labels: {
      name: 'Basic Labels',
      current: 7000,
      capacity: 18000,
      unit: 'Units',
      dailyUsage: 8000,
      cost: 0.025,
      ordered: 0,
      daysLeft: 0.9,
      supplier: 'Print & Label Co.',
      quality: 'Standard'
    },
    filters: {
      name: 'Basic Water Filters',
      current: 2, // Critical shortage
      capacity: 10,
      unit: 'Units',
      dailyUsage: 0.5,
      cost: 85,
      ordered: 0,
      daysLeft: 4,
      supplier: 'Filter Tech Inc.',
      quality: 'Basic'
    },
    totalValue: 25000
  },

  // Small market presence - room to grow
  market: {
    marketShare: 2.1, // Very small starting share
    totalRevenue: 18000, // Much lower revenue
    unitsSold: 8000,
    averagePrice: 2.25,
    competitionLevel: 'Very High',
    customerSatisfaction: 72, // Room for improvement
    brandRecognition: 15, // Low brand awareness
    products: [
      {
        name: 'Al Rawdatain Basic',
        type: 'standard',
        size: '500ml',
        price: 2.25,
        marketPrice: 2.40,
        dailySales: 8000,
        marketShare: 2.1,
        demand: 45, // Low demand
        demandTrend: -2,
        profitMargin: 0.52
      }
    ],
    trends: [
      {
        title: 'New Competitor Entry',
        description: 'Large corporation entered local market',
        impact: 'negative',
        change: '-8%',
        duration: '6 months'
      },
      {
        title: 'Quality Concerns',
        description: 'Recent quality issues affecting reputation',
        impact: 'negative',
        change: '-12%',
        duration: '3 months'
      }
    ],
    regions: [
      { name: 'Local Area', marketShare: 2.1, growth: -1.2, revenue: 18000 }
    ]
  },

  // Tight finances - realistic startup situation
  finance: {
    cash: 45000, // Limited starting capital
    dailyRevenue: 18000,
    dailyExpenses: 16200, // Thin margins
    netProfit: 1800, // Small profit margin
    cashChange: -2.1, // Declining cash
    revenueChange: -3.4,
    expenseChange: 1.8,
    profitChange: -15.2,
    monthlyLoanPayment: 3500, // Existing debt
    creditLimit: 25000, // Available credit line
    revenueBreakdown: [
      { category: 'Basic Water Sales', amount: 18000, percentage: 100, color: '#3B82F6' }
    ],
    expenseBreakdown: [
      { category: 'Raw Materials', amount: 8500, percentage: 52, color: '#EF4444' },
      { category: 'Labor', amount: 3200, percentage: 20, color: '#8B5CF6' },
      { category: 'Utilities', amount: 2100, percentage: 13, color: '#F97316' },
      { category: 'Maintenance', amount: 1400, percentage: 9, color: '#06B6D4' },
      { category: 'Loan Payment', amount: 1000, percentage: 6, color: '#84CC16' }
    ],
    cashFlowProjection: [
      { date: 'Today', income: 18000, expenses: 16200, netFlow: 1800 },
      { date: 'Tomorrow', income: 17500, expenses: 16400, netFlow: 1100 },
      { date: 'Day 3', income: 17200, expenses: 16600, netFlow: 600 },
      { date: 'Day 4', income: 16800, expenses: 16800, netFlow: 0 },
      { date: 'Day 5', income: 16500, expenses: 17000, netFlow: -500 },
      { date: 'Day 6', income: 16200, expenses: 17200, netFlow: -1000 },
      { date: 'Day 7', income: 15800, expenses: 17400, netFlow: -1600 }
    ],
    ratios: {
      grossMargin: 47,
      netMargin: 10,
      roi: 4.2,
      costPerUnit: 2.03,
      revenuePerUnit: 2.25,
      breakEven: 7200,
      revenueGrowth: -3.4,
      profitGrowth: -15.2,
      marketGrowth: 1.8
    }
  },

  // Quality issues that need addressing
  quality: {
    overallScore: 76, // Poor starting quality
    waterPurity: 96.2, // Below premium standards
    bottleIntegrity: 94.1,
    labelAccuracy: 89.5, // Poor labeling
    fillLevel: 91.8,
    capSeal: 93.2,
    contamination: 0.8, // High contamination
    recentTests: [
      {
        testType: 'Microbiological Analysis',
        batchNumber: 'B2024-0115-001',
        result: 'warning',
        timestamp: '2024-01-15 14:30'
      },
      {
        testType: 'Chemical Composition',
        batchNumber: 'B2024-0115-002',
        result: 'pass',
        timestamp: '2024-01-15 12:15'
      },
      {
        testType: 'Physical Properties',
        batchNumber: 'B2024-0114-003',
        result: 'fail',
        timestamp: '2024-01-14 16:45'
      }
    ],
    certifications: [
      { name: 'Basic Health Permit', status: 'active', expiryDate: '2024-06-30' },
      { name: 'Local Business License', status: 'active', expiryDate: '2024-12-31' }
    ],
    improvementActions: [
      {
        title: 'Install Basic Filtration',
        description: 'Add basic water filtration system',
        cost: 8500,
        impact: 3,
        timeToImplement: '2 weeks'
      },
      {
        title: 'Staff Training',
        description: 'Basic quality control training',
        cost: 2500,
        impact: 2,
        timeToImplement: '1 week'
      },
      {
        title: 'Equipment Calibration',
        description: 'Calibrate filling and capping machines',
        cost: 1200,
        impact: 4,
        timeToImplement: '3 days'
      }
    ],
    trends: {
      defectRate: 4.2, // High defect rate
      customerComplaints: 28,
      testsPassed: 76.8
    }
  },

  // Limited upgrade options - must earn better equipment
  upgrades: {
    purchased: [], // Start with no upgrades
    available: [
      {
        id: 'basic-maintenance',
        name: 'Basic Maintenance Kit',
        category: 'maintenance',
        description: 'Essential tools and parts for basic equipment maintenance',
        cost: 3500,
        benefits: ['+10% uptime', '-20% maintenance costs', 'Prevent breakdowns'],
        requirements: null,
        timeToInstall: '1 day'
      },
      {
        id: 'water-testing-kit',
        name: 'Water Testing Equipment',
        category: 'quality',
        description: 'Basic equipment for testing water quality',
        cost: 2800,
        benefits: ['+5% quality score', 'Early contamination detection', 'Compliance monitoring'],
        requirements: null,
        timeToInstall: '2 days'
      },
      {
        id: 'backup-generator',
        name: 'Backup Power Generator',
        category: 'reliability',
        description: 'Prevents production loss during power outages',
        cost: 12000,
        benefits: ['+15% uptime', 'Prevent spoilage', 'Continuous operation'],
        requirements: null,
        timeToInstall: '1 week'
      },
      {
        id: 'inventory-system',
        name: 'Basic Inventory Tracking',
        category: 'efficiency',
        description: 'Simple system to track raw materials and finished goods',
        cost: 4500,
        benefits: ['-15% waste', 'Better planning', 'Cost tracking'],
        requirements: null,
        timeToInstall: '3 days'
      }
    ],
    research: [
      {
        name: 'Semi-Automated Line',
        description: 'Upgrade to semi-automated bottling equipment',
        researchCost: 25000,
        timeToUnlock: '90 days',
        progress: 0,
        requirements: 'Basic operations stable for 60 days'
      },
      {
        name: 'Premium Water Source',
        description: 'Access to premium spring water supply',
        researchCost: 18000,
        timeToUnlock: '45 days',
        progress: 0,
        requirements: 'Quality score above 85%'
      }
    ],
    totalBenefits: {
      productionBoost: 0,
      efficiencyBoost: 0,
      qualityBoost: 0,
      costReduction: 0
    }
  },

  // Game progression tracking
  gameProgress: {
    daysPassed: 0,
    decisionsToday: 0,
    totalDecisions: 0,
    startTime: Date.now(),
    lastSave: Date.now(),
    milestones: {
      firstProfit: false,
      firstUpgrade: false,
      qualityImprovement: false,
      marketExpansion: false,
      debtFree: false
    },
    challenges: [
      {
        id: 'cash_crisis',
        title: 'Cash Flow Crisis',
        description: 'Maintain positive cash flow for 7 consecutive days',
        progress: 0,
        target: 7,
        reward: 5000,
        active: true
      },
      {
        id: 'quality_boost',
        title: 'Quality Improvement',
        description: 'Increase overall quality score to 85%',
        progress: 76,
        target: 85,
        reward: 'Premium Supplier Access',
        active: true
      }
    ]
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem('alRawdatainFactoryState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Ensure new properties exist in loaded state
        setGameState({
          ...initialGameState,
          ...parsed,
          gameProgress: {
            ...initialGameState.gameProgress,
            ...parsed.gameProgress
          }
        });
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const saveTimer = setInterval(() => {
      localStorage.setItem('alRawdatainFactoryState', JSON.stringify(gameState));
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveTimer);
  }, [gameState]);

  // Realistic game simulation - runs every minute (real time)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        
        // Calculate production per minute
        let totalProduction = 0;
        let totalOperatingCost = 0;
        
        newState.production.lines.forEach(line => {
          if (line.isActive && line.maintenanceStatus !== 'critical') {
            // Production rate: bottles per minute
            const baseRate = (line.currentOutput * line.efficiency / 100) / 60; // Convert hourly to per minute
            const speedMultiplier = line.speed / 5; // Speed affects output
            const productionRate = baseRate * speedMultiplier;
            
            totalProduction += productionRate;
            totalOperatingCost += line.operatingCost / 60; // Convert hourly cost to per minute
            
            // Gradual efficiency degradation without maintenance
            if (line.nextMaintenance > 0) {
              line.nextMaintenance -= 1/60; // Decrease by 1 minute
              if (line.nextMaintenance <= 0) {
                line.maintenanceStatus = 'critical';
                line.efficiency = Math.max(30, line.efficiency - 20);
              }
            }
          }
        });
        
        newState.production.productionRate = totalProduction;
        newState.production.totalBottlesProduced += totalProduction;
        
        // Update resources consumption (per minute)
        const minutelyConsumption = totalProduction;
        Object.keys(newState.resources).forEach(resourceKey => {
          if (resourceKey !== 'totalValue') {
            const resource = newState.resources[resourceKey];
            let consumption = 0;
            
            // Different consumption rates based on resource type
            switch (resourceKey) {
              case 'water':
                consumption = minutelyConsumption * 1.5; // 1.5L per bottle
                break;
              case 'bottles':
              case 'caps':
              case 'labels':
                consumption = minutelyConsumption; // 1:1 ratio
                break;
              case 'filters':
                consumption = minutelyConsumption * 0.0001; // Filters last longer
                break;
            }
            
            resource.current = Math.max(0, resource.current - consumption);
            resource.daysLeft = resource.current / (resource.dailyUsage || 1);
            
            // Production stops if critical resources run out
            if ((resourceKey === 'water' || resourceKey === 'bottles' || resourceKey === 'caps') && resource.current <= 0) {
              newState.production.lines.forEach(line => {
                line.isActive = false;
              });
            }
          }
        });
        
        // Update finances (per minute)
        const minutelyRevenue = (newState.finance.dailyRevenue / (24 * 60)) * (totalProduction / (newState.production.dailyProduction / (24 * 60)));
        const minutelyExpenses = (newState.finance.dailyExpenses / (24 * 60)) + (totalOperatingCost / 60);
        
        newState.finance.cash += (minutelyRevenue - minutelyExpenses);
        newState.finance.netProfit = newState.finance.dailyRevenue - newState.finance.dailyExpenses;
        
        // Update game progress
        newState.gameProgress.daysPassed = (Date.now() - newState.gameProgress.startTime) / (1000 * 60 * 60 * 24);
        
        // Check for bankruptcy
        if (newState.finance.cash < -newState.finance.creditLimit) {
          // Game over scenario - could trigger restart or loan options
          console.log('Bankruptcy warning!');
        }
        
        // Update quality based on production conditions
        if (totalProduction > 0) {
          // Quality degrades with poor maintenance and resource shortages
          const maintenanceQuality = newState.production.lines.reduce((avg, line) => {
            const qualityImpact = line.maintenanceStatus === 'good' ? 1 : 
                                line.maintenanceStatus === 'warning' ? 0.95 : 0.85;
            return avg + qualityImpact;
          }, 0) / newState.production.lines.length;
          
          const resourceQuality = Math.min(
            newState.resources.water.daysLeft > 1 ? 1 : 0.9,
            newState.resources.filters.current > 1 ? 1 : 0.85
          );
          
          newState.quality.overallScore = Math.max(60, 
            newState.quality.overallScore * 0.999 + // Gradual degradation
            (maintenanceQuality * resourceQuality * 100) * 0.001 // Improvement factor
          );
        }
        
        return newState;
      });
    }, 60000); // Update every minute (real time)

    return () => clearInterval(interval);
  }, []);

  const updateGameState = (updater) => {
    setGameState(prevState => {
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      
      // Track decisions
      if (newState.gameProgress) {
        newState.gameProgress.decisionsToday += 1;
        newState.gameProgress.totalDecisions += 1;
      }
      
      return newState;
    });
  };

  const resetGame = () => {
    localStorage.removeItem('alRawdatainFactoryState');
    setGameState({
      ...initialGameState,
      gameProgress: {
        ...initialGameState.gameProgress,
        startTime: Date.now()
      }
    });
  };

  return { gameState, updateGameState, resetGame };
};