export type Language = 'nl' | 'en' | 'tr' | 'pl' | 'de' | 'fr';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

// Types for Admin Panel & Client Portal
export type UserRole = 'owner' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string; // For client users
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: Language;
  notes: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  vatNumber: string;
  createdAt: string;
}

export interface ClientData extends Omit<Client, 'id' | 'createdAt'> {}

export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'done';
export type ProjectPriority = 'low' | 'medium' | 'high';
export type BudgetType = 'fixed' | 'hourly';

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  priority: ProjectPriority;
  tags: string[];
  budgetType: BudgetType;
  budgetAmount: number;
  hourlyRate: number;
  createdAt: string;
}

export interface ProjectData extends Omit<Project, 'id' | 'createdAt'> {}

export interface File {
    id: string;
    projectId: string;
    name: string;
    size: number; // in bytes
    mimeType: string;
    uploadedBy: string; // user name or ID
    version: number;
    createdAt: string;
    path: string; // url to file
}

export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  hoursLogged: number;
  createdAt: string;
}

export interface TaskData extends Omit<Task, 'id' | 'createdAt' | 'projectId'> {}


export interface Activity {
    id: string;
    user: string; // User name
    action: string;
    timestamp: string;
    meta?: Record<string, any>;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

// Invoicing Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    projectId: string;
    clientId: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    tax: number; // tax amount
    total: number;
    notes: string;
}

export type CategoryType = 'project' | 'file' | 'service' | 'product';

export interface Category {
    id: string;
    name: string;
    description?: string;
    color: string;
    icon: string;
    type: CategoryType;
    parentId?: string;
    sortOrder: number;
    isActive: boolean;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryData extends Omit<Category, 'id' | 'createdAt' | 'updatedAt'> {}
