import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, createProject, updateProject } from '../../services/projects';
import { getClients } from '../../services/clients';
import { ProjectData, Client } from '../../types';
import { useToast } from '../../hooks/useToast';

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const { addToast } = useToast();

    const [clients, setClients] = useState<Client[]>([]);
    const [formData, setFormData] = useState<ProjectData>({
        title: '',
        description: '',
        clientId: '',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        tags: [],
        budgetType: 'fixed',
        budgetAmount: 0,
        hourlyRate: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const clientData = await getClients();
            setClients(clientData);

            if (isEditing) {
                const project = await getProjectById(id!);
                if (project) {
                    setFormData({
                       ...project,
                       startDate: new Date(project.startDate).toISOString().split('T')[0],
                       dueDate: new Date(project.dueDate).toISOString().split('T')[0],
                    });
                }
            } else if (clientData.length > 0) {
                 setFormData(prev => ({ ...prev, clientId: clientData[0].id }));
            }
        };
        fetchData();
    }, [id, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setFormData(prev => ({ ...prev, tags }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateProject(id!, formData);
                addToast('Project updated successfully', 'success');
            } else {
                await createProject(formData);
                addToast('Project created successfully', 'success');
            }
            navigate('/admin/projects');
        } catch (error) {
            addToast(`Failed to ${isEditing ? 'update' : 'create'} project`, 'error');
        }
    };
    
    const inputClass = "w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:ring-accent focus:border-accent outline-none";
    const labelClass = "block text-sm font-medium text-muted-foreground mb-2";

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
            <div className="uiverse-card p-8">
                 <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                 <div className="uiverse-card-content relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className={labelClass}>Project Title</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClass} />
                        </div>

                         <div>
                            <label htmlFor="description" className={labelClass}>Description</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass}></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="clientId" className={labelClass}>Client</label>
                                <select name="clientId" id="clientId" value={formData.clientId} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className={labelClass}>Status</label>
                                <select name="status" id="status" value={formData.status} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                    <option value="planning">Planning</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="startDate" className={labelClass}>Start Date</label>
                                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="dueDate" className={labelClass}>Due Date</label>
                                <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} required className={inputClass} />
                            </div>
                        </div>
                        
                         <fieldset className="pt-6 border-t border-border-color">
                            <legend className="text-lg font-semibold text-foreground mb-4">Budget</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="budgetType" className={labelClass}>Budget Type</label>
                                    <select name="budgetType" id="budgetType" value={formData.budgetType} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                        <option value="fixed">Fixed Price</option>
                                        <option value="hourly">Hourly Rate</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="budgetAmount" className={labelClass}>{formData.budgetType === 'fixed' ? 'Project Budget (€)' : 'Budgeted Hours'}</label>
                                    <input type="number" name="budgetAmount" id="budgetAmount" value={formData.budgetAmount} onChange={handleChange} required min="0" className={inputClass} />
                                </div>
                                {formData.budgetType === 'hourly' && (
                                    <div>
                                        <label htmlFor="hourlyRate" className={labelClass}>Hourly Rate (€)</label>
                                        <input type="number" name="hourlyRate" id="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required min="0" className={inputClass} />
                                    </div>
                                )}
                            </div>
                        </fieldset>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="priority" className={labelClass}>Priority</label>
                                <select name="priority" id="priority" value={formData.priority} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="tags" className={labelClass}>Tags (comma-separated)</label>
                                <input type="text" name="tags" id="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className={inputClass} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => navigate('/admin/projects')} className="px-6 py-2 font-semibold text-foreground bg-muted rounded-full hover:bg-secondary">Cancel</button>
                            <button type="submit" className="px-6 py-2 font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80">{isEditing ? 'Save Changes' : 'Create Project'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
