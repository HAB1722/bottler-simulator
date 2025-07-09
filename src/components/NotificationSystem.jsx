import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react';

const NotificationSystem = ({ gameState }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newNotifications = [];

    // Check for achievements and milestones
    if (gameState.production.totalBottlesProduced >= 1000000 && 
        !notifications.find(n => n.id === 'million_bottles')) {
      newNotifications.push({
        id: 'million_bottles',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You\'ve produced 1 million bottles!',
        icon: CheckCircle,
        color: 'green'
      });
    }

    // Check for low resources
    Object.entries(gameState.resources).forEach(([key, resource]) => {
      if (key !== 'totalValue' && resource.daysLeft < 3) {
        newNotifications.push({
          id: `low_${key}`,
          type: 'warning',
          title: 'Low Stock Warning',
          message: `${resource.name} running low (${resource.daysLeft} days left)`,
          icon: AlertTriangle,
          color: 'yellow'
        });
      }
    });

    // Check for quality issues
    if (gameState.quality.overallScore < 90) {
      newNotifications.push({
        id: 'quality_warning',
        type: 'warning',
        title: 'Quality Alert',
        message: `Quality score dropped to ${gameState.quality.overallScore}%`,
        icon: AlertTriangle,
        color: 'red'
      });
    }

    // Check for profit milestones
    if (gameState.finance.netProfit > 50000 && 
        !notifications.find(n => n.id === 'profit_milestone')) {
      newNotifications.push({
        id: 'profit_milestone',
        type: 'success',
        title: 'Profit Milestone!',
        message: 'Daily profit exceeded $50,000!',
        icon: TrendingUp,
        color: 'green'
      });
    }

    // Add new notifications
    newNotifications.forEach(notification => {
      if (!notifications.find(n => n.id === notification.id)) {
        setNotifications(prev => [...prev, { ...notification, timestamp: Date.now() }]);
      }
    });

    // Auto-remove notifications after 5 seconds
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => Date.now() - n.timestamp < 5000));
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, notifications]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <div
            key={notification.id}
            className={`bg-white border-l-4 border-${notification.color}-500 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in`}
          >
            <div className="flex items-start">
              <Icon className={`text-${notification.color}-500 mr-3 mt-0.5`} size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem;