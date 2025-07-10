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
    totalValue: 25000,
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
    }
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

  // Add missing data structures for new features
  profitLoss: {
    revenue: {
      productSales: 16000,
      premiumSales: 2000,
      contractSales: 0,
      total: 18000
    },
    expenses: {
      rawMaterials: 8500,
      labor: 3200,
      utilities: 2100,
      maintenance: 1400,
      loanPayments: 1000,
      research: 0,
      insurance: 500,
      rent: 1500,
      total: 18200
    },
    grossProfit: 9500,
    netProfit: -200,
    margins: {
      gross: 52.8,
      net: -1.1
    }
  },

  loans: {
    totalDebt: 85000,
    monthlyPayments: 3500,
    creditScore: 650,
    active: [
      {
        name: 'Equipment Loan',
        remainingBalance: 45000,
        monthlyPayment: 2000,
        interestRate: 8.5,
        remainingMonths: 24,
        termMonths: 36
      },
      {
        name: 'Working Capital Line',
        remainingBalance: 40000,
        monthlyPayment: 1500,
        interestRate: 12.0,
        remainingMonths: 30,
        termMonths: 36
      }
    ],
    available: [
      {
        id: 'expansion',
        name: 'Expansion Loan',
        description: 'Fund factory expansion and new equipment',
        maxAmount: 150000,
        interestRate: 9.5,
        termMonths: 60,
        requirements: 'Credit score 600+, 6 months operating history'
      },
      {
        id: 'equipment',
        name: 'Equipment Financing',
        description: 'Purchase new production equipment',
        maxAmount: 75000,
        interestRate: 7.5,
        termMonths: 48,
        requirements: 'Equipment as collateral'
      },
      {
        id: 'emergency',
        name: 'Emergency Credit Line',
        description: 'Short-term working capital',
        maxAmount: 25000,
        interestRate: 15.0,
        termMonths: 12,
        requirements: 'Active business license'
      }
    ]
  },

  research: {
    monthlyBudget: 2000,
    currentProjects: [],
    completed: [],
    availableProjects: [
      {
        id: 'water-filtration',
        name: 'Advanced Water Filtration',
        category: 'quality',
        description: 'Develop superior water purification technology',
        cost: 15000,
        dailyCost: 500,
        duration: 30,
        benefits: ['+10% water purity', '+5% overall quality', 'Reduced contamination risk'],
        unlocks: ['Premium Water Certification'],
        requirements: null
      },
      {
        id: 'automation-basic',
        name: 'Basic Automation',
        category: 'efficiency',
        description: 'Implement basic automated bottling systems',
        cost: 25000,
        dailyCost: 800,
        duration: 45,
        benefits: ['+20% production speed', '+15% efficiency', 'Reduced labor costs'],
        unlocks: ['Semi-Automated Production Line'],
        requirements: null
      },
      {
        id: 'eco-packaging',
        name: 'Eco-Friendly Packaging',
        category: 'sustainability',
        description: 'Research biodegradable bottle materials',
        cost: 12000,
        dailyCost: 400,
        duration: 25,
        benefits: ['+15% market appeal', 'Environmental certification', 'Premium pricing'],
        unlocks: ['Green Product Line'],
        requirements: null
      },
      {
        id: 'brand-development',
        name: 'Brand Development',
        category: 'marketing',
        description: 'Develop stronger brand identity and marketing',
        cost: 8000,
        dailyCost: 300,
        duration: 20,
        benefits: ['+10% market share growth', '+5% price premium', 'Customer loyalty'],
        unlocks: ['Premium Branding'],
        requirements: null
      }
    ],
    technologies: {
      benefits: {
        qualityBonus: 0,
        efficiencyBonus: 0,
        costReduction: 0,
        marketingBonus: 0
      }
    }
  },

  employees: {
    total: 12,
    totalWageCost: 28800, // Monthly
    satisfaction: 68,
    turnoverRate: 15,
    departments: {
      production: {
        workers: 8,
        averageWage: 18,
        skillLevel: 2.8,
        efficiency: 72,
        morale: 65,
        positions: [
          { name: 'Line Operator', count: 6, wage: 16 },
          { name: 'Quality Inspector', count: 1, wage: 22 },
          { name: 'Maintenance Tech', count: 1, wage: 24 }
        ]
      },
      management: {
        workers: 2,
        averageWage: 35,
        skillLevel: 3.5,
        efficiency: 80,
        morale: 75,
        positions: [
          { name: 'Production Manager', count: 1, wage: 40 },
          { name: 'Shift Supervisor', count: 1, wage: 30 }
        ]
      },
      support: {
        workers: 2,
        averageWage: 20,
        skillLevel: 3.0,
        efficiency: 70,
        morale: 70,
        positions: [
          { name: 'Administrative Assistant', count: 1, wage: 18 },
          { name: 'Security Guard', count: 1, wage: 22 }
        ]
      }
    },
    hiring: {
      available: [
        {
          name: 'Maria Rodriguez',
          department: 'production',
          position: 'Line Operator',
          wage: 17,
          skill: 3,
          hiringCost: 500,
          benefits: '+5% line efficiency when hired'
        },
        {
          name: 'Ahmed Hassan',
          department: 'production',
          position: 'Quality Inspector',
          wage: 24,
          skill: 4,
          hiringCost: 800,
          benefits: '+3% quality score improvement'
        },
        {
          name: 'Jennifer Chen',
          department: 'management',
          position: 'Operations Manager',
          wage: 45,
          skill: 4,
          hiringCost: 2000,
          benefits: '+10% overall efficiency'
        }
      ]
    },
    training: {
      programs: [
        {
          name: 'Safety Training',
          cost: 1500,
          duration: 3,
          requirement: 'All production workers',
          benefits: '+5% morale, -20% accident risk'
        },
        {
          name: 'Quality Control Certification',
          cost: 3000,
          duration: 7,
          requirement: 'Quality inspectors',
          benefits: '+8% quality score, +10% efficiency'
        },
        {
          name: 'Leadership Development',
          cost: 5000,
          duration: 14,
          requirement: 'Management staff',
          benefits: '+15% team efficiency, +10% morale'
        }
      ]
    },
    benefits: {
      healthInsurance: false,
      paidTimeOff: false,
      performanceBonus: false
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

  // Track last notification times to prevent spam
  const [lastNotifications, setLastNotifications] = useState({});

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
          // Ensure all nested objects exist
          gameProgress: {
            ...initialGameState.gameProgress,
            ...(parsed.gameProgress || {})
          },
          production: {
            ...initialGameState.production,
            ...(parsed.production || {})
          },
          finance: {
            ...initialGameState.finance,
            ...(parsed.finance || {})
          },
          resources: {
            ...initialGameState.resources,
            ...(parsed.resources || {})
          },
          quality: {
            ...initialGameState.quality,
            ...(parsed.quality || {})
          },
          market: {
            ...initialGameState.market,
            ...(parsed.market || {})
          },
          upgrades: {
            ...initialGameState.upgrades,
            ...(parsed.upgrades || {})
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
        // Prevent updates if state is corrupted
        if (!prevState || !prevState.production || !prevState.finance) {
          return prevState;
        }
        
        const newState = { ...prevState };
        
        // Calculate production per minute
        let totalProduction = 0;
        let totalOperatingCost = 0;
        
        newState.production.lines.forEach(line => {
          if (line.isActive && line.maintenanceStatus !== 'critical') {
            // Production rate: bottles per minute
            const baseRate = ((line.currentOutput || 0) * (line.efficiency || 0) / 100) / 60;
            const speedMultiplier = (line.speed || 1) / 5;
            const productionRate = baseRate * speedMultiplier;
            
            totalProduction += productionRate;
            totalOperatingCost += (line.operatingCost || 0) / 60;
            
            // Gradual efficiency degradation without maintenance
            if ((line.nextMaintenance || 0) > 0) {
              line.nextMaintenance -= 1/60; // Decrease by 1 minute
              if (line.nextMaintenance <= 0) {
                line.maintenanceStatus = 'critical';
                line.efficiency = Math.max(30, (line.efficiency || 0) - 20);
              }
            }
          }
        });
        
        newState.production.productionRate = totalProduction;
        newState.production.totalBottlesProduced += totalProduction;
        
        // Update resources consumption (per minute)
        const minutelyConsumption = totalProduction;
        Object.keys(newState.resources || {}).forEach(resourceKey => {
          if (resourceKey !== 'totalValue') {
            const resource = newState.resources[resourceKey];
            if (!resource) return;
            
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
            
            resource.current = Math.max(0, (resource.current || 0) - consumption);
            resource.daysLeft = (resource.current || 0) / (resource.dailyUsage || 1);
            
            // Production stops if critical resources run out
            if ((resourceKey === 'water' || resourceKey === 'bottles' || resourceKey === 'caps') && (resource.current || 0) <= 0) {
              (newState.production.lines || []).forEach(line => {
                line.isActive = false;
              });
            }
          }
        });
        
        // Update finances (per minute)
        const minutelyRevenue = ((newState.finance.dailyRevenue || 0) / (24 * 60)) * (totalProduction / ((newState.production.dailyProduction || 1) / (24 * 60)));
        const minutelyExpenses = ((newState.finance.dailyExpenses || 0) / (24 * 60)) + (totalOperatingCost / 60) + 
                                ((newState.employees?.totalWageCost || 0) / (30 * 24 * 60)) + // Employee wages
                                ((newState.research?.monthlyBudget || 0) / (30 * 24 * 60)) + // R&D costs
                                ((newState.loans?.monthlyPayments || 0) / (30 * 24 * 60)); // Loan payments
        
        newState.finance.cash = (newState.finance.cash || 0) + (minutelyRevenue - minutelyExpenses);
        newState.finance.netProfit = (newState.finance.dailyRevenue || 0) - (newState.finance.dailyExpenses || 0);
        
        // Update P&L statement
        if (newState.profitLoss) {
          newState.profitLoss.revenue.total = newState.finance.dailyRevenue || 0;
          newState.profitLoss.expenses.labor = newState.employees?.totalWageCost || 0;
          newState.profitLoss.expenses.research = newState.research?.monthlyBudget || 0;
          newState.profitLoss.expenses.loanPayments = newState.loans?.monthlyPayments || 0;
          newState.profitLoss.expenses.total = Object.values(newState.profitLoss.expenses).reduce((sum, val) => sum + (val || 0), 0);
          newState.profitLoss.netProfit = newState.profitLoss.revenue.total - newState.profitLoss.expenses.total;
          newState.profitLoss.margins.net = newState.profitLoss.revenue.total > 0 ? 
            (newState.profitLoss.netProfit / newState.profitLoss.revenue.total) * 100 : 0;
        }
        
        // Update research progress
        if (newState.research?.currentProjects) {
          newState.research.currentProjects.forEach(project => {
            if (project.progress < 100) {
              project.progress += (100 / (project.duration * 24 * 60)) * 30; // Progress per 30 seconds
              if (project.progress >= 100) {
                // Complete the project
                project.progress = 100;
                newState.research.completed.push(project);
                newState.research.currentProjects = newState.research.currentProjects.filter(p => p.id !== project.id);
                
                // Apply research benefits
                if (project.category === 'quality') {
                  newState.research.technologies.benefits.qualityBonus += 5;
                } else if (project.category === 'efficiency') {
                  newState.research.technologies.benefits.efficiencyBonus += 10;
                }
              }
            }
          });
        }
        
        // Update employee satisfaction and efficiency
        if (newState.employees) {
          // Gradual satisfaction changes based on working conditions
          const satisfactionChange = (newState.finance.cash > 50000 ? 0.1 : -0.1) + 
                                   (newState.quality.overallScore > 85 ? 0.1 : -0.05);
          newState.employees.satisfaction = Math.max(0, Math.min(100, 
            newState.employees.satisfaction + satisfactionChange));
          
          // Update department efficiency based on satisfaction
          Object.keys(newState.employees.departments).forEach(dept => {
            const department = newState.employees.departments[dept];
            department.efficiency = Math.max(50, Math.min(100, 
              department.efficiency + (newState.employees.satisfaction > 70 ? 0.1 : -0.1)));
          });
        }
        
        // Ensure all financial values are numbers, not null
        Object.keys(newState.finance || {}).forEach(key => {
          if (newState.finance[key] === null || isNaN(newState.finance[key])) {
            newState.finance[key] = 0;
          }
        });
        
        // Update game progress
        if (newState.gameProgress && newState.gameProgress.startTime) {
          newState.gameProgress.daysPassed = (Date.now() - newState.gameProgress.startTime) / (1000 * 60 * 60 * 24);
        }
        
        // Check for bankruptcy
        if ((newState.finance.cash || 0) < -(newState.finance.creditLimit || 0)) {
          // Game over scenario - could trigger restart or loan options
          console.log('Bankruptcy warning!');
        }
        
        // Update quality based on production conditions
        if (totalProduction > 0) {
          // Quality degrades with poor maintenance and resource shortages
          const maintenanceQuality = (newState.production.lines || []).reduce((avg, line) => {
            const qualityImpact = line.maintenanceStatus === 'good' ? 1 : 
                                line.maintenanceStatus === 'warning' ? 0.95 : 0.85;
            return avg + qualityImpact;
          }, 0) / Math.max(1, (newState.production.lines || []).length);
          
          const resourceQuality = Math.min(
            (newState.resources.water?.daysLeft || 0) > 1 ? 1 : 0.9,
            (newState.resources.filters?.current || 0) > 1 ? 1 : 0.85
          );
          
          newState.quality.overallScore = Math.max(60, 
            (newState.quality.overallScore || 0) * 0.999 + // Gradual degradation
            (maintenanceQuality * resourceQuality * 100) * 0.001 // Improvement factor
          );
        }
        
        return newState;
      });
    }, 30000); // Update every 30 seconds for better responsiveness

    return () => clearInterval(interval);
  }, []);

  const updateGameState = (updater) => {
    setGameState(prevState => {
      if (!prevState) return prevState;
      
      const newState = typeof updater === 'function' ? updater(prevState) : updater;
      
      // Track decisions
      if (newState.gameProgress && typeof newState.gameProgress.decisionsToday === 'number') {
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

  return { gameState, updateGameState, resetGame, lastNotifications, setLastNotifications };
};