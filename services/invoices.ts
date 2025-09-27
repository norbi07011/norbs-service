import { MOCK_INVOICES } from '../data/mockData';
import { Invoice, InvoiceLineItem, Project, InvoiceStatus } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TAX_RATE = 0.21; // 21%

export const getInvoices = async (): Promise<Invoice[]> => {
    await delay(200);
    return MOCK_INVOICES;
};

export const getInvoicesByProjectId = async (projectId: string): Promise<Invoice[]> => {
    await delay(200);
    return MOCK_INVOICES.filter(i => i.projectId === projectId);
};

export const createInvoice = async (project: Project, totalHours: number): Promise<Invoice> => {
    await delay(500);
    
    let lineItems: InvoiceLineItem[] = [];
    if (project.budgetType === 'fixed') {
        lineItems.push({
            description: `Project: ${project.title}`,
            quantity: 1,
            unitPrice: project.budgetAmount
        });
    } else {
        lineItems.push({
            description: `Development & Design Hours`,
            quantity: totalHours,
            unitPrice: project.hourlyRate
        });
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 14); // Due in 14 days

    const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2024-${String(MOCK_INVOICES.length + 1).padStart(3, '0')}`,
        projectId: project.id,
        clientId: project.clientId,
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'draft',
        lineItems,
        subtotal,
        tax,
        total,
        notes: 'Thank you for your business!',
    };

    MOCK_INVOICES.push(newInvoice);
    return newInvoice;
};

export const updateInvoiceStatus = async (invoiceId: string, status: InvoiceStatus): Promise<Invoice> => {
    await delay(400);
    const invoiceIndex = MOCK_INVOICES.findIndex(i => i.id === invoiceId);
    if (invoiceIndex === -1) {
        throw new Error("Invoice not found");
    }
    MOCK_INVOICES[invoiceIndex].status = status;
    return MOCK_INVOICES[invoiceIndex];
};