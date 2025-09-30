import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  userCount: number;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  createdAt: Date;
  avatar?: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    // Mock data
    setUsers([
      {
        id: '1',
        name: 'Jan Kowalski',
        email: 'jan@norbs.nl',
        role: 'admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 30),
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Anna Nowak',
        email: 'anna@norbs.nl',
        role: 'project_manager',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
        createdAt: new Date('2024-02-20')
      },
      {
        id: '3',
        name: 'Piotr Wiśniewski',
        email: 'piotr@norbs.nl',
        role: 'client',
        status: 'pending',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        createdAt: new Date('2024-03-10')
      }
    ]);

    setRoles([
      {
        id: 'admin',
        name: 'Administrator',
        permissions: ['users:read', 'users:write', 'projects:read', 'projects:write', 'system:config'],
        description: 'Full system access with all permissions',
        userCount: 1
      },
      {
        id: 'project_manager',
        name: 'Project Manager',
        permissions: ['projects:read', 'projects:write', 'clients:read', 'tasks:read', 'tasks:write'],
        description: 'Manage projects, clients and tasks',
        userCount: 3
      },
      {
        id: 'client',
        name: 'Client',
        permissions: ['projects:read', 'tasks:read', 'files:read'],
        description: 'View assigned projects and files',
        userCount: 12
      }
    ]);

    setPermissions([
      { id: 'users:read', name: 'View Users', category: 'User Management', description: 'View user list and details' },
      { id: 'users:write', name: 'Manage Users', category: 'User Management', description: 'Create, edit and delete users' },
      { id: 'projects:read', name: 'View Projects', category: 'Project Management', description: 'View project details' },
      { id: 'projects:write', name: 'Manage Projects', category: 'Project Management', description: 'Create and edit projects' },
      { id: 'clients:read', name: 'View Clients', category: 'Client Management', description: 'View client information' },
      { id: 'clients:write', name: 'Manage Clients', category: 'Client Management', description: 'Create and edit clients' },
      { id: 'tasks:read', name: 'View Tasks', category: 'Task Management', description: 'View task details' },
      { id: 'tasks:write', name: 'Manage Tasks', category: 'Task Management', description: 'Create and edit tasks' },
      { id: 'files:read', name: 'View Files', category: 'File Management', description: 'Download and view files' },
      { id: 'system:config', name: 'System Configuration', category: 'System', description: 'Access system settings' }
    ]);
  }, []);

  const getStatusColor = (status: SystemUser['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700';
      case 'inactive': return 'bg-red-500/20 text-red-700';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'admin': return 'bg-purple-500/20 text-purple-700';
      case 'project_manager': return 'bg-blue-500/20 text-blue-700';
      case 'client': return 'bg-green-500/20 text-green-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (confirm(t('confirm_delete_user'))) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('user_management')}</h2>
          <p className="text-muted-foreground">{t('manage_users_roles_permissions')}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowRoleModal(true)}
            className="bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80"
          >
            {t('add_role')}
          </button>
          <button 
            onClick={() => setShowUserModal(true)}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/80"
          >
            {t('add_user')}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('users')} ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'roles'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('roles')} ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'permissions'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('permissions')} ({permissions.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-background border border-border rounded-lg">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">{t('user')}</th>
                  <th className="text-left p-4 font-medium text-foreground">{t('role')}</th>
                  <th className="text-left p-4 font-medium text-foreground">{t('status')}</th>
                  <th className="text-left p-4 font-medium text-foreground">{t('last_login')}</th>
                  <th className="text-left p-4 font-medium text-foreground">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-accent">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {roles.find(r => r.id === user.role)?.name || user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {t(user.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {formatLastLogin(user.lastLogin)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-accent hover:text-accent/80"
                          title={t('edit_user')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`${user.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                          title={user.status === 'active' ? t('deactivate') : t('activate')}
                        >
                          {user.status === 'active' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-500 hover:text-red-600"
                          title={t('delete_user')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => (
                <div key={role.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{role.name}</h3>
                    <span className="text-sm text-muted-foreground">{role.userCount} users</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">{t('permissions')}:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(permission => (
                        <span key={permission} className="px-2 py-1 bg-muted rounded text-xs">
                          {permissions.find(p => p.id === permission)?.name || permission}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-muted rounded text-xs">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-accent text-accent-foreground px-3 py-1 rounded text-sm hover:bg-accent/80">
                      {t('edit')}
                    </button>
                    <button className="px-3 py-1 border border-border rounded text-sm hover:bg-muted">
                      {t('view_users')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="p-6">
            <div className="space-y-6">
              {Array.from(new Set(permissions.map(p => p.category))).map(category => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.filter(p => p.category === category).map(permission => (
                      <div key={permission.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{permission.name}</h4>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{permission.id}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;