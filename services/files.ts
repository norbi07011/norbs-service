import { MOCK_FILES } from '../data/mockData';
import { File } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getFilesByProjectId = async (projectId: string): Promise<File[]> => {
    await delay(200);
    return MOCK_FILES.filter(f => f.projectId === projectId);
};

export const uploadFile = async (projectId: string, file: globalThis.File): Promise<File> => {
    await delay(1000);
    
    // In a real app, you would upload the file to a server/storage and get back a URL.
    // Here, we just create a mock file record.
    const newFile: File = {
        id: `file-${Date.now()}`,
        projectId,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedBy: 'Admin', // Should come from logged in user
        version: 1,
        createdAt: new Date().toISOString(),
        path: '#' // This would be the URL from the server
    };

    MOCK_FILES.push(newFile);
    return newFile;
};

export const deleteFile = async (fileId: string): Promise<void> => {
    await delay(500);
    const index = MOCK_FILES.findIndex(f => f.id === fileId);
    if (index > -1) {
        MOCK_FILES.splice(index, 1);
    } else {
        throw new Error("File not found");
    }
};