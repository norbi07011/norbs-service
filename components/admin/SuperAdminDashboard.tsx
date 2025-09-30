import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import AnalyticsDashboard from './AnalyticsDashboard';
import NotificationCenter from './NotificationCenter';
import UserManagement from './UserManagement';
import SystemMonitoring from './SystemMonitoring';
import PlanningSystem from './PlanningSystem';
import SettingsCenter from './SettingsCenter';
import ReportsCenter from './ReportsCenter';
import AdminOverview from './AdminOverview';

interface AdminModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  category: 'core' | 'management' | 'monitoring' | 'advanced';
  features: string[];
}

const SuperAdminDashboard: React.FC = () => {
  const { t } = useTranslations();
  const [activeModule, setActiveModule] = useState<string>('overview');
  
  // Wrapper for PlanningSystem with required props
  const PlanningSystemWrapper: React.FC = () => {
    const mockProjects = [
      { 
        id: '1', 
        clientId: '1',
        title: 'Sample Project', 
        name: 'Sample Project',
        description: 'Sample project description',
        status: 'in-progress' as const, 
        startDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium' as const,
        tags: ['web', 'design'],
        budgetType: 'fixed' as const,
        budgetAmount: 10000,
        hourlyRate: 75,
        progress: 50,
        createdAt: new Date().toISOString()
      }
    ];
    const mockTasks = [
      { 
        id: '1', 
        projectId: '1',
        title: 'Sample Task', 
        description: 'Sample task description',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const, 
        priority: 'medium' as const,
        hoursLogged: 5,
        createdAt: new Date().toISOString()
      }
    ];
    
    return (
      <PlanningSystem
        projects={mockProjects}
        tasks={mockTasks}
        onTaskUpdate={() => {}}
        onProjectUpdate={() => {}}
        onAddTask={() => {}}
        onAddProject={() => {}}
      />
    );
  };
  
  const [quickStats, setQuickStats] = useState({
    totalProjects: 24,
    activeUsers: 156,
    systemHealth: 98.5,
    revenue: 125000,
    alerts: 3,
    performance: 94.2
  });

  const adminModules: AdminModule[] = [
    {
      id: 'analytics',
      name: t('analytics_dashboard'),
      description: t('comprehensive_business_analytics'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      component: AnalyticsDashboard,
      category: 'core',
      features: ['Revenue Analytics', 'Performance Metrics', 'Custom Reports', 'Data Export']
    },
    {
      id: 'planning',
      name: t('planning_system'),
      description: t('advanced_project_planning'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      component: PlanningSystemWrapper,
      category: 'core',
      features: ['Calendar View', 'Kanban Board', 'Gantt Charts', 'Time Tracking']
    },
    {
      id: 'notifications',
      name: t('notification_center'),
      description: t('manage_alerts_notifications'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 1v16l5-5H9V1z" />
        </svg>
      ),
      component: NotificationCenter,
      category: 'management',
      features: ['Real-time Alerts', 'Custom Notifications', 'Alert Management', 'Settings']
    },
    {
      id: 'users',
      name: t('user_management'),
      description: t('manage_users_roles_permissions'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      component: UserManagement,
      category: 'management',
      features: ['User Roles', 'Permissions', 'Access Control', 'User Activity']
    },
    {
      id: 'monitoring',
      name: t('system_monitoring'),
      description: t('monitor_system_performance'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      component: SystemMonitoring,
      category: 'monitoring',
      features: ['System Health', 'Performance Tracking', 'Log Analysis', 'Alerts']
    },
    {
      id: 'settings',
      name: t('settings_center'),
      description: t('system_configuration_management'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      component: SettingsCenter,
      category: 'advanced',
      features: ['General Settings', 'Security Configuration', 'Backup Management', 'Performance Tuning']
    },
    {
      id: 'reports',
      name: t('reports_center'),
      description: t('generate_analyze_export_reports'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      component: ReportsCenter,
      category: 'advanced',
      features: ['Custom Reports', 'Automated Generation', 'Export Options', 'Scheduled Reports']
    }
  ];

  const getModulesByCategory = (category: AdminModule['category']) => {
    return adminModules.filter(module => module.category === category);
  };

  const renderModuleOverview = () => (
    <div className="space-y-8">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('super_admin_dashboard')}</h1>
            <p className="text-purple-100">{t('comprehensive_business_management_suite')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{quickStats.systemHealth}%</div>
            <div className="text-sm text-purple-100">{t('system_health')}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{quickStats.totalProjects}</div>
          <div className="text-sm text-muted-foreground">{t('active_projects')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{quickStats.activeUsers}</div>
          <div className="text-sm text-muted-foreground">{t('active_users')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{quickStats.systemHealth}%</div>
          <div className="text-sm text-muted-foreground">{t('system_health')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">€{(quickStats.revenue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-muted-foreground">{t('revenue')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{quickStats.alerts}</div>
          <div className="text-sm text-muted-foreground">{t('active_alerts')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{quickStats.performance}%</div>
          <div className="text-sm text-muted-foreground">{t('performance')}</div>
        </div>
      </div>

      {/* Core Modules */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">{t('core_modules')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getModulesByCategory('core').map(module => (
            <div 
              key={module.id}
              className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setActiveModule(module.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {module.features.slice(0, 3).map(feature => (
                      <span key={feature} className="px-2 py-1 bg-muted rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {module.features.length > 3 && (
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        +{module.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management Modules */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">{t('management_modules')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getModulesByCategory('management').map(module => (
            <div 
              key={module.id}
              className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setActiveModule(module.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {module.features.slice(0, 3).map(feature => (
                      <span key={feature} className="px-2 py-1 bg-muted rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring Modules */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">{t('monitoring_modules')}</h2>
        <div className="grid grid-cols-1 gap-6">
          {getModulesByCategory('monitoring').map(module => (
            <div 
              key={module.id}
              className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setActiveModule(module.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {module.features.map(feature => (
                      <span key={feature} className="px-2 py-1 bg-muted rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">{t('quick_actions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <div className="text-sm font-medium">{t('add_project')}</div>
          </button>
          
          <button className="p-4 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="text-sm font-medium">{t('add_user')}</div>
          </button>
          
          <button className="p-4 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="text-sm font-medium">{t('view_reports')}</div>
          </button>
          
          <button className="p-4 bg-orange-500/10 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white transition-colors">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="text-sm font-medium">{t('system_settings')}</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveModule = () => {
    const module = adminModules.find(m => m.id === activeModule);
    if (!module) return renderModuleOverview();

    const Component = module.component;
    return (
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveModule('overview')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={t('back_to_overview')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                {module.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{module.name}</h1>
                <p className="text-muted-foreground">{module.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Content */}
        <Component />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {activeModule === 'overview' ? <AdminOverview /> : renderActiveModule()}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;