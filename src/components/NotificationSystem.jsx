import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react';

const NotificationSystem = ({ gameState, lastNotifications = {}, setLastNotifications }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!gameState || !gameState.production || !gameState.finance) return;
    
    const newNotifications = [];
    const now = Date.now();
    const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes between same notifications

    // Check for achievements and milestones
    if ((gameState.production.totalBottlesProduced || 0) >= 1000000 && 
        !notifications.find(n => n.id === 'million_bottles') &&
        (!lastNotifications['million_bottles'] || now - lastNotifications['million_bottles'] > NOTIFICATION_COOLDOWN)) {
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
    Object.entries(gameState.resources || {}).forEach(([key, resource]) => {
      if (key !== 'totalValue' && resource && (resource.daysLeft || 0) < 1 &&
          (!lastNotifications[`low_${key}`] || now - lastNotifications[`low_${key}`] > NOTIFICATION_COOLDOWN)) {
        newNotifications.push({
          id: `low_${key}`,
          type: 'warning',
          title: 'Low Stock Warning',
          message: `${resource.name} running low (${
            resource.daysLeft < 1 ? 
            `${Math.round(resource.daysLeft * 24)}h left` : 
            `${Math.round(resource.daysLeft)} days left`
          })`,
          icon: AlertTriangle,
          color: 'yellow'
        });
      }
    });

    // Check for quality issues
    if ((gameState.quality?.overallScore || 0) < 80 &&
        (!lastNotifications['quality_warning'] || now - lastNotifications['quality_warning'] > NOTIFICATION_COOLDOWN)) {
      newNotifications.push({
        id: 'quality_warning',
        type: 'warning',
        title: 'Quality Alert',
        message: `Quality score at ${Math.round(gameState.quality?.overallScore || 0)}%`,
        icon: AlertTriangle,
        color: 'red'
      });
    }

    // Check for profit milestones
    if ((gameState.finance?.netProfit || 0) > 10000 && 
        !notifications.find(n => n.id === 'profit_milestone') &&
        (!lastNotifications['profit_milestone'] || now - lastNotifications['profit_milestone'] > NOTIFICATION_COOLDOWN)) {
      newNotifications.push({
        id: 'profit_milestone',
        type: 'success',
        title: 'Profit Milestone!',
        message: 'Daily profit exceeded $10,000!',
        icon: TrendingUp,
        color: 'green'
      });
    }

    // Check for cash crisis
    if ((gameState.finance?.cash || 0) < 10000 &&
        (!lastNotifications['cash_crisis'] || now - lastNotifications['cash_crisis'] > NOTIFICATION_COOLDOWN)) {
      newNotifications.push({
        id: 'cash_crisis',
        type: 'warning',
        title: 'Cash Crisis!',
        message: `Only $${Math.round(gameState.finance?.cash || 0).toLocaleString()} remaining`,
        icon: AlertTriangle,
        color: 'red'
      });
    }

    // Add new notifications
    newNotifications.forEach(notification => {
      if (!notifications.find(n => n.id === notification.id)) {
        setNotifications(prev => [...prev, { ...notification, timestamp: Date.now() }]);
        
        // Update last notification time
        if (setLastNotifications) {
          setLastNotifications(prev => ({
            ...prev,
            [notification.id]: now
          }));
        }
      }
    });

    // Auto-remove notifications after 5 seconds
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => Date.now() - n.timestamp < 5000));
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, notifications, lastNotifications, setLastNotifications]);

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