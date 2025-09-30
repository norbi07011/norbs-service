import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import '../../styles/admin-dashboard.css';

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  projects: {
    active: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
  clients: {
    total: number;
    new: number;
    retention: number;
  };
  performance: {
    averageDeliveryTime: number;
    customerSatisfaction: number;
    teamUtilization: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslations();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [revenueChart, setRevenueChart] = useState<ChartData | null>(null);
  const [projectChart, setProjectChart] = useState<ChartData | null>(null);

  useEffect(() => {
    // Mock data - w rzeczywistej aplikacji byłoby to z API
    setAnalyticsData({
      revenue: {
        total: 125000,
        thisMonth: 18500,
        lastMonth: 16200,
        growth: 14.2
      },
      projects: {
        active: 12,
        completed: 48,
        overdue: 3,
        completionRate: 94.1
      },
      clients: {
        total: 23,
        new: 5,
        retention: 87.5
      },
      performance: {
        averageDeliveryTime: 12.5,
        customerSatisfaction: 4.7,
        teamUtilization: 82.3
      }
    });

    setRevenueChart({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [12000, 15000, 18000, 16500, 19200, 18500],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      }]
    });

    setProjectChart({
      labels: ['Planning', 'In Progress', 'Review', 'Completed'],
      datasets: [{
        label: 'Projects',
        data: [8, 12, 6, 48],
        borderColor: '#10b981',
        backgroundColor: '#10b981' as string
      }]
    });
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
      </svg>
    );
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('analytics_dashboard')}</h2>
          <p className="text-muted-foreground">{t('comprehensive_business_insights')}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
            title="Wybierz zakres czasowy"
            aria-label="Wybierz zakres czasowy do analizy danych"
          >
            <option value="7d">{t('last_7_days')}</option>
            <option value="30d">{t('last_30_days')}</option>
            <option value="90d">{t('last_90_days')}</option>
            <option value="1y">{t('last_year')}</option>
          </select>
          
          <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm hover:bg-accent/80">
            {t('export_report')}
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('total_revenue')}</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(analyticsData.revenue.total)}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className={`flex items-center mt-4 ${getGrowthColor(analyticsData.revenue.growth)}`}>
            {getGrowthIcon(analyticsData.revenue.growth)}
            <span className="ml-1 text-sm font-medium">{analyticsData.revenue.growth}%</span>
            <span className="ml-2 text-sm text-muted-foreground">{t('vs_last_month')}</span>
          </div>
        </div>

        {/* Projects Card */}
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('active_projects')}</p>
              <p className="text-2xl font-bold text-foreground">{analyticsData.projects.active}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('completion_rate')}</span>
              <span className="font-medium">{analyticsData.projects.completionRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${analyticsData.projects.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Clients Card */}
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('total_clients')}</p>
              <p className="text-2xl font-bold text-foreground">{analyticsData.clients.total}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">{t('new_clients')}: </span>
            <span className="font-medium text-green-500">+{analyticsData.clients.new}</span>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('team_utilization')}</p>
              <p className="text-2xl font-bold text-foreground">{analyticsData.performance.teamUtilization}%</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-muted-foreground">
              {t('avg_delivery')}: {analyticsData.performance.averageDeliveryTime} {t('days')}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">{t('revenue_trend')}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('monthly_revenue')}</span>
            </div>
          </div>
          
          {/* Simple Chart Simulation */}
          <div className="h-64 flex items-end space-x-2">
            {revenueChart?.datasets[0].data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: `${(value / Math.max(...revenueChart.datasets[0].data)) * 200}px` }}
                />
                <span className="text-xs text-muted-foreground mt-2">
                  {revenueChart.labels[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status Pie Chart */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">{t('project_distribution')}</h3>
          
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              {/* Simplified Pie Chart */}
              <div className="w-40 h-40 rounded-full border-8 border-red-500 border-r-yellow-500 border-b-purple-500 border-l-green-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{analyticsData.projects.active + analyticsData.projects.completed}</div>
                  <div className="text-sm text-muted-foreground">{t('total_projects')}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('planning')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('in_progress')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('review')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">{t('completed')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('performance_metrics')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t('delivery_performance')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('on_time_delivery')}</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t('client_satisfaction')}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">{analyticsData.performance.customerSatisfaction}/5</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">{t('resource_efficiency')}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('budget_utilization')}</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;