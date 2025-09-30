import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const AdminOverview: React.FC = () => {
  const { t } = useTranslations();

  const features = [
    {
      category: t('core_modules'),
      items: [
        {
          name: t('analytics_dashboard'),
          description: t('comprehensive_business_analytics'),
          icon: '📊',
          features: [
            t('revenue_tracking'),
            t('performance_metrics'),
            t('growth_indicators'),
            t('kpi_monitoring')
          ]
        },
        {
          name: t('planning_system'),
          description: t('advanced_project_planning'),
          icon: '📅',
          features: [
            t('calendar_view'),
            t('kanban_board'),
            t('gantt_charts'),
            t('time_tracking')
          ]
        }
      ]
    },
    {
      category: t('management_modules'),
      items: [
        {
          name: t('notification_center'),
          description: t('alert_notification_management'),
          icon: '🔔',
          features: [
            t('real_time_alerts'),
            t('custom_notifications'),
            t('alert_categories'),
            t('notification_settings')
          ]
        },
        {
          name: t('user_management'),
          description: t('user_role_permission_control'),
          icon: '👥',
          features: [
            t('user_accounts'),
            t('role_management'),
            t('permission_control'),
            t('access_logs')
          ]
        }
      ]
    },
    {
      category: t('monitoring_modules'),
      items: [
        {
          name: t('system_monitoring'),
          description: t('real_time_system_health'),
          icon: '🖥️',
          features: [
            t('performance_monitoring'),
            t('health_checks'),
            t('log_analysis'),
            t('system_alerts')
          ]
        }
      ]
    },
    {
      category: t('advanced_modules'),
      items: [
        {
          name: t('settings_center'),
          description: t('comprehensive_configuration'),
          icon: '⚙️',
          features: [
            t('general_settings'),
            t('security_config'),
            t('backup_management'),
            t('performance_tuning')
          ]
        },
        {
          name: t('reports_center'),
          description: t('report_generation_analysis'),
          icon: '📄',
          features: [
            t('custom_reports'),
            t('automated_generation'),
            t('export_options'),
            t('scheduled_reports')
          ]
        }
      ]
    }
  ];

  const stats = [
    {
      label: t('total_modules'),
      value: '7',
      icon: '🧩',
      color: 'text-blue-600'
    },
    {
      label: t('total_features'),
      value: '28+',
      icon: '⚡',
      color: 'text-green-600'
    },
    {
      label: t('admin_capabilities'),
      value: t('enterprise_grade'),
      icon: '🏢',
      color: 'text-purple-600'
    },
    {
      label: t('integration_level'),
      value: t('fully_integrated'),
      icon: '🔗',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">{t('premium_admin_suite')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('comprehensive_business_management_solution')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-background border border-border rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Overview */}
      <div className="space-y-8">
        {features.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">{category.category}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-4">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">{t('key_features')}:</h4>
                    <ul className="space-y-1">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Summary */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('implementation_summary')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{t('technical_highlights')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {t('modern_react_typescript')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {t('responsive_glassmorphism_design')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {t('real_time_data_visualization')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {t('comprehensive_user_management')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {t('advanced_reporting_system')}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{t('business_benefits')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('centralized_business_management')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('improved_operational_efficiency')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('data_driven_decision_making')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('scalable_enterprise_solution')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('professional_client_experience')}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">{t('ready_for_enterprise')}</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {t('admin_panel_now_enterprise_ready')}
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/80 font-medium">
            {t('explore_analytics')}
          </button>
          <button className="border border-border px-6 py-3 rounded-lg hover:bg-muted font-medium">
            {t('view_documentation')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;