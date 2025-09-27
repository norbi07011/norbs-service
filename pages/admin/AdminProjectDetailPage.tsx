import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getProjectById } from '../../services/projects';
import { getClientById } from '../../services/clients';
import { getTasksByProjectId } from '../../services/tasks';
import { Project, Client, ProjectStatus, Task } from '../../types';
import FilesManager from './FilesManager';
import TasksManager from '../../components/admin/TasksManager';
import InvoicesManager from '../../components/admin/InvoicesManager';

const statusColors: Record<ProjectStatus, string> = {
    planning: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
    'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    review: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    done: 'bg-green-500/20 text-green-300 border-green-500/50',
};

const FinancialSummary: React.FC<{ project: Project; tasks: Task[] }> = ({ project, tasks }) => {
    const totalHoursLogged = tasks.reduce((sum, task) => sum + task.hoursLogged, 0);
    
    let billableAmount = 0;
    if (project.budgetType === 'fixed') {
        billableAmount = project.budgetAmount;
    } else {
        billableAmount = totalHoursLogged * project.hourlyRate;
    }

    return (
        <div className="uiverse-card p-6">
            <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
            <div className="uiverse-card-content relative z-10">
                <h2 className="text-xl font-bold text-foreground mb-4">Financial Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <h3 className="text-muted-foreground font-semibold mb-1">Budget Type</h3>
                        <p className="text-foreground capitalize">{project.budgetType}</p>
                    </div>
                     <div>
                        <h3 className="text-muted-foreground font-semibold mb-1">Budget</h3>
                        <p className="text-foreground">{project.budgetType === 'fixed' ? `€${project.budgetAmount.toFixed(2)}` : `${project.budgetAmount} hrs`}</p>
                    </div>
                     <div>
                        <h3 className="text-muted-foreground font-semibold mb-1">Total Logged</h3>
                        <p className="text-foreground">{totalHoursLogged.toFixed(2)} hrs</p>
                    </div>
                     <div>
                        <h3 className="text-muted-foreground font-semibold mb-1">Billable Amount</h3>
                        <p className="text-foreground font-bold text-lg">€{billableAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AdminProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!id) return;
            setLoading(true);
            const projectData = await getProjectById(id);
            if (projectData) {
                setProject(projectData);
                const [clientData, tasksData] = await Promise.all([
                    getClientById(projectData.clientId),
                    getTasksByProjectId(id)
                ]);
                setClient(clientData);
                setTasks(tasksData);
            }
            setLoading(false);
        };
        fetchProjectDetails();
    }, [id]);

    if (loading) return <p>Loading project details...</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
                    <p className="text-muted-foreground">
                        For <span className="font-semibold text-accent">{client?.name}</span>
                    </p>
                </div>
                 <NavLink to={`/admin/projects/edit/${project.id}`} className="px-5 py-2 text-sm font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 transition-colors">
                    Edit Project
                </NavLink>
            </div>

            <div className="uiverse-card p-6">
                <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                <div className="uiverse-card-content relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h3 className="text-muted-foreground font-semibold mb-1">Status</h3>
                            <p className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusColors[project.status]}`}>{project.status.replace('-', ' ')}</p>
                        </div>
                        <div>
                            <h3 className="text-muted-foreground font-semibold mb-1">Start Date</h3>
                            <p className="text-foreground">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 className="text-muted-foreground font-semibold mb-1">Due Date</h3>
                            <p className="text-foreground">{new Date(project.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-border-color">
                         <h3 className="text-muted-foreground font-semibold mb-1">Description</h3>
                         <p className="text-foreground whitespace-pre-wrap">{project.description}</p>
                    </div>
                     <div className="mt-6 pt-6 border-t border-border-color">
                         <h3 className="text-muted-foreground font-semibold mb-1">Tags</h3>
                         <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                                <span key={tag} className="inline-block bg-secondary text-muted-foreground text-xs font-semibold mr-2 mb-2 px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
            
            <FinancialSummary project={project} tasks={tasks} />

            <InvoicesManager project={project} />

            <TasksManager projectId={project.id} />

            <FilesManager projectId={project.id} />
        </div>
    );
};

export default AdminProjectDetailPage;
