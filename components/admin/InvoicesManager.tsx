import React, { useState, useEffect } from 'react';
import InvoicesService from '../../src/services/invoices.js';
import { getTasksByProjectId } from '../../services/tasks';
import { Invoice, InvoiceStatus, Project, Task } from '../../types';
import { useToast } from '../../hooks/useToast';

interface InvoicesManagerProps {
    project: Project;
}

const statusColors: Record<InvoiceStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-300',
    sent: 'bg-blue-500/20 text-blue-300',
    paid: 'bg-green-500/20 text-green-300',
    overdue: 'bg-red-500/20 text-red-300',
};

const InvoicesManager: React.FC<InvoicesManagerProps> = ({ project }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const { addToast } = useToast();

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const [invoicesData, tasksData] = await Promise.all([
                InvoicesService.getProjectInvoices(project.id),
                getTasksByProjectId(project.id)
            ]);
            setInvoices(invoicesData.invoices || []);
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            addToast('Failed to fetch invoices', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInvoices();
    }, [project.id]);

    const handleGenerateInvoice = async () => {
        setIsGenerating(true);
        try {
            const totalHours = tasks.reduce((sum, task) => sum + task.hoursLogged, 0);
            
            // Create invoice data based on project
            const invoiceData = {
                clientId: project.clientId,
                projectId: project.id,
                amount: project.budgetType === 'fixed' ? project.budgetAmount : totalHours * (project.hourlyRate || 75),
                currency: 'EUR',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
                description: `Invoice for project: ${project.title}`,
                items: project.budgetType === 'fixed' 
                    ? [{ description: `Project: ${project.title}`, quantity: 1, unit_price: project.budgetAmount }]
                    : [{ description: 'Development & Design Hours', quantity: totalHours, unit_price: project.hourlyRate || 75 }]
            };
            
            await InvoicesService.createInvoice(invoiceData);
            addToast('Draft invoice generated successfully', 'success');
            await fetchInvoices();

        } catch (error) {
            console.error(error);
            addToast('Failed to generate invoice', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="uiverse-card p-6">
            <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
            <div className="uiverse-card-content relative z-10">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h2 className="text-xl font-bold text-foreground">Invoices</h2>
                    <button 
                        onClick={handleGenerateInvoice} 
                        disabled={isGenerating}
                        className="px-4 py-1.5 text-sm font-semibold text-accent-foreground bg-accent rounded-full hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Invoice'}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase">
                            <tr>
                                <th scope="col" className="px-4 py-3">Number</th>
                                <th scope="col" className="px-4 py-3">Issue Date</th>
                                <th scope="col" className="px-4 py-3">Due Date</th>
                                <th scope="col" className="px-4 py-3">Total</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-8">Loading invoices...</td></tr>
                            ) : invoices.length === 0 ? (
                                <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No invoices for this project.</td></tr>
                            ) : (
                                invoices.map(invoice => (
                                    <tr key={invoice.id} className="border-b border-border-color hover:bg-muted/50">
                                        <td className="px-4 py-4 font-medium text-foreground">{invoice.invoiceNumber}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-foreground font-semibold">€{invoice.total.toFixed(2)}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[invoice.status]}`}>{invoice.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoicesManager;
