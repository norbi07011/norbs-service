import { MOCK_CLIENTS } from '../data/mockData';
import { Client, ClientData } from '../types';

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getClients = async (): Promise<Client[]> => {
    await delay(300);
    return MOCK_CLIENTS;
};

export const getClientById = async (id: string): Promise<Client | undefined> => {
    await delay(300);
    return MOCK_CLIENTS.find(c => c.id === id);
};

export const createClient = async (clientData: ClientData): Promise<Client> => {
    await delay(500);
    const newClient: Client = {
        id: `client-${Date.now()}`,
        ...clientData,
        createdAt: new Date().toISOString(),
    };
    MOCK_CLIENTS.push(newClient);
    return newClient;
};

export const updateClient = async (id: string, clientData: ClientData): Promise<Client> => {
    await delay(500);
    const clientIndex = MOCK_CLIENTS.findIndex(c => c.id === id);
    if (clientIndex === -1) throw new Error("Client not found");
    
    const updatedClient = { ...MOCK_CLIENTS[clientIndex], ...clientData };
    MOCK_CLIENTS[clientIndex] = updatedClient;
    return updatedClient;
};

export const deleteClient = async (id: string): Promise<void> => {
    await delay(500);
    const index = MOCK_CLIENTS.findIndex(c => c.id === id);
    if (index > -1) {
        MOCK_CLIENTS.splice(index, 1);
    }
};