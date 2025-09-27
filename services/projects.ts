import { MOCK_PROJECTS } from '../data/mockData';
import { Project, ProjectData } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getProjects = async (): Promise<Project[]> => {
    await delay(300);
    return MOCK_PROJECTS;
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
    await delay(300);
    return MOCK_PROJECTS.find(p => p.id === id);
};

export const getProjectsByClientId = async (clientId: string): Promise<Project[]> => {
    await delay(300);
    return MOCK_PROJECTS.filter(p => p.clientId === clientId);
};

export const createProject = async (projectData: ProjectData): Promise<Project> => {
    await delay(500);
    const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
    };
    MOCK_PROJECTS.push(newProject);
    return newProject;
};

export const updateProject = async (id: string, projectData: ProjectData): Promise<Project> => {
    await delay(500);
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error("Project not found");

    const updatedProject = { ...MOCK_PROJECTS[projectIndex], ...projectData };
    MOCK_PROJECTS[projectIndex] = updatedProject;
    return updatedProject;
};

export const deleteProject = async (id: string): Promise<void> => {
    await delay(500);
    const index = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (index > -1) {
        MOCK_PROJECTS.splice(index, 1);
    }
};