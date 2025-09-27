import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg transition-colors duration-200 flex-grow justify-center lg:flex-grow-0 lg:justify-start ${
      isActive
        ? 'bg-accent/20 text-accent font-semibold'
        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`;

  const iconClass = "w-6 h-6 flex-shrink-0";

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="lg:sticky lg:top-28">
        <div className="hidden lg:block mb-6">
            <h2 className="text-xl font-bold text-foreground">Welcome, {user?.name}</h2>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex flex-row lg:flex-col gap-2 p-2 bg-muted/50 rounded-xl lg:p-0 lg:bg-transparent lg:rounded-none">
          <NavLink to="/admin/dashboard" className={navLinkClass}>
             <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span className="text-sm sm:text-base">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/clients" className={navLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path></svg>
            <span className="text-sm sm:text-base">Clients</span>
          </NavLink>
          <NavLink to="/admin/projects" className={navLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            <span className="text-sm sm:text-base">Projects</span>
          </NavLink>
          <NavLink to="/admin/categories" className={navLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="3"></rect><rect x="14" y="3" width="7" height="3"></rect><rect x="14" y="10" width="7" height="3"></rect><rect x="3" y="17" width="7" height="3"></rect><rect x="14" y="17" width="7" height="3"></rect><rect x="3" y="10" width="7" height="3"></rect></svg>
            <span className="text-sm sm:text-base">Categories</span>
          </NavLink>
          <NavLink to="/admin/invoicing" className={navLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            <span className="text-sm sm:text-base">Invoicing</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;