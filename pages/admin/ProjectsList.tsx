import React, { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getProjects, deleteProject } from '../../services/projects';
import { getClients } from '../../services/clients';
import { Project, Client, ProjectStatus } from '../../types';
import { useToast } from '../../hooks/useToast';

const statusColors: Record<ProjectStatus, string> = {
    planning: 'bg-gray-500/20 text-gray-300',
    'in-progress': 'bg-blue-500/20 text-blue-300',
    review: 'bg-yellow-500/20 text-yellow-300',
    done: 'bg-green-500/20 text-green-300',
};

const ITEMS_PER_PAGE = 10;

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    if (!direction) return <span className="text-muted-foreground/50 text-xs">↕</span>;
    return direction === 'asc' ? <span className="text-foreground text-xs">▲</span> : <span className="text-foreground text-xs">▼</span>;
};


const ProjectsList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Project | 'clientName'; direction: 'asc' | 'desc' }>({ key: 'dueDate', direction: 'asc' });
    const { addToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [projectsData, clientsData] = await Promise.all([getProjects(), getClients()]);
            setProjects(projectsData);
            setClients(clientsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                setProjects(projects.filter(p => p.id !== id));
                addToast('Project deleted successfully', 'success');
            } catch (error) {
                addToast('Failed to delete project', 'error');
            }
        }
    };

    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown Client';
    
    const projectsWithClientNames = useMemo(() => projects.map(p => ({
        ...p,
        clientName: getClientName(p.clientId)
    })), [projects, clients]);

    const sortedAndFilteredProjects = useMemo(() => {
        let filtered = projectsWithClientNames
            .filter(p => statusFilter === 'all' || p.status === statusFilter)
            .filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.clientName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
        filtered.sort((a, b) => {
            const key = sortConfig.key;
            const valA = a[key as keyof typeof a];
            const valB = b[key as keyof typeof b];

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        return filtered;

    }, [projectsWithClientNames, searchTerm, statusFilter, sortConfig]);

    const totalPages = Math.ceil(sortedAndFilteredProjects.length / ITEMS_PER_PAGE);
    const paginatedProjects = sortedAndFilteredProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const requestSort = (key: keyof Project | 'clientName') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };
    
    const renderSortIcon = (key: keyof Project | 'clientName') => {
        if (sortConfig.key !== key) return <SortIcon />;
        return <SortIcon direction={sortConfig.direction} />;
    };

    if (loading) return <p>Loading projects...</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                <NavLink to="/admin/projects/new" className="px-6 py-2 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-colors transform hover:scale-105 shadow-lg shadow-accent/30">
                    Add Project
                </NavLink>
            </div>

            <div className="uiverse-card p-6">
                 <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                 <div className="uiverse-card-content relative z-10">
                    <div className="flex flex-wrap gap-4 items-center mb-6">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="flex-grow max-w-xs px-4 py-2 bg-secondary border border-border rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all text-foreground"
                        />
                        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} className="px-4 py-2 bg-secondary border border-border rounded-full focus:ring-accent focus:border-accent outline-none appearance-none">
                            <option value="all">All Statuses</option>
                            <option value="planning">Planning</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('title')}><div className="flex items-center gap-2">Project Title {renderSortIcon('title')}</div></th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('clientName')}><div className="flex items-center gap-2">Client {renderSortIcon('clientName')}</div></th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('dueDate')}><div className="flex items-center gap-2">Due Date {renderSortIcon('dueDate')}</div></th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort('status')}><div className="flex items-center gap-2">Status {renderSortIcon('status')}</div></th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProjects.map(project => (
                                    <tr key={project.id} className="border-b border-border-color hover:bg-muted/50">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <NavLink to={`/admin/projects/${project.id}`} className="hover:text-accent transition-colors">{project.title}</NavLink>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{project.clientName}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{new Date(project.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[project.status]}`}>{project.status.replace('-', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <NavLink to={`/admin/projects/edit/${project.id}`} className="font-medium text-accent hover:underline">Edit</NavLink>
                                            <button onClick={() => handleDelete(project.id)} className="font-medium text-destructive hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paginatedProjects.length === 0 && <p className="text-center p-8 text-muted-foreground">No projects found.</p>}
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

export default ProjectsList;