import { useState, useEffect } from 'react';

const initialGameState = {
  production: {
    lines: [
      {
        id: 1,
        name: 'Premium Line A',
        type: 'High-Speed Bottling',
        level: 3,
        isActive: true,
        currentOutput: 2500,
        maxOutput: 3000,
        efficiency: 85,
        speed: 7,
        maintenanceStatus: 'good',
        nextMaintenance: 48
      },
      {
        id: 2,
        name: 'Standard Line B',
        type: 'Standard Bottling',
        level: 2,
        isActive: true,
        currentOutput: 1800,
        maxOutput: 2000,
        efficiency: 90,
        speed: 6,
        maintenanceStatus: 'good',
        nextMaintenance: 72
      },
      {
        id: 3,
        name: 'Eco Line C',
        type: 'Eco-Friendly Bottling',
        level: 1,
        isActive: false,
        currentOutput: 0,
        maxOutput: 1500,
        efficiency: 0,
        speed: 5,
        maintenanceStatus: 'warning',
        nextMaintenance: 24
      }
    ],
    totalCapacity: 6500,
    dailyProduction: 45000,
    totalBottlesProduced: 1250000,
    averageEfficiency: 88,
    uptime: 94
  },
  
  resources: {
    water: {
      name: 'Purified Water',
      current: 85000,
      capacity: 100000,
      unit: 'Liters',
      dailyUsage: 12000,
      cost: 0.002,
      ordered: 0,
      daysLeft: 7
    },
    bottles: {
      name: 'Plastic Bottles',
      current: 45000,
      capacity: 75000,
      unit: 'Units',
      dailyUsage: 15000,
      cost: 0.05,
      ordered: 25000,
      daysLeft: 3
    },
    caps: {
      name: 'Bottle Caps',
      current: 48000,
      capacity: 80000,
      unit: 'Units',
      dailyUsage: 15000,
      cost: 0.01,
      ordered: 0,
      daysLeft: 3
    },
    labels: {
      name: 'Product Labels',
      current: 52000,
      capacity: 70000,
      unit: 'Units',
      dailyUsage: 15000,
      cost: 0.02,
      ordered: 0,
      daysLeft: 3
    },
    filters: {
      name: 'Water Filters',
      current: 25,
      capacity: 50,
      unit: 'Units',
      dailyUsage: 2,
      cost: 45,
      ordered: 10,
      daysLeft: 12
    },
    totalValue: 125000
  },

  market: {
    marketShare: 15.2,
    totalRevenue: 125000,
    unitsSold: 45000,
    averagePrice: 2.78,
    competitionLevel: 'High',
    products: [
      {
        name: 'Al Rawdatain Premium',
        type: 'premium',
        size: '500ml',
        price: 3.50,
        marketPrice: 3.25,
        dailySales: 8500,
        marketShare: 18,
        demand: 85,
        demandTrend: 5
      },
      {
        name: 'Al Rawdatain Classic',
        type: 'standard',
        size: '500ml',
        price: 2.25,
        marketPrice: 2.40,
        dailySales: 25000,
        marketShare: 22,
        demand: 92,
        demandTrend: 2
      },
      {
        name: 'Al Rawdatain Family',
        type: 'family',
        size: '1.5L',
        price: 4.75,
        marketPrice: 4.50,
        dailySales: 11500,
        marketShare: 12,
        demand: 78,
        demandTrend: -3
      }
    ],
    trends: [
      {
        title: 'Summer Season Boost',
        description: 'Increased demand due to hot weather',
        impact: 'positive',
        change: '+15%',
        duration: '3 months'
      },
      {
        title: 'Health Consciousness',
        description: 'Growing preference for premium water',
        impact: 'positive',
        change: '+8%',
        duration: 'Ongoing'
      },
      {
        title: 'Economic Pressure',
        description: 'Consumers shifting to budget options',
        impact: 'negative',
        change: '-5%',
        duration: '6 months'
      }
    ],
    regions: [
      { name: 'Central Region', marketShare: 18, growth: 3.2, revenue: 45000 },
      { name: 'Northern Region', marketShare: 12, growth: -1.5, revenue: 35000 },
      { name: 'Southern Region', marketShare: 15, growth: 5.8, revenue: 45000 }
    ]
  },

  finance: {
    cash: 485000,
    dailyRevenue: 125000,
    dailyExpenses: 78000,
    netProfit: 47000,
    cashChange: 2.3,
    revenueChange: 5.7,
    expenseChange: 3.2,
    profitChange: 8.9,
    revenueBreakdown: [
      { category: 'Premium Sales', amount: 45000, percentage: 36, color: '#3B82F6' },
      { category: 'Standard Sales', amount: 55000, percentage: 44, color: '#10B981' },
      { category: 'Family Sales', amount: 25000, percentage: 20, color: '#F59E0B' }
    ],
    expenseBreakdown: [
      { category: 'Raw Materials', amount: 35000, percentage: 45, color: '#EF4444' },
      { category: 'Labor', amount: 18000, percentage: 23, color: '#8B5CF6' },
      { category: 'Utilities', amount: 12000, percentage: 15, color: '#F97316' },
      { category: 'Maintenance', amount: 8000, percentage: 10, color: '#06B6D4' },
      { category: 'Other', amount: 5000, percentage: 7, color: '#84CC16' }
    ],
    cashFlowProjection: [
      { date: 'Today', income: 125000, expenses: 78000, netFlow: 47000 },
      { date: 'Tomorrow', income: 128000, expenses: 80000, netFlow: 48000 },
      { date: 'Day 3', income: 122000, expenses: 75000, netFlow: 47000 },
      { date: 'Day 4', income: 135000, expenses: 82000, netFlow: 53000 },
      { date: 'Day 5', income: 130000, expenses: 79000, netFlow: 51000 },
      { date: 'Day 6', income: 125000, expenses: 77000, netFlow: 48000 },
      { date: 'Day 7', income: 140000, expenses: 85000, netFlow: 55000 }
    ],
    ratios: {
      grossMargin: 62,
      netMargin: 38,
      roi: 15.2,
      costPerUnit: 1.73,
      revenuePerUnit: 2.78,
      breakEven: 28500,
      revenueGrowth: 5.7,
      profitGrowth: 8.9,
      marketGrowth: 3.2
    }
  },

  quality: {
    overallScore: 94,
    waterPurity: 99.8,
    bottleIntegrity: 98.5,
    labelAccuracy: 99.2,
    fillLevel: 99.1,
    capSeal: 99.6,
    contamination: 0.05,
    recentTests: [
      {
        testType: 'Microbiological Analysis',
        batchNumber: 'B2024-0115-001',
        result: 'pass',
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
        result: 'warning',
        timestamp: '2024-01-14 16:45'
      }
    ],
    certifications: [
      { name: 'ISO 22000', status: 'active', expiryDate: '2024-12-31' },
      { name: 'HACCP', status: 'active', expiryDate: '2024-08-15' },
      { name: 'FDA Approval', status: 'expiring', expiryDate: '2024-03-20' },
      { name: 'Halal Certification', status: 'active', expiryDate: '2024-11-10' }
    ],
    improvementActions: [
      {
        title: 'Upgrade Filtration System',
        description: 'Install advanced reverse osmosis filters',
        cost: 25000,
        impact: 2
      },
      {
        title: 'Automated Quality Testing',
        description: 'Implement real-time quality monitoring',
        cost: 45000,
        impact: 5
      },
      {
        title: 'Staff Training Program',
        description: 'Enhanced quality control training',
        cost: 8000,
        impact: 3
      }
    ],
    trends: {
      defectRate: 0.8,
      customerComplaints: 12,
      testsPassed: 97.2
    }
  },

  upgrades: {
    purchased: [
      {
        id: 'auto-fill-1',
        name: 'Automated Filling System',
        category: 'automation',
        description: 'Reduces manual intervention in the filling process',
        cost: 25000,
        benefits: ['+15% production speed', '-10% labor costs', '+5% accuracy']
      }
    ],
    available: [
      {
        id: 'speed-boost-1',
        name: 'High-Speed Conveyor',
        category: 'production',
        description: 'Increases bottle movement speed throughout the production line',
        cost: 35000,
        benefits: ['+20% production speed', '+10% throughput', 'Reduced bottlenecks'],
        requirements: 'Production Level 2'
      },
      {
        id: 'energy-efficient-1',
        name: 'Energy Efficient Motors',
        category: 'efficiency',
        description: 'Reduces energy consumption while maintaining performance',
        cost: 28000,
        benefits: ['-25% energy costs', '+5% efficiency', 'Environmental benefits'],
        requirements: null
      },
      {
        id: 'quality-sensor-1',
        name: 'Advanced Quality Sensors',
        category: 'quality',
        description: 'Real-time quality monitoring and automatic rejection system',
        cost: 42000,
        benefits: ['+15% quality score', '-50% defect rate', 'Automated quality control'],
        requirements: 'Quality Level 3'
      },
      {
        id: 'predictive-maintenance',
        name: 'Predictive Maintenance System',
        category: 'automation',
        description: 'AI-powered system to predict equipment failures',
        cost: 55000,
        benefits: ['+20% uptime', '-30% maintenance costs', 'Prevent breakdowns'],
        requirements: 'Automation Level 2'
      },
      {
        id: 'water-recycling',
        name: 'Water Recycling System',
        category: 'efficiency',
        description: 'Recycles and purifies water used in cleaning processes',
        cost: 38000,
        benefits: ['-40% water costs', 'Environmental compliance', '+10% sustainability score'],
        requirements: null
      },
      {
        id: 'smart-inventory',
        name: 'Smart Inventory Management',
        category: 'automation',
        description: 'Automated inventory tracking and reordering system',
        cost: 22000,
        benefits: ['-20% inventory costs', 'Automatic reordering', '+15% efficiency'],
        requirements: null
      }
    ],
    research: [
      {
        name: 'Nano-Filtration Technology',
        description: 'Next-generation water purification system',
        researchCost: 75000,
        timeToUnlock: '45 days',
        progress: 35
      },
      {
        name: 'Biodegradable Bottles',
        description: 'Environmentally friendly bottle manufacturing',
        researchCost: 60000,
        timeToUnlock: '60 days',
        progress: 20
      },
      {
        name: 'AI Production Optimization',
        description: 'Machine learning for production optimization',
        researchCost: 85000,
        timeToUnlock: '90 days',
        progress: 10
      }
    ],
    totalBenefits: {
      productionBoost: 15,
      efficiencyBoost: 10,
      qualityBoost: 5,
      costReduction: 10
    }
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState(initialGameState);

  // Auto-save to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('alRawdatainFactoryState');
    if (savedState) {
      try {
        setGameState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alRawdatainFactoryState', JSON.stringify(gameState));
  }, [gameState]);

  // Game simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => {
        const newState = { ...prevState };
        
        // Update production based on active lines
        let totalProduction = 0;
        newState.production.lines.forEach(line => {
          if (line.isActive) {
            const productionRate = (line.currentOutput * line.speed) / 10;
            totalProduction += productionRate;
          }
        });
        
        // Update resources consumption
        const hourlyConsumption = totalProduction / 24;
        Object.keys(newState.resources).forEach(resourceKey => {
          if (resourceKey !== 'totalValue') {
            const resource = newState.resources[resourceKey];
            const consumption = resource.dailyUsage / 24;
            resource.current = Math.max(0, resource.current - consumption);
            resource.daysLeft = resource.current / resource.dailyUsage;
          }
        });
        
        // Update finance
        const hourlyRevenue = newState.finance.dailyRevenue / 24;
        const hourlyExpenses = newState.finance.dailyExpenses / 24;
        newState.finance.cash += (hourlyRevenue - hourlyExpenses);
        
        return newState;
      });
    }, 5000); // Update every 5 seconds for demo purposes

    return () => clearInterval(interval);
  }, []);

  const updateGameState = (updater) => {
    setGameState(updater);
  };

  return { gameState, updateGameState };
};