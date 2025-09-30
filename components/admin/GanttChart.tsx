import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Project, Task, Client } from '../../types';

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies?: string[];
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  projectId?: string;
  type: 'project' | 'task' | 'milestone';
}

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskUpdate: (taskId: string, updates: Partial<GanttTask>) => void;
  onTaskClick: (task: GanttTask) => void;
  viewMode: 'days' | 'weeks' | 'months';
  startDate?: Date;
  endDate?: Date;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskClick, 
  viewMode = 'weeks',
  startDate,
  endDate 
}) => {
  const { t } = useTranslations();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [resizingTask, setResizingTask] = useState<string | null>(null);
  const [viewportStart, setViewportStart] = useState<Date>(startDate || new Date());
  const [viewportEnd, setViewportEnd] = useState<Date>(endDate || new Date());

  // Calculate viewport dates
  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      const end = new Date(today);
      end.setDate(end.getDate() + 30);
      
      setViewportStart(start);
      setViewportEnd(end);
    } else {
      setViewportStart(startDate);
      setViewportEnd(endDate);
    }
  }, [startDate, endDate, tasks]);

  // Generate time periods based on view mode
  const generateTimePeriods = () => {
    const periods = [];
    const current = new Date(viewportStart);
    
    while (current <= viewportEnd) {
      const period = new Date(current);
      periods.push(period);
      
      switch (viewMode) {
        case 'days':
          current.setDate(current.getDate() + 1);
          break;
        case 'weeks':
          current.setDate(current.getDate() + 7);
          break;
        case 'months':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }
    
    return periods;
  };

  const timePeriods = generateTimePeriods();
  const totalDays = Math.ceil((viewportEnd.getTime() - viewportStart.getTime()) / (1000 * 60 * 60 * 24));
  const dayWidth = 40; // pixels per day

  // Calculate task position and width
  const getTaskPosition = (task: GanttTask) => {
    const taskStart = Math.max(task.startDate.getTime(), viewportStart.getTime());
    const taskEnd = Math.min(task.endDate.getTime(), viewportEnd.getTime());
    
    const startOffset = (taskStart - viewportStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);
    
    return {
      left: startOffset * dayWidth,
      width: Math.max(duration * dayWidth, 20) // minimum 20px width
    };
  };

  // Get task color based on type and priority
  const getTaskColor = (task: GanttTask) => {
    if (task.type === 'milestone') {
      return 'bg-purple-500';
    }
    
    switch (task.priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const formatPeriodLabel = (date: Date) => {
    switch (viewMode) {
      case 'days':
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      case 'weeks':
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
      case 'months':
        return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };

  const handleTaskDrag = (e: React.MouseEvent, taskId: string) => {
    setDraggedTask(taskId);
    const startX = e.clientX;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaDays = deltaX / dayWidth;
      
      const newStartDate = new Date(task.startDate);
      newStartDate.setDate(newStartDate.getDate() + deltaDays);
      
      const duration = task.endDate.getTime() - task.startDate.getTime();
      const newEndDate = new Date(newStartDate.getTime() + duration);
      
      onTaskUpdate(taskId, {
        startDate: newStartDate,
        endDate: newEndDate
      });
    };

    const handleMouseUp = () => {
      setDraggedTask(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTaskResize = (e: React.MouseEvent, taskId: string, direction: 'start' | 'end') => {
    e.stopPropagation();
    setResizingTask(taskId);
    const startX = e.clientX;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaDays = deltaX / dayWidth;
      
      if (direction === 'start') {
        const newStartDate = new Date(task.startDate);
        newStartDate.setDate(newStartDate.getDate() + deltaDays);
        
        if (newStartDate < task.endDate) {
          onTaskUpdate(taskId, { startDate: newStartDate });
        }
      } else {
        const newEndDate = new Date(task.endDate);
        newEndDate.setDate(newEndDate.getDate() + deltaDays);
        
        if (newEndDate > task.startDate) {
          onTaskUpdate(taskId, { endDate: newEndDate });
        }
      }
    };

    const handleMouseUp = () => {
      setResizingTask(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{t('gantt_chart')}</h3>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{t('view')}:</span>
              <select 
                className="bg-background border border-border rounded px-2 py-1 text-sm"
                value={viewMode}
                onChange={(e) => {/* Handle view mode change */}}
              >
                <option value="days">{t('days')}</option>
                <option value="weeks">{t('weeks')}</option>
                <option value="months">{t('months')}</option>
              </select>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  const newStart = new Date(viewportStart);
                  const newEnd = new Date(viewportEnd);
                  const diff = newEnd.getTime() - newStart.getTime();
                  newStart.setTime(newStart.getTime() - diff);
                  newEnd.setTime(newEnd.getTime() - diff);
                  setViewportStart(newStart);
                  setViewportEnd(newEnd);
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  const today = new Date();
                  setViewportStart(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
                  setViewportEnd(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));
                }}
                className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded hover:bg-accent/80"
              >
                {t('today')}
              </button>
              
              <button 
                onClick={() => {
                  const newStart = new Date(viewportStart);
                  const newEnd = new Date(viewportEnd);
                  const diff = newEnd.getTime() - newStart.getTime();
                  newStart.setTime(newStart.getTime() + diff);
                  newEnd.setTime(newEnd.getTime() + diff);
                  setViewportStart(newStart);
                  setViewportEnd(newEnd);
                }}
                className="p-1 hover:bg-muted rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Task List */}
        <div className="w-80 border-r border-border bg-muted/20">
          {/* Task List Header */}
          <div className="p-3 border-b border-border bg-muted/30">
            <h4 className="font-medium text-sm text-foreground">{t('tasks')}</h4>
          </div>
          
          {/* Task Rows */}
          <div className="divide-y divide-border">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onTaskClick(task)}
              >
                <div className="flex items-center space-x-2">
                  {task.type === 'milestone' ? (
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12L8 10l2-2 2 2-2 2z"/>
                    </svg>
                  ) : (
                    <div className={`w-3 h-3 rounded-sm ${getTaskColor(task)}`} />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{task.name}</p>
                    {task.assignee && (
                      <p className="text-xs text-muted-foreground">{task.assignee}</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {Math.round(task.progress)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-x-auto">
          {/* Timeline Header */}
          <div className="border-b border-border bg-muted/30 sticky top-0 z-10">
            <div 
              className="flex"
              style={{ width: totalDays * dayWidth }}
            >
              {timePeriods.map((period, index) => (
                <div 
                  key={index}
                  className="border-r border-border last:border-r-0 px-2 py-3 text-xs text-center text-muted-foreground min-w-0"
                  style={{ 
                    width: viewMode === 'days' ? dayWidth : 
                           viewMode === 'weeks' ? dayWidth * 7 : 
                           dayWidth * 30 
                  }}
                >
                  {formatPeriodLabel(period)}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Tasks */}
          <div className="relative">
            {/* Today Line */}
            {(() => {
              const today = new Date();
              if (today >= viewportStart && today <= viewportEnd) {
                const todayOffset = (today.getTime() - viewportStart.getTime()) / (1000 * 60 * 60 * 24);
                return (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                    style={{ left: todayOffset * dayWidth }}
                  />
                );
              }
              return null;
            })()}

            {/* Task Bars */}
            <div style={{ width: totalDays * dayWidth }}>
              {tasks.map((task, index) => {
                const position = getTaskPosition(task);
                
                return (
                  <div
                    key={task.id}
                    className="relative border-b border-border hover:bg-muted/30"
                    style={{ height: 60 }}
                  >
                    {/* Task Bar */}
                    <div
                      className={`absolute top-3 h-6 rounded cursor-move transition-all ${getTaskColor(task)} ${
                        draggedTask === task.id ? 'opacity-50' : ''
                      }`}
                      style={{
                        left: position.left,
                        width: position.width
                      }}
                      onMouseDown={(e) => handleTaskDrag(e, task.id)}
                      onClick={() => onTaskClick(task)}
                    >
                      {/* Progress Bar */}
                      <div 
                        className="h-full bg-black/20 rounded"
                        style={{ width: `${task.progress}%` }}
                      />
                      
                      {/* Task Name */}
                      {position.width > 60 && (
                        <span className="absolute left-2 top-0.5 text-xs text-white font-medium truncate">
                          {task.name}
                        </span>
                      )}
                      
                      {/* Resize Handles */}
                      <div 
                        className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100"
                        onMouseDown={(e) => handleTaskResize(e, task.id, 'start')}
                      />
                      <div 
                        className="absolute right-0 top-0 w-1 h-full cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100"
                        onMouseDown={(e) => handleTaskResize(e, task.id, 'end')}
                      />
                    </div>

                    {/* Dependencies */}
                    {task.dependencies && task.dependencies.map(depId => {
                      const depTask = tasks.find(t => t.id === depId);
                      if (!depTask) return null;
                      
                      const depPosition = getTaskPosition(depTask);
                      const taskPosition = getTaskPosition(task);
                      
                      return (
                        <svg
                          key={depId}
                          className="absolute top-0 left-0 pointer-events-none"
                          style={{
                            width: Math.max(depPosition.left + depPosition.width, taskPosition.left),
                            height: 60
                          }}
                        >
                          <path
                            d={`M ${depPosition.left + depPosition.width} 15 L ${taskPosition.left} 15`}
                            stroke="#64748b"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                            fill="none"
                          />
                        </svg>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;