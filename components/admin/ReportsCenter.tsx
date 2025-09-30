import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'project' | 'client' | 'performance' | 'custom';
  icon: React.ReactNode;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'on-demand';
  lastGenerated?: Date;
  automated: boolean;
}

interface ReportFilter {
  dateRange: {
    start: string;
    end: string;
  };
  clients: string[];
  projects: string[];
  status: string[];
}

const ReportsCenter: React.FC = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'scheduled' | 'export'>('overview');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    clients: [],
    projects: [],
    status: []
  });

  const availableReports: Report[] = [
    {
      id: 'revenue-report',
      name: t('revenue_report'),
      description: t('detailed_revenue_analytics_by_period'),
      category: 'financial',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      frequency: 'monthly',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      automated: true
    },
    {
      id: 'project-status',
      name: t('project_status_report'),
      description: t('comprehensive_project_progress_overview'),
      category: 'project',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      frequency: 'weekly',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      automated: true
    },
    {
      id: 'client-satisfaction',
      name: t('client_satisfaction_report'),
      description: t('client_feedback_and_satisfaction_metrics'),
      category: 'client',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      frequency: 'monthly',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      automated: false
    },
    {
      id: 'performance-metrics',
      name: t('performance_metrics_report'),
      description: t('team_productivity_and_efficiency_analysis'),
      category: 'performance',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      frequency: 'weekly',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      automated: true
    },
    {
      id: 'time-tracking',
      name: t('time_tracking_report'),
      description: t('detailed_time_allocation_and_billable_hours'),
      category: 'performance',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      frequency: 'monthly',
      automated: false
    },
    {
      id: 'invoice-summary',
      name: t('invoice_summary_report'),
      description: t('billing_and_payment_status_overview'),
      category: 'financial',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      frequency: 'weekly',
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      automated: true
    }
  ];

  const getCategoryColor = (category: Report['category']) => {
    switch (category) {
      case 'financial': return 'bg-green-500/20 text-green-700';
      case 'project': return 'bg-blue-500/20 text-blue-700';
      case 'client': return 'bg-purple-500/20 text-purple-700';
      case 'performance': return 'bg-orange-500/20 text-orange-700';
      case 'custom': return 'bg-gray-500/20 text-gray-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getFrequencyColor = (frequency: Report['frequency']) => {
    switch (frequency) {
      case 'daily': return 'text-red-600';
      case 'weekly': return 'text-yellow-600';
      case 'monthly': return 'text-blue-600';
      case 'yearly': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatLastGenerated = (date?: Date) => {
    if (!date) return t('never');
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('yesterday');
    return `${diffDays} ${t('days_ago')}`;
  };

  const generateReport = (reportId: string) => {
    console.log('Generating report:', reportId, 'with filters:', filters);
    // Here you would trigger the actual report generation
  };

  const exportReport = (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    console.log('Exporting report:', reportId, 'as', format);
    // Here you would trigger the export
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{availableReports.length}</div>
          <div className="text-sm text-muted-foreground">{t('available_reports')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{availableReports.filter(r => r.automated).length}</div>
          <div className="text-sm text-muted-foreground">{t('automated_reports')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {availableReports.filter(r => r.lastGenerated && 
              new Date().getTime() - r.lastGenerated.getTime() < 7 * 24 * 60 * 60 * 1000
            ).length}
          </div>
          <div className="text-sm text-muted-foreground">{t('recent_reports')}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">3</div>
          <div className="text-sm text-muted-foreground">{t('custom_reports')}</div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableReports.map(report => (
          <div key={report.id} className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  {report.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{report.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(report.category)}`}>
                    {t(report.category)}
                  </span>
                </div>
              </div>
              {report.automated && (
                <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full">
                  {t('auto')}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
            
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-muted-foreground">{t('frequency')}:</span>
              <span className={`font-medium ${getFrequencyColor(report.frequency)}`}>
                {t(report.frequency)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-6">
              <span className="text-muted-foreground">{t('last_generated')}:</span>
              <span className="font-medium">{formatLastGenerated(report.lastGenerated)}</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => generateReport(report.id)}
                className="flex-1 bg-accent text-accent-foreground px-3 py-2 rounded text-sm hover:bg-accent/80"
              >
                {t('generate')}
              </button>
              <button
                onClick={() => setSelectedReport(report)}
                className="px-3 py-2 border border-border rounded text-sm hover:bg-muted"
              >
                {t('config')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGenerate = () => (
    <div className="space-y-6">
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('report_filters')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('start_date')}</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('end_date')}</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="clients-select" className="block text-sm font-medium text-foreground mb-2">{t('select_clients')}</label>
            <select
              multiple
              id="clients-select"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 h-32"
              title={t('select_clients')}
              aria-label={t('select_clients')}
            >
              <option value="client1">Client ABC</option>
              <option value="client2">Client XYZ</option>
              <option value="client3">Client 123</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="projects-select" className="block text-sm font-medium text-foreground mb-2">{t('select_projects')}</label>
            <select
              multiple
              id="projects-select"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 h-32"
              title={t('select_projects')}
              aria-label={t('select_projects')}
            >
              <option value="project1">Website Redesign</option>
              <option value="project2">Mobile App</option>
              <option value="project3">SEO Campaign</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('select_reports_to_generate')}</h3>
        
        <div className="space-y-3">
          {availableReports.map(report => (
            <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`report-${report.id}`}
                  className="w-4 h-4 text-accent border-border rounded"
                />
                <label htmlFor={`report-${report.id}`} className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded text-accent">
                    {report.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{report.name}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
                  </div>
                </label>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => exportReport(report.id, 'pdf')}
                  className="px-3 py-1 bg-red-500/10 text-red-600 rounded text-sm hover:bg-red-500 hover:text-white"
                >
                  PDF
                </button>
                <button
                  onClick={() => exportReport(report.id, 'excel')}
                  className="px-3 py-1 bg-green-500/10 text-green-600 rounded text-sm hover:bg-green-500 hover:text-white"
                >
                  Excel
                </button>
                <button
                  onClick={() => exportReport(report.id, 'csv')}
                  className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded text-sm hover:bg-blue-500 hover:text-white"
                >
                  CSV
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <button className="bg-accent text-accent-foreground px-6 py-2 rounded-lg hover:bg-accent/80">
            {t('generate_selected_reports')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('reports_center')}</h2>
          <p className="text-muted-foreground">{t('generate_analyze_export_reports')}</p>
        </div>
        
        <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80">
          {t('create_custom_report')}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('overview')}
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'generate'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('generate_reports')}
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'scheduled'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('scheduled_reports')}
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'export'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('export_history')}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'generate' && renderGenerate()}
      {activeTab === 'scheduled' && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-muted-foreground">{t('scheduled_reports_coming_soon')}</p>
        </div>
      )}
      {activeTab === 'export' && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-muted-foreground">{t('export_history_coming_soon')}</p>
        </div>
      )}
    </div>
  );
};

export default ReportsCenter;