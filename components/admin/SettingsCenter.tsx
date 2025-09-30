import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    allowedIPs: string[];
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    slackWebhook: string;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionDays: number;
    cloudStorage: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    maxFileSize: number;
  };
}

const SettingsCenter: React.FC = () => {
  const { t } = useTranslations();
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'notifications' | 'backup' | 'performance'>('general');
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Norbs Premium Marketing',
      siteUrl: 'https://norbs.nl',
      adminEmail: 'admin@norbs.nl',
      timezone: 'Europe/Amsterdam',
      language: 'nl',
      maintenanceMode: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false
      },
      allowedIPs: []
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      slackWebhook: ''
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudStorage: true
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: false,
      maxFileSize: 50
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const updateNestedSettings = (section: keyof SystemSettings, nestedField: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...(prev[section] as any)[nestedField],
          [field]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Here you would save to your backend
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
    // Show success notification
  };

  const resetSettings = () => {
    if (confirm(t('confirm_reset_settings'))) {
      // Reset to defaults
      setUnsavedChanges(false);
    }
  };

  const sections = [
    {
      id: 'general',
      name: t('general_settings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'security',
      name: t('security_settings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      id: 'notifications',
      name: t('notification_settings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 1v16l5-5H9V1z" />
        </svg>
      )
    },
    {
      id: 'backup',
      name: t('backup_settings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    },
    {
      id: 'performance',
      name: t('performance_settings'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('site_name')}</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('site_url')}</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('admin_email')}</label>
          <input
            type="email"
            value={settings.general.adminEmail}
            onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('timezone')}</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
          >
            <option value="Europe/Amsterdam">Europe/Amsterdam</option>
            <option value="Europe/Warsaw">Europe/Warsaw</option>
            <option value="Europe/Berlin">Europe/Berlin</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">{t('maintenance_mode')}</h4>
          <p className="text-sm text-muted-foreground">{t('enable_maintenance_mode_description')}</p>
        </div>
        <button
          onClick={() => updateSettings('general', 'maintenanceMode', !settings.general.maintenanceMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.general.maintenanceMode ? 'bg-accent' : 'bg-muted'
          }`}
          title="Toggle maintenance mode"
          aria-label={`Maintenance mode is ${settings.general.maintenanceMode ? 'enabled' : 'disabled'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">{t('two_factor_authentication')}</h4>
          <p className="text-sm text-muted-foreground">{t('enable_2fa_description')}</p>
        </div>
        <button
          onClick={() => updateSettings('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.security.twoFactorAuth ? 'bg-accent' : 'bg-muted'
          }`}
          title="Toggle two-factor authentication"
          aria-label={`Two-factor authentication is ${settings.security.twoFactorAuth ? 'enabled' : 'disabled'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{t('session_timeout')} ({t('minutes')})</label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
          className="w-full max-w-xs bg-background border border-border rounded-lg px-3 py-2"
          min="5"
          max="480"
        />
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">{t('password_policy')}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('minimum_length')}</label>
            <input
              type="number"
              value={settings.security.passwordPolicy.minLength}
              onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2"
              min="6"
              max="32"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t('require_uppercase')}</span>
            <button
              onClick={() => updateNestedSettings('security', 'passwordPolicy', 'requireUppercase', !settings.security.passwordPolicy.requireUppercase)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.security.passwordPolicy.requireUppercase ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.passwordPolicy.requireUppercase ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t('require_numbers')}</span>
            <button
              onClick={() => updateNestedSettings('security', 'passwordPolicy', 'requireNumbers', !settings.security.passwordPolicy.requireNumbers)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.security.passwordPolicy.requireNumbers ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.passwordPolicy.requireNumbers ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{t('require_symbols')}</span>
            <button
              onClick={() => updateNestedSettings('security', 'passwordPolicy', 'requireSymbols', !settings.security.passwordPolicy.requireSymbols)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.security.passwordPolicy.requireSymbols ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.passwordPolicy.requireSymbols ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">{t('email_notifications')}</h4>
            <p className="text-sm text-muted-foreground">{t('send_notifications_via_email')}</p>
          </div>
          <button
            onClick={() => updateSettings('notifications', 'emailEnabled', !settings.notifications.emailEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications.emailEnabled ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.notifications.emailEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">{t('push_notifications')}</h4>
            <p className="text-sm text-muted-foreground">{t('send_browser_push_notifications')}</p>
          </div>
          <button
            onClick={() => updateSettings('notifications', 'pushEnabled', !settings.notifications.pushEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications.pushEnabled ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.notifications.pushEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('slack_webhook_url')}</label>
          <input
            type="url"
            value={settings.notifications.slackWebhook}
            onChange={(e) => updateSettings('notifications', 'slackWebhook', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
            placeholder="https://hooks.slack.com/services/..."
          />
          <p className="text-xs text-muted-foreground mt-1">{t('slack_webhook_description')}</p>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">{t('automatic_backups')}</h4>
          <p className="text-sm text-muted-foreground">{t('enable_automatic_backups_description')}</p>
        </div>
        <button
          onClick={() => updateSettings('backup', 'autoBackup', !settings.backup.autoBackup)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.backup.autoBackup ? 'bg-accent' : 'bg-muted'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('backup_frequency')}</label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => updateSettings('backup', 'backupFrequency', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
          >
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('retention_days')}</label>
          <input
            type="number"
            value={settings.backup.retentionDays}
            onChange={(e) => updateSettings('backup', 'retentionDays', parseInt(e.target.value))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2"
            min="7"
            max="365"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">{t('cloud_storage')}</h4>
          <p className="text-sm text-muted-foreground">{t('store_backups_in_cloud')}</p>
        </div>
        <button
          onClick={() => updateSettings('backup', 'cloudStorage', !settings.backup.cloudStorage)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.backup.cloudStorage ? 'bg-accent' : 'bg-muted'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings.backup.cloudStorage ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">{t('cache_enabled')}</h4>
            <p className="text-sm text-muted-foreground">{t('enable_caching_description')}</p>
          </div>
          <button
            onClick={() => updateSettings('performance', 'cacheEnabled', !settings.performance.cacheEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.performance.cacheEnabled ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.performance.cacheEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">{t('compression_enabled')}</h4>
            <p className="text-sm text-muted-foreground">{t('enable_gzip_compression')}</p>
          </div>
          <button
            onClick={() => updateSettings('performance', 'compressionEnabled', !settings.performance.compressionEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.performance.compressionEnabled ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.performance.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{t('max_file_size')} (MB)</label>
          <input
            type="number"
            value={settings.performance.maxFileSize}
            onChange={(e) => updateSettings('performance', 'maxFileSize', parseInt(e.target.value))}
            className="w-full max-w-xs bg-background border border-border rounded-lg px-3 py-2"
            min="1"
            max="500"
          />
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'backup': return renderBackupSettings();
      case 'performance': return renderPerformanceSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('settings_center')}</h2>
          <p className="text-muted-foreground">{t('configure_system_settings')}</p>
        </div>
        
        {unsavedChanges && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-yellow-600">{t('unsaved_changes')}</span>
            <button
              onClick={resetSettings}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted"
            >
              {t('reset')}
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80"
            >
              {t('save_changes')}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {sections.find(s => s.id === activeSection)?.name}
            </h3>
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCenter;