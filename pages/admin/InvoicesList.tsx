import React, { useState, useEffect, useMemo } from 'react';
import { getInvoices, updateInvoiceStatus } from '../../services/invoices';
import { getClients } from '../../services/clients';
import { Invoice, Client, InvoiceStatus } from '../../types';
import { useToast } from '../../hooks/useToast';
import { NavLink } from 'react-router-dom';

const statusColors: Record<InvoiceStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-300 border-transparent',
    sent: 'bg-blue-500/20 text-blue-300 border-transparent',
    paid: 'bg-green-500/20 text-green-300 border-transparent',
    overdue: 'bg-red-500/20 text-red-300 border-transparent',
};

const InvoicesList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
    const [clientFilter, setClientFilter] = useState<string | 'all'>('all');
    const { addToast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invoicesData, clientsData] = await Promise.all([getInvoices(), getClients()]);
            setInvoices(invoicesData);
            setClients(clientsData);
        } catch (error) {
            addToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown Client';

    const handleStatusChange = async (invoiceId: string, newStatus: InvoiceStatus) => {
        try {
            await updateInvoiceStatus(invoiceId, newStatus);
            addToast('Invoice status updated', 'success');
            setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
        } catch (error) {
            addToast('Failed to update status', 'error');
        }
    };

    const filteredInvoices = useMemo(() => {
        return invoices
            .filter(inv => statusFilter === 'all' || inv.status === statusFilter)
            .filter(inv => clientFilter === 'all' || inv.clientId === clientFilter)
            .filter(inv =>
                inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                getClientName(inv.clientId).toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [invoices, searchTerm, statusFilter, clientFilter, clients]);

    if (loading) return <p>Loading invoices...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Invoicing</h1>

            <div className="uiverse-card p-6">
                <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                <div className="uiverse-card-content relative z-10">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by number or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow w-full sm:w-auto px-4 py-2 bg-secondary border border-border rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground"
                        />
                        <select 
                            value={statusFilter} 
                            onChange={e => setStatusFilter(e.target.value as any)} 
                            className="px-4 py-2 bg-secondary border border-border rounded-full focus:ring-accent focus:border-accent outline-none appearance-none"
                            aria-label="Filtruj po statusie"
                            title="Filtruj po statusie"
                        >
                            <option value="all">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <select 
                            value={clientFilter} 
                            onChange={e => setClientFilter(e.target.value)} 
                            className="px-4 py-2 bg-secondary border border-border rounded-full focus:ring-accent focus:border-accent outline-none appearance-none"
                            aria-label="Filtruj po kliencie"
                            title="Filtruj po kliencie"
                        >
                            <option value="all">All Clients</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Number</th>
                                    <th scope="col" className="px-6 py-3">Client</th>
                                    <th scope="col" className="px-6 py-3">Project</th>
                                    <th scope="col" className="px-6 py-3">Total</th>
                                    <th scope="col" className="px-6 py-3">Due Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(invoice => (
                                    <tr key={invoice.id} className="border-b border-border-color hover:bg-muted/50">
                                        <td className="px-6 py-4 font-medium text-foreground">{invoice.invoiceNumber}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{getClientName(invoice.clientId)}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <NavLink to={`/admin/projects/${invoice.projectId}`} className="hover:text-accent transition-colors">
                                                View Project
                                            </NavLink>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-foreground">€{invoice.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={invoice.status} 
                                                onChange={(e) => handleStatusChange(invoice.id, e.target.value as InvoiceStatus)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full capitalize border-0 appearance-none focus:ring-0 ${statusColors[invoice.status]}`}
                                                aria-label={`Zmień status faktury ${invoice.invoiceNumber}`}
                                                title={`Zmień status faktury ${invoice.invoiceNumber}`}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="sent">Sent</option>
                                                <option value="paid">Paid</option>
                                                <option value="overdue">Overdue</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredInvoices.length === 0 && <p className="text-center p-8 text-muted-foreground">No invoices found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicesList;