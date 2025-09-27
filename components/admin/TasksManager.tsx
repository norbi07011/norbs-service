import React, { useState, useEffect, FormEvent, useMemo, useRef } from 'react';
import { getTasksByProjectId, createTask, updateTask, deleteTask } from '../../services/tasks';
import { Task, TaskData } from '../../types';
import { useToast } from '../../hooks/useToast';

interface TasksManagerProps {
    projectId: string;
}

const TaskForm: React.FC<{
    projectId: string;
    taskToEdit?: Task | null;
    onSave: () => void;
    onCancel: () => void;
}> = ({ projectId, taskToEdit, onSave, onCancel }) => {
    const isEditing = !!taskToEdit;
    const { addToast } = useToast();
    const [formData, setFormData] = useState<TaskData>({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        hoursLogged: 0,
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description,
                dueDate: new Date(taskToEdit.dueDate).toISOString().split('T')[0],
                status: taskToEdit.status,
                hoursLogged: taskToEdit.hoursLogged || 0,
            });
        } else {
             setFormData({
                title: '',
                description: '',
                dueDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                hoursLogged: 0,
            });
        }
    }, [taskToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateTask(taskToEdit!.id, formData);
                addToast('Task updated successfully', 'success');
            } else {
                await createTask(projectId, formData);
                addToast('Task created successfully', 'success');
            }
            onSave();
        } catch (error) {
            addToast(`Failed to ${isEditing ? 'update' : 'create'} task`, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">{isEditing ? 'Edit Task' : 'Add New Task'}</h3>
                <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-accent focus:border-accent outline-none" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-accent focus:border-accent outline-none"></textarea>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
                    <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-accent focus:border-accent outline-none" />
                </div>
                 <div>
                    <label htmlFor="hoursLogged" className="block text-sm font-medium text-muted-foreground mb-1">Hours Logged</label>
                    <input type="number" name="hoursLogged" id="hoursLogged" value={formData.hoursLogged} onChange={handleChange} step="0.1" min="0" className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-accent focus:border-accent outline-none appearance-none">
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-foreground bg-muted rounded-full hover:bg-secondary">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80">{isEditing ? 'Save Changes' : 'Add Task'}</button>
            </div>
        </form>
    );
};

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
    if (direction === 'asc') return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7-7-7-7"/></svg>;
    if (direction === 'desc') return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;
    return null;
};

const SortButton: React.FC<{ active: boolean; direction?: 'asc' | 'desc'; onClick: () => void; children: React.ReactNode }> = ({ active, direction, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors ${active ? 'bg-accent text-accent-foreground' : 'bg-secondary hover:bg-muted text-foreground'}`}
    >
        {children}
        {active && <SortIcon direction={direction} />}
    </button>
);


const TasksManager: React.FC<TasksManagerProps> = ({ projectId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [viewingTask, setViewingTask] = useState<Task | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
    const [sortConfig, setSortConfig] = useState<{ key: 'dueDate' | 'title' | 'hoursLogged'; direction: 'asc' | 'desc' }>({ key: 'dueDate', direction: 'asc' });
    const { addToast } = useToast();
    const formModalRef = useRef<HTMLDivElement>(null);
    const detailModalRef = useRef<HTMLDivElement>(null);


    const fetchTasks = async () => {
        setLoading(true);
        const data = await getTasksByProjectId(projectId);
        setTasks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if(isFormOpen) handleFormCancel();
                if(viewingTask) handleCloseView();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
             if (isFormOpen && formModalRef.current && !formModalRef.current.contains(event.target as Node)) {
                handleFormCancel();
            }
             if (viewingTask && detailModalRef.current && !detailModalRef.current.contains(event.target as Node)) {
                handleCloseView();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFormOpen, viewingTask]);

    const requestSort = (key: 'dueDate' | 'title' | 'hoursLogged') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const displayedTasks = useMemo(() => {
        return [...tasks]
            .filter(task => {
                if (filterStatus === 'all') return true;
                return task.status === filterStatus;
            })
            .sort((a, b) => {
                const key = sortConfig.key;
                let comparison = 0;

                if (key === 'dueDate') {
                    const dateA = new Date(a.dueDate).getTime();
                    const dateB = new Date(b.dueDate).getTime();
                    if (dateA > dateB) comparison = 1;
                    if (dateA < dateB) comparison = -1;
                } else if (key === 'title') {
                    comparison = a.title.localeCompare(b.title);
                } else { // hoursLogged
                    if (a[key] > b[key]) comparison = 1;
                    if (a[key] < b[key]) comparison = -1;
                }

                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
    }, [tasks, filterStatus, sortConfig]);
    
    const handleToggleStatus = async (task: Task) => {
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await updateTask(task.id, { status: newStatus });
            addToast('Task status updated', 'success');
            fetchTasks(); // refetch to update list
        } catch (error) {
            addToast('Failed to update task status', 'error');
        }
    };
    
    const handleDelete = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                addToast('Task deleted successfully', 'success');
                fetchTasks(); // refetch
            } catch (error) {
                addToast('Failed to delete task', 'error');
            }
        }
    };
    
    const handleEdit = (task: Task) => {
        setTaskToEdit(task);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setTaskToEdit(null);
        setIsFormOpen(true);
    };
    
    const handleFormSave = () => {
        setIsFormOpen(false);
        setTaskToEdit(null);
        fetchTasks();
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setTaskToEdit(null);
    };

    const handleCloseView = () => {
        setViewingTask(null);
    };

    const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
        const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending';
        
        const handleActionClick = (e: React.MouseEvent) => {
          e.stopPropagation();
        };

        return (
            <div 
                onClick={() => setViewingTask(task)}
                className={`p-4 rounded-lg bg-glass flex items-start gap-4 transition-all cursor-pointer hover:bg-muted/50 ${task.status === 'completed' ? 'opacity-60' : ''} ${isOverdue ? 'border-l-4 border-destructive' : 'border-l-4 border-transparent'}`}>
                <div onClick={handleActionClick}>
                    <input 
                        type="checkbox" 
                        checked={task.status === 'completed'} 
                        onChange={() => handleToggleStatus(task)}
                        className="mt-1 form-checkbox h-5 w-5 rounded bg-secondary border-border text-accent focus:ring-accent cursor-pointer"
                    />
                </div>
                <div className="flex-grow">
                    <p className={`font-semibold text-foreground ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                     <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                         <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-destructive font-semibold' : ''}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                           Due: {new Date(task.dueDate).toLocaleDateString()}
                         </span>
                         <span className="flex items-center gap-1.5 font-semibold text-foreground">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                           {task.hoursLogged}h Logged
                         </span>
                     </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2" onClick={handleActionClick}>
                    <button onClick={() => handleEdit(task)} className="text-muted-foreground hover:text-accent p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="text-muted-foreground hover:text-destructive p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="uiverse-card p-6">
            <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
            <div className="uiverse-card-content relative z-10">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h2 className="text-xl font-bold text-foreground">Project Tasks</h2>
                    <button onClick={handleAddNew} className="px-4 py-1.5 text-sm font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80">
                        Add Task
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
                        {(['all', 'pending', 'completed'] as const).map(status => (
                             <button 
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors ${filterStatus === status ? 'bg-accent text-accent-foreground' : 'bg-secondary hover:bg-muted text-foreground'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                        <SortButton active={sortConfig.key === 'dueDate'} direction={sortConfig.key === 'dueDate' ? sortConfig.direction : undefined} onClick={() => requestSort('dueDate')}>Due Date</SortButton>
                        <SortButton active={sortConfig.key === 'title'} direction={sortConfig.key === 'title' ? sortConfig.direction : undefined} onClick={() => requestSort('title')}>Title</SortButton>
                        <SortButton active={sortConfig.key === 'hoursLogged'} direction={sortConfig.key === 'hoursLogged' ? sortConfig.direction : undefined} onClick={() => requestSort('hoursLogged')}>Hours</SortButton>
                    </div>
                </div>
                
                {isFormOpen && (
                    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
                         <div ref={formModalRef} className="uiverse-card w-full max-w-2xl">
                             <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                             <div className="uiverse-card-content relative z-10 w-full">
                                <TaskForm projectId={projectId} taskToEdit={taskToEdit} onSave={handleFormSave} onCancel={handleFormCancel} />
                             </div>
                         </div>
                    </div>
                )}

                {viewingTask && (
                    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
                        <div ref={detailModalRef} className="uiverse-card w-full max-w-2xl">
                             <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                             <div className="uiverse-card-content relative z-10 w-full">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-foreground mb-4">{viewingTask.title}</h3>
                                    <button onClick={handleCloseView} className="text-muted-foreground hover:text-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <p className="text-muted-foreground mb-6 whitespace-pre-wrap text-sm">{viewingTask.description || 'No description provided.'}</p>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6 p-4 bg-glass rounded-lg">
                                    <div>
                                        <p className="font-semibold text-muted-foreground">Status</p>
                                        <p className="capitalize">{viewingTask.status}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-muted-foreground">Due Date</p>
                                        <p>{new Date(viewingTask.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-muted-foreground">Hours Logged</p>
                                        <p>{viewingTask.hoursLogged}h</p>
                                    </div>
                                    <div className="col-span-2 sm:col-span-3">
                                        <p className="font-semibold text-muted-foreground">Created On</p>
                                        <p>{new Date(viewingTask.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
                                    <button onClick={handleCloseView} className="px-4 py-2 text-sm font-semibold text-foreground bg-muted rounded-full hover:bg-secondary">Close</button>
                                    <button 
                                        onClick={() => {
                                            handleEdit(viewingTask);
                                            handleCloseView();
                                        }}
                                        className="px-4 py-2 text-sm font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80"
                                    >
                                        Edit Task
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}


                <div className="mt-4 space-y-3">
                    {loading && <p>Loading tasks...</p>}
                    {!loading && displayedTasks.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No tasks match your criteria.</p>}
                    {displayedTasks.map(task => <TaskItem key={task.id} task={task} />)}
                </div>
            </div>
        </div>
    );
};

export default TasksManager;