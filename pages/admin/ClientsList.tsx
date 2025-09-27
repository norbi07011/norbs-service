import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getClients, deleteClient } from '../../services/clients';
import { Client } from '../../types';
import { useToast } from '../../hooks/useToast';

const ITEMS_PER_PAGE = 10;

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    if (!direction) return <span className="text-muted-foreground/50 text-xs">↕</span>;
    return direction === 'asc' ? <span className="text-foreground text-xs">▲</span> : <span className="text-foreground text-xs">▼</span>;
};

const ClientsList: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const { addToast } = useToast();

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            const data = await getClients();
            setClients(data);
            setLoading(false);
        };
        fetchClients();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            try {
                await deleteClient(id);
                setClients(clients.filter(c => c.id !== id));
                addToast('Client deleted successfully', 'success');
            } catch (error) {
                addToast('Failed to delete client', 'error');
            }
        }
    };

    const sortedAndFilteredClients = useMemo(() => {
        let filtered = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filtered;
    }, [clients, searchTerm, sortConfig]);

    const totalPages = Math.ceil(sortedAndFilteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = sortedAndFilteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const requestSort = (key: keyof Client) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (key: keyof Client) => {
        if (sortConfig.key !== key) return <SortIcon />;
        return <SortIcon direction={sortConfig.direction} />;
    };

    if (loading) return <p>Loading clients...</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Clients</h1>
                <NavLink to="/admin/clients/new" className="px-6 py-2 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-colors transform hover:scale-105 shadow-lg shadow-accent/30">
                    Add Client
                </NavLink>
            </div>

            <div className="uiverse-card p-6">
                 <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                 <div className="uiverse-card-content relative z-10">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full mb-6 px-4 py-2 bg-secondary border border-border rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('name')}>
                                        <div className="flex items-center gap-2">Name {renderSortIcon('name')}</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('email')}>
                                        <div className="flex items-center gap-2">Email {renderSortIcon('email')}</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">Phone</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClients.map(client => (
                                    <tr key={client.id} className="border-b border-border-color hover:bg-muted/50">
                                        <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{client.email}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{client.phone}</td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <NavLink to={`/admin/clients/edit/${client.id}`} className="font-medium text-accent hover:underline">Edit</NavLink>
                                            <button onClick={() => handleDelete(client.id)} className="font-medium text-destructive hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paginatedClients.length === 0 && <p className="text-center p-8 text-muted-foreground">No clients found.</p>}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center pt-4">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm bg-muted rounded-md disabled:opacity-50">Previous</button>
                            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm bg-muted rounded-md disabled:opacity-50">Next</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientsList;