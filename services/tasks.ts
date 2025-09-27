import { MOCK_TASKS } from '../data/mockData';
import { Task, TaskData } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTasksByProjectId = async (projectId: string): Promise<Task[]> => {
    await delay(200);
    return MOCK_TASKS.filter(t => t.projectId === projectId);
};

export const createTask = async (projectId: string, taskData: TaskData): Promise<Task> => {
    await delay(500);
    const newTask: Task = {
        id: `task-${Date.now()}`,
        projectId,
        ...taskData,
        hoursLogged: taskData.hoursLogged || 0,
        createdAt: new Date().toISOString(),
    };
    MOCK_TASKS.push(newTask);
    return newTask;
};

export const updateTask = async (taskId: string, taskData: Partial<TaskData>): Promise<Task> => {
    await delay(500);
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    const updatedTask = { ...MOCK_TASKS[taskIndex], ...taskData };
    MOCK_TASKS[taskIndex] = updatedTask;
    return updatedTask;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await delay(500);
    const index = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (index > -1) {
        MOCK_TASKS.splice(index, 1);
    } else {
        throw new Error("Task not found");
    }
};