import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { getClients } from '../../services/clients';
import { getProjects } from '../../services/projects';
import { getInvoices } from '../../services/invoices'; // New
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { Client, Project, Activity, Invoice, InvoiceStatus } from '../../types';
import { NavLink } from 'react-router-dom';

const statusColors: Record<InvoiceStatus, string> = {
    draft: 'text-gray-400',
    sent: 'text-blue-400',
    paid: 'text-green-400',
    overdue: 'text-red-400',
};


const DashboardPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);

    useEffect(() => {
        const fetchData = async () => {
            const [clientData, projectData, invoiceData] = await Promise.all([
                getClients(),
                getProjects(),
                getInvoices()
            ]);
            setClients(clientData);
            setProjects(projectData);
            setInvoices(invoiceData);
        };
        fetchData();
    }, []);
    
    const upcomingDeadlines = projects
        .filter(p => new Date(p.dueDate) > new Date() && p.status !== 'done')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);

    const outstandingRevenue = invoices
        .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.total, 0);
    
    const overdueInvoices = invoices
        .filter(inv => inv.status === 'overdue')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown';


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Total Revenue" 
                    value={`€${totalRevenue.toFixed(2)}`} 
                    colorClass="text-green-400"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} 
                />
                 <StatCard 
                    title="Outstanding Revenue" 
                    value={`€${outstandingRevenue.toFixed(2)}`} 
                    colorClass="text-yellow-400"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>} 
                />
                 <StatCard 
                    title="Active Projects" 
                    value={projects.filter(p => p.status === 'in-progress').length} 
                    colorClass="text-brand-blue"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>} 
                />
                <StatCard 
                    title="Total Clients" 
                    value={clients.length} 
                    colorClass="text-brand-purple"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} 
                />
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Overdue Invoices */}
                <div className="uiverse-card">
                     <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                    <div className="uiverse-card-content relative z-10">
                        <h2 className="text-xl font-bold text-foreground mb-4">Overdue Invoices</h2>
                        <ul className="space-y-3">
                            {overdueInvoices.length > 0 ? overdueInvoices.map(invoice => (
                                <li key={invoice.id} className="flex justify-between items-center p-3 bg-glass rounded-lg">
                                    <div>
                                        <NavLink to={`/admin/projects/${invoice.projectId}`} className="font-semibold text-foreground hover:text-accent transition-colors">
                                            {invoice.invoiceNumber} - {getClientName(invoice.clientId)}
                                        </NavLink>
                                        <p className={`text-sm font-bold ${statusColors[invoice.status]}`}>€{invoice.total.toFixed(2)}</p>
                                    </div>
                                    <span className="text-sm font-medium text-destructive">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                                </li>
                            )) : <p className="text-muted-foreground text-sm">No overdue invoices. Great job!</p>}
                        </ul>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="uiverse-card">
                     <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                    <div className="uiverse-card-content relative z-10">
                        <h2 className="text-xl font-bold text-foreground mb-4">Upcoming Deadlines</h2>
                        <ul className="space-y-3">
                            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map(project => (
                                <li key={project.id} className="flex justify-between items-center p-3 bg-glass rounded-lg">
                                    <div>
                                        <NavLink to={`/admin/projects/${project.id}`} className="font-semibold text-foreground hover:text-accent transition-colors">{project.title}</NavLink>
                                        <p className="text-sm text-muted-foreground">{clients.find(c => c.id === project.clientId)?.name}</p>
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{new Date(project.dueDate).toLocaleDateString()}</span>
                                </li>
                            )) : <p className="text-muted-foreground text-sm">No upcoming deadlines.</p>}
                        </ul>
                    </div>
                </div>

                
            </div>

        </div>
    );
};

export default DashboardPage;
