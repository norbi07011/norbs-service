import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Project, Task } from '../../types';
import CalendarView from './CalendarView';
import TimeTracker from './TimeTracker';
import KanbanBoard, { KanbanColumn } from './KanbanBoard';
import GanttChart, { GanttTask } from './GanttChart';

interface PlanningSystemProps {
  projects: Project[];
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

type ViewMode = 'calendar' | 'kanban' | 'gantt' | 'time-tracker';

const PlanningSystem: React.FC<PlanningSystemProps> = ({
  projects,
  tasks,
  onTaskUpdate,
  onProjectUpdate,
  onAddTask,
  onAddProject
}) => {
  const { t } = useTranslations();
  const [currentView, setCurrentView] = useState<ViewMode>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Transform tasks to calendar events
  const calendarEvents = tasks.map(task => ({
    id: task.id,
    title: task.title,
    date: task.dueDate || new Date().toISOString(),
    type: 'task' as const,
    priority: task.priority,
    description: task.description,
    projectId: task.projectId
  }));

  // Transform projects to calendar events
  const projectEvents = projects.map(project => ({
    id: project.id,
    title: project.name,
    date: project.deadline || new Date().toISOString(),
    type: 'project' as const,
    priority: 'medium' as const,
    description: project.description,
    projectId: project.id
  }));

  const allCalendarEvents = [...calendarEvents, ...projectEvents];

  // Kanban columns configuration
  const kanbanColumns: KanbanColumn[] = [
    {
      id: 'backlog',
      title: t('backlog'),
      color: '#64748b',
      tasks: tasks.filter(task => task.status === 'pending' && !task.dueDate)
    },
    {
      id: 'todo',
      title: t('to_do'),
      color: '#3b82f6',
      tasks: tasks.filter(task => task.status === 'pending' && task.dueDate)
    },
    {
      id: 'in-progress',
      title: t('in_progress'),
      color: '#f59e0b',
      tasks: tasks.filter(task => task.status === 'pending' && task.hoursLogged > 0)
    },
    {
      id: 'review',
      title: t('review'),
      color: '#8b5cf6',
      tasks: tasks.filter(task => task.status === 'pending' && task.priority === 'high')
    },
    {
      id: 'done',
      title: t('done'),
      color: '#10b981',
      tasks: tasks.filter(task => task.status === 'completed')
    }
  ];

  // Transform tasks to Gantt format
  const ganttTasks: GanttTask[] = [
    ...projects.map(project => ({
      id: project.id,
      name: project.name,
      startDate: new Date(project.createdAt),
      endDate: new Date(project.deadline || new Date().toISOString()),
      progress: project.progress || 0,
      priority: 'medium' as const,
      type: 'project' as const,
      assignee: project.clientName
    })),
    ...tasks.map(task => ({
      id: task.id,
      name: task.title,
      startDate: new Date(task.createdAt || new Date().toISOString()),
      endDate: new Date(task.dueDate || new Date().toISOString()),
      progress: task.status === 'completed' ? 100 : task.hoursLogged * 10,
      priority: task.priority,
      type: 'task' as const,
      projectId: task.projectId
    }))
  ];

  const handleKanbanTaskMove = (taskId: string, fromColumn: string, toColumn: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let updates: Partial<Task> = {};

    switch (toColumn) {
      case 'done':
        updates.status = 'completed';
        break;
      case 'backlog':
      case 'todo':
      case 'in-progress':
      case 'review':
        updates.status = 'pending';
        break;
    }

    onTaskUpdate(taskId, updates);
  };

  const handleGanttTaskUpdate = (taskId: string, updates: Partial<GanttTask>) => {
    if (updates.startDate || updates.endDate) {
      const taskUpdates: Partial<Task> = {};
      if (updates.startDate) taskUpdates.createdAt = updates.startDate.toISOString();
      if (updates.endDate) taskUpdates.dueDate = updates.endDate.toISOString();
      
      onTaskUpdate(taskId, taskUpdates);
    }
  };

  const handleCalendarEventClick = (event: any) => {
    if (event.type === 'task') {
      const task = tasks.find(t => t.id === event.id);
      if (task) {
        setSelectedTask(task);
        setShowTaskModal(true);
      }
    }
  };

  const handleTaskClick = (task: Task | GanttTask) => {
    const actualTask = 'title' in task ? task : tasks.find(t => t.id === task.id);
    if (actualTask) {
      setSelectedTask(actualTask);
      setShowTaskModal(true);
    }
  };

  const handleAddKanbanTask = (columnId: string) => {
    const newTask: Omit<Task, 'id'> = {
      title: t('new_task'),
      description: '',
      status: columnId === 'done' ? 'completed' : 'pending',
      priority: 'medium',
      projectId: '',
      hoursLogged: 0,
      createdAt: new Date().toISOString(),
      dueDate: columnId === 'todo' ? new Date().toISOString() : undefined
    };
    
    onAddTask(newTask);
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <CalendarView
            events={allCalendarEvents}
            onEventClick={handleCalendarEventClick}
            onDateClick={(date) => {
              const newTask: Omit<Task, 'id'> = {
                title: t('new_task'),
                description: '',
                status: 'pending',
                priority: 'medium',
                projectId: '',
                hoursLogged: 0,
                createdAt: new Date().toISOString(),
                dueDate: date.toISOString()
              };
              onAddTask(newTask);
            }}
          />
        );

      case 'kanban':
        return (
          <KanbanBoard
            columns={kanbanColumns}
            onTaskMove={handleKanbanTaskMove}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddKanbanTask}
          />
        );

      case 'gantt':
        return (
          <GanttChart
            tasks={ganttTasks}
            onTaskUpdate={handleGanttTaskUpdate}
            onTaskClick={handleTaskClick}
            viewMode="weeks"
          />
        );

      case 'time-tracker':
        return (
          <TimeTracker
            onTimeEntryAdd={(entry) => {
              // Handle time entry addition
              console.log('Time entry added:', entry);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with View Switcher */}
      <div className="bg-background border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('planning_system')}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('comprehensive_project_planning_tools')}
            </p>
          </div>

          {/* View Selector */}
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 rounded transition-all text-sm font-medium ${
                currentView === 'calendar'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('calendar')}
            </button>

            <button
              onClick={() => setCurrentView('kanban')}
              className={`px-4 py-2 rounded transition-all text-sm font-medium ${
                currentView === 'kanban'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              {t('kanban')}
            </button>

            <button
              onClick={() => setCurrentView('gantt')}
              className={`px-4 py-2 rounded transition-all text-sm font-medium ${
                currentView === 'gantt'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('gantt')}
            </button>

            <button
              onClick={() => setCurrentView('time-tracker')}
              className={`px-4 py-2 rounded transition-all text-sm font-medium ${
                currentView === 'time-tracker'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('time_tracker')}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">{projects.length}</div>
            <div className="text-sm text-muted-foreground">{t('active_projects')}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">{tasks.filter(t => t.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground">{t('pending_tasks')}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="text-sm text-muted-foreground">{t('completed_tasks')}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">{tasks.reduce((sum, task) => sum + task.hoursLogged, 0)}</div>
            <div className="text-sm text-muted-foreground">{t('total_hours')}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderViewContent()}
      </div>

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{t('task_details')}</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Close modal"
                aria-label="Close task details modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('title')}</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-2"
                  title="Task title"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('description')}</label>
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-2 h-20"
                  title="Task description"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t('status')}</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value as 'pending' | 'completed' })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    title="Task status"
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="completed">{t('completed')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t('priority')}</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                    title="Task priority"
                  >
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    onTaskUpdate(selectedTask.id, selectedTask);
                    setShowTaskModal(false);
                  }}
                  className="flex-1 bg-accent text-accent-foreground px-4 py-2 rounded hover:bg-accent/80"
                >
                  {t('save_changes')}
                </button>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-border rounded hover:bg-muted"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningSystem;