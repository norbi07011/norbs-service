import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface SystemMonitor {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    inbound: number;
    outbound: number;
  };
  database: {
    connections: number;
    queries: number;
    responseTime: number;
  };
  application: {
    uptime: number;
    requests: number;
    errors: number;
    responseTime: number;
  };
}

interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  source: string;
  details?: Record<string, any>;
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

const SystemMonitoring: React.FC = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'health' | 'performance'>('overview');
  const [systemData, setSystemData] = useState<SystemMonitor | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);

  useEffect(() => {
    // Mock system data
    const updateSystemData = () => {
      setSystemData({
        cpu: {
          usage: 35 + Math.random() * 30,
          cores: 8,
          temperature: 45 + Math.random() * 15
        },
        memory: {
          used: 12.5,
          total: 32,
          percentage: 39
        },
        disk: {
          used: 450,
          total: 1000,
          percentage: 45
        },
        network: {
          inbound: 150 + Math.random() * 50,
          outbound: 80 + Math.random() * 30
        },
        database: {
          connections: 25,
          queries: 1250,
          responseTime: 15 + Math.random() * 10
        },
        application: {
          uptime: 7 * 24 * 60 * 60, // 7 days in seconds
          requests: 15420,
          errors: 12,
          responseTime: 180 + Math.random() * 50
        }
      });
    };

    // Mock logs
    setLogs([
      {
        id: '1',
        level: 'info',
        message: 'User authentication successful',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        source: 'auth-service'
      },
      {
        id: '2',
        level: 'warn',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        source: 'system-monitor',
        details: { memoryUsage: '89%', threshold: '85%' }
      },
      {
        id: '3',
        level: 'error',
        message: 'Database connection timeout',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        source: 'database',
        details: { timeout: '30s', query: 'SELECT * FROM projects' }
      },
      {
        id: '4',
        level: 'info',
        message: 'Backup completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        source: 'backup-service',
        details: { size: '2.3GB', duration: '45s' }
      }
    ]);

    // Mock health checks
    setHealthChecks([
      {
        service: 'Web Server',
        status: 'healthy',
        responseTime: 120,
        lastCheck: new Date(Date.now() - 1000 * 30)
      },
      {
        service: 'Database',
        status: 'healthy',
        responseTime: 25,
        lastCheck: new Date(Date.now() - 1000 * 30)
      },
      {
        service: 'Email Service',
        status: 'degraded',
        responseTime: 1500,
        lastCheck: new Date(Date.now() - 1000 * 30),
        error: 'High response time'
      },
      {
        service: 'File Storage',
        status: 'healthy',
        responseTime: 80,
        lastCheck: new Date(Date.now() - 1000 * 30)
      },
      {
        service: 'External API',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(Date.now() - 1000 * 30),
        error: 'Connection refused'
      }
    ]);

    updateSystemData();

    if (autoRefresh) {
      const interval = setInterval(updateSystemData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-500/20';
      case 'degraded': return 'text-yellow-500 bg-yellow-500/20';
      case 'unhealthy': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-500 bg-red-500/20';
      case 'warn': return 'text-yellow-500 bg-yellow-500/20';
      case 'info': return 'text-blue-500 bg-blue-500/20';
      case 'debug': return 'text-gray-500 bg-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!systemData) {
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
          <h2 className="text-2xl font-bold text-foreground">{t('system_monitoring')}</h2>
          <p className="text-muted-foreground">{t('monitor_system_health_performance')}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground">{t('auto_refresh')}:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoRefresh ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="bg-background border border-border rounded px-3 py-1 text-sm"
            title={t('refresh_interval')}
          >
            <option value={5}>5s</option>
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
          </select>
        </div>
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
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'performance'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('performance')}
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'health'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('health_checks')}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'logs'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('system_logs')}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU */}
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">{t('cpu_usage')}</h3>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">{systemData.cpu.usage.toFixed(1)}%</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      systemData.cpu.usage > 80 ? 'bg-red-500' : 
                      systemData.cpu.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${systemData.cpu.usage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {systemData.cpu.cores} cores, {systemData.cpu.temperature.toFixed(1)}°C
                </div>
              </div>
            </div>

            {/* Memory */}
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">{t('memory_usage')}</h3>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">{systemData.memory.percentage}%</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      systemData.memory.percentage > 85 ? 'bg-red-500' : 
                      systemData.memory.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${systemData.memory.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {systemData.memory.used}GB / {systemData.memory.total}GB
                </div>
              </div>
            </div>

            {/* Disk */}
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">{t('disk_usage')}</h3>
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">{systemData.disk.percentage}%</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      systemData.disk.percentage > 90 ? 'bg-red-500' : 
                      systemData.disk.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${systemData.disk.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {systemData.disk.used}GB / {systemData.disk.total}GB
                </div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">{t('network')}</h3>
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('inbound')}:</span>
                  <span className="font-medium">{systemData.network.inbound.toFixed(1)} MB/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('outbound')}:</span>
                  <span className="font-medium">{systemData.network.outbound.toFixed(1)} MB/s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('application_metrics')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('uptime')}</span>
                  <span className="font-medium">{formatUptime(systemData.application.uptime)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('total_requests')}</span>
                  <span className="font-medium">{systemData.application.requests.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('error_count')}</span>
                  <span className={`font-medium ${systemData.application.errors > 10 ? 'text-red-500' : 'text-green-500'}`}>
                    {systemData.application.errors}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('avg_response_time')}</span>
                  <span className={`font-medium ${getPerformanceColor(systemData.application.responseTime, { good: 200, warning: 500 })}`}>
                    {systemData.application.responseTime.toFixed(0)}ms
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('database_metrics')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('active_connections')}</span>
                  <span className="font-medium">{systemData.database.connections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('queries_per_minute')}</span>
                  <span className="font-medium">{systemData.database.queries}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('avg_query_time')}</span>
                  <span className={`font-medium ${getPerformanceColor(systemData.database.responseTime, { good: 10, warning: 50 })}`}>
                    {systemData.database.responseTime.toFixed(1)}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-4">
          {healthChecks.map(check => (
            <div key={check.service} className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    check.status === 'healthy' ? 'bg-green-500' :
                    check.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <h3 className="font-medium text-foreground">{check.service}</h3>
                    {check.error && <p className="text-sm text-red-500">{check.error}</p>}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                    {t(check.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {check.responseTime}ms • {new Date(check.lastCheck).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-background border border-border rounded-lg">
          <div className="divide-y divide-border">
            {logs.map(log => (
              <div key={log.id} className="p-4">
                <div className="flex items-start space-x-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{log.message}</p>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">{log.source}</span>
                      {log.details && (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {JSON.stringify(log.details, null, 2)}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMonitoring;