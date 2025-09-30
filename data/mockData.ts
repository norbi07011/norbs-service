import { User, Client, Project, File, Activity, Invoice, Task, Category } from '../types';

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Admin', email: 'owner@norbs.nl', role: 'owner' },
    { id: 'user-2', name: 'Test Client', email: 'client@example.com', role: 'client', clientId: 'client-1' }
];

export let MOCK_CLIENTS: Client[] = [
    { id: 'client-1', name: 'Innovate Inc.', email: 'contact@innovate.com', phone: '+123456789', language: 'en', notes: 'Primary contact is Jane Doe. Interested in Q3 campaign.', address: '123 Tech Avenue', city: 'Silicon Valley', zipCode: '94043', country: 'USA', vatNumber: 'US123456789', createdAt: new Date('2023-01-15T09:00:00Z').toISOString() },
    { id: 'client-2', name: 'Future Gadgets', email: 'hello@futuregadgets.io', phone: '+987654321', language: 'nl', notes: 'Focus on minimalist and techy designs.', address: 'Singel 250', city: 'Amsterdam', zipCode: '1016 AB', country: 'Netherlands', vatNumber: 'NL123456789B01', createdAt: new Date('2023-02-20T14:30:00Z').toISOString() },
];

export let MOCK_PROJECTS: Project[] = [
    { id: 'proj-1', clientId: 'client-1', name: 'Q3 Social Media Campaign', title: 'Q3 Social Media Campaign', description: 'Full social media graphic package for the upcoming quarter.', status: 'in-progress', startDate: new Date('2023-06-01T09:00:00Z').toISOString(), dueDate: new Date('2024-08-31T17:00:00Z').toISOString(), priority: 'high', tags: ['social media', 'graphics'], budgetType: 'hourly', budgetAmount: 40, hourlyRate: 75, createdAt: new Date().toISOString() },
    { id: 'proj-2', clientId: 'client-2', name: 'E-commerce Website Redesign', title: 'E-commerce Website Redesign', description: 'Modernize the existing webshop with a focus on mobile UX.', status: 'review', startDate: new Date('2023-05-10T09:00:00Z').toISOString(), dueDate: new Date('2024-07-25T17:00:00Z').toISOString(), priority: 'high', tags: ['website', 'react', 'ecommerce'], budgetType: 'fixed', budgetAmount: 4500, hourlyRate: 0, createdAt: new Date().toISOString() },
    { id: 'proj-3', clientId: 'client-1', name: 'Product Launch Video', title: 'Product Launch Video', description: 'Create a 2-minute promotional video for the new "Innovate X" product.', status: 'planning', startDate: new Date('2023-07-01T09:00:00Z').toISOString(), dueDate: new Date('2024-09-15T17:00:00Z').toISOString(), priority: 'medium', tags: ['video', 'promo'], budgetType: 'fixed', budgetAmount: 2200, hourlyRate: 0, createdAt: new Date().toISOString() },
    { id: 'proj-4', clientId: 'client-2', name: 'Brand Logo Refresh', title: 'Brand Logo Refresh', description: 'Update the company logo and provide a new style guide.', status: 'done', startDate: new Date('2023-04-01T09:00:00Z').toISOString(), dueDate: new Date('2023-04-30T17:00:00Z').toISOString(), priority: 'low', tags: ['branding', 'logo'], budgetType: 'fixed', budgetAmount: 1200, hourlyRate: 0, createdAt: new Date().toISOString() },
];

export let MOCK_FILES: File[] = [
    { id: 'file-1', projectId: 'proj-1', name: 'Campaign-Brief-v2.pdf', size: 120400, mimeType: 'application/pdf', uploadedBy: 'Admin', version: 2, createdAt: new Date().toISOString(), path: '#' },
    { id: 'file-2', projectId: 'proj-1', name: 'Post-Mockup-1.jpg', size: 850200, mimeType: 'image/jpeg', uploadedBy: 'Admin', version: 1, createdAt: new Date().toISOString(), path: '#' },
    { id: 'file-3', projectId: 'proj-2', name: 'Homepage-Wireframe.fig', size: 2300500, mimeType: 'application/figma', uploadedBy: 'Admin', version: 1, createdAt: new Date().toISOString(), path: '#' },
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'act-1', user: 'Admin', action: 'created project "Q3 Social Media Campaign"', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'act-2', user: 'Admin', action: 'uploaded file "Campaign-Brief-v2.pdf"', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'act-3', user: 'Test Client', action: 'logged in', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 'act-4', user: 'Admin', action: 'updated status of "E-commerce Website Redesign" to Review', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'act-5', user: 'Admin', action: 'added client "Future Gadgets"', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

export let MOCK_TASKS: Task[] = [
    { id: 'task-1', projectId: 'proj-1', title: 'Draft initial ad copy', description: 'Create 3 variations of ad copy for Facebook.', dueDate: new Date('2024-06-15T17:00:00Z').toISOString(), status: 'completed', priority: 'high', hoursLogged: 8, createdAt: new Date().toISOString() },
    { id: 'task-2', projectId: 'proj-1', title: 'Design visual assets', description: 'Create visuals for 5 ad sets.', dueDate: new Date('2024-06-30T17:00:00Z').toISOString(), status: 'pending', priority: 'medium', hoursLogged: 12.5, createdAt: new Date().toISOString() },
    { id: 'task-3', projectId: 'proj-2', title: 'Develop homepage component', description: 'Code the new hero section for the homepage.', dueDate: new Date('2024-05-30T17:00:00Z').toISOString(), status: 'completed', priority: 'high', hoursLogged: 16, createdAt: new Date().toISOString() },
    { id: 'task-4', projectId: 'proj-2', title: 'Setup payment gateway integration', description: 'Integrate Stripe for checkout.', dueDate: new Date('2024-06-20T17:00:00Z').toISOString(), status: 'pending', priority: 'low', hoursLogged: 0, createdAt: new Date().toISOString() },
];

export let MOCK_INVOICES: Invoice[] = [
    { id: 'inv-1', invoiceNumber: 'INV-2024-001', projectId: 'proj-4', clientId: 'client-2', issueDate: new Date('2023-05-01T09:00:00Z').toISOString(), dueDate: new Date('2023-05-15T09:00:00Z').toISOString(), status: 'paid', lineItems: [{ description: 'Brand Logo Refresh', quantity: 1, unitPrice: 1200 }], subtotal: 1200, tax: 252, total: 1452, notes: 'Thank you for your business!' },
    { id: 'inv-2', invoiceNumber: 'INV-2024-002', projectId: 'proj-2', clientId: 'client-2', issueDate: new Date('2024-07-01T09:00:00Z').toISOString(), dueDate: new Date('2024-07-15T09:00:00Z').toISOString(), status: 'overdue', lineItems: [{ description: 'E-commerce Website - 50% Deposit', quantity: 1, unitPrice: 2250 }], subtotal: 2250, tax: 472.5, total: 2722.5, notes: '50% deposit for website redesign.' },
];

export let MOCK_CATEGORIES: Category[] = [
    { id: 'cat-1', name: 'Koszulki', description: 'Produkty tekstylne - różne rodzaje koszulek', color: '#e11d48', icon: 'shirt', type: 'product', sortOrder: 1, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-15T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-15T09:00:00Z').toISOString() },
    { id: 'cat-2', name: 'Marketing', description: 'Kampanie marketingowe i promocyjne', color: '#3b82f6', icon: 'megaphone', type: 'project', sortOrder: 2, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-16T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-16T09:00:00Z').toISOString() },
    { id: 'cat-3', name: 'Strony Web', description: 'Projekty stron internetowych i aplikacji', color: '#10b981', icon: 'globe', type: 'project', sortOrder: 3, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-17T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-17T09:00:00Z').toISOString() },
    { id: 'cat-4', name: 'Materiały Graficzne', description: 'Pliki graficzne, loga, wizualizacje', color: '#f59e0b', icon: 'palette', type: 'file', sortOrder: 4, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-18T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-18T09:00:00Z').toISOString() },
    { id: 'cat-5', name: 'Konsultacje', description: 'Usługi doradcze i konsultacyjne', color: '#8b5cf6', icon: 'chat', type: 'service', sortOrder: 5, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-19T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-19T09:00:00Z').toISOString() },
    { id: 'cat-6', name: 'Polo', description: 'Koszulki typu polo', color: '#e11d48', icon: 'shirt', type: 'product', parentId: 'cat-1', sortOrder: 1, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-20T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-20T09:00:00Z').toISOString() },
    { id: 'cat-7', name: 'T-shirt', description: 'Klasyczne t-shirty', color: '#e11d48', icon: 'shirt', type: 'product', parentId: 'cat-1', sortOrder: 2, isActive: true, createdBy: 'user-1', createdAt: new Date('2024-01-21T09:00:00Z').toISOString(), updatedAt: new Date('2024-01-21T09:00:00Z').toISOString() },
];
