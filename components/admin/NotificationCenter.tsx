import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface SystemAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'security' | 'performance' | 'business';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  assignedTo?: string;
}

const NotificationCenter: React.FC = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts' | 'settings'>('notifications');
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false
  });

  useEffect(() => {
    // Mock data
    setNotifications([
      {
        id: '1',
        type: 'success',
        title: 'Project Completed',
        message: 'Website redesign for Client ABC has been completed successfully.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Payment Overdue',
        message: 'Invoice #INV-2024-001 is 5 days overdue.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
        actions: [
          { label: 'Send Reminder', action: () => console.log('Reminder sent') },
          { label: 'View Invoice', action: () => console.log('View invoice') }
        ]
      },
      {
        id: '3',
        type: 'info',
        title: 'New Client Inquiry',
        message: 'New contact form submission from potential client.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true
      }
    ]);

    setAlerts([
      {
        id: '1',
        severity: 'high',
        category: 'system',
        title: 'Database Performance',
        description: 'Database response time increased by 40% in the last hour.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        resolved: false
      },
      {
        id: '2',
        severity: 'medium',
        category: 'business',
        title: 'Resource Utilization',
        description: 'Team utilization is below 75% this week.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        resolved: false,
        assignedTo: 'Project Manager'
      },
      {
        id: '3',
        severity: 'critical',
        category: 'security',
        title: 'Multiple Failed Login Attempts',
        description: 'Detected 15 failed login attempts from IP 192.168.1.100.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        resolved: true
      }
    ]);
  }, []);

  const getNotificationIcon = (type: SystemNotification['type']) => {
    const iconClasses = "w-5 h-5";
    switch (type) {
      case 'success':
        return (
          <svg className={`${iconClasses} text-green-500`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`${iconClasses} text-yellow-500`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`${iconClasses} text-red-500`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClasses} text-blue-500`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getSeverityColor = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const getCategoryIcon = (category: SystemAlert['category']) => {
    const iconClasses = "w-5 h-5";
    switch (category) {
      case 'system':
        return (
          <svg className={`${iconClasses} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case 'security':
        return (
          <svg className={`${iconClasses} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'performance':
        return (
          <svg className={`${iconClasses} text-green-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClasses} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('notification_center')}</h2>
          <p className="text-muted-foreground">{t('manage_notifications_and_alerts')}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {unreadCount} {t('unread')}, {unresolvedAlerts} {t('alerts')}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'notifications'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('notifications')} {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'alerts'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('system_alerts')} {unresolvedAlerts > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1">{unresolvedAlerts}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('settings')}
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-background border border-border rounded-lg">
        {activeTab === 'notifications' && (
          <div className="divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 1v16l5-5H9V1z" />
                </svg>
                <p className="text-muted-foreground">{t('no_notifications')}</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-6 transition-colors hover:bg-muted/50 ${!notification.read ? 'bg-accent/5' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(notification.timestamp)}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      
                      {notification.actions && (
                        <div className="flex space-x-2 mt-3">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={action.action}
                              className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded hover:bg-accent/80"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-accent hover:text-accent/80"
                      >
                        {t('mark_read')}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="divide-y divide-border">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-muted-foreground">{t('no_alerts')}</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-6 border-l-4 ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(alert.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{alert.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500/20 text-red-700' :
                            alert.severity === 'high' ? 'bg-orange-500/20 text-orange-700' :
                            alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-700' :
                            'bg-blue-500/20 text-blue-700'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      
                      {alert.assignedTo && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('assigned_to')}: {alert.assignedTo}
                        </p>
                      )}
                    </div>
                    
                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        {t('resolve')}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">{t('notification_preferences')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-foreground">{t('email_notifications')}</label>
                    <p className="text-sm text-muted-foreground">{t('receive_notifications_via_email')}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, email: !prev.email }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.email ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-foreground">{t('push_notifications')}</label>
                    <p className="text-sm text-muted-foreground">{t('receive_browser_push_notifications')}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, push: !prev.push }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.push ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.push ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-foreground">{t('sms_notifications')}</label>
                    <p className="text-sm text-muted-foreground">{t('receive_critical_alerts_via_sms')}</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, sms: !prev.sms }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.sms ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.sms ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80">
                {t('save_preferences')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;