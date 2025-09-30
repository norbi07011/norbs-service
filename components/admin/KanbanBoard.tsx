import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Task, Project, Client } from '../../types';

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  maxTasks?: number;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

interface DraggableTaskProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  isDragging: boolean;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({ task, onTaskClick, isDragging }) => {
  const { t } = useTranslations();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-green-500 bg-green-500/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-background border border-border rounded-lg p-3 mb-3 cursor-pointer transition-all hover:shadow-md border-l-4 ${getPriorityColor('')} ${
        isDragging ? 'opacity-50 transform rotate-2' : ''
      }`}
      onClick={() => onTaskClick(task)}
      draggable
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-foreground text-sm leading-tight">{task.title}</h4>
        <div className="flex items-center space-x-1 ml-2">
          {getStatusIcon(task.status)}
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <span className={`flex items-center ${
              new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {task.hoursLogged > 0 && (
          <span className="flex items-center text-muted-foreground">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {task.hoursLogged}h
          </span>
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onTaskMove, onTaskClick, onAddTask }) => {
  const { t } = useTranslations();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (draggedTask && draggedTask !== taskId) return;

    // Find the source column
    let fromColumnId = '';
    for (const column of columns) {
      if (column.tasks.some(task => task.id === taskId)) {
        fromColumnId = column.id;
        break;
      }
    }

    if (fromColumnId && fromColumnId !== toColumnId) {
      onTaskMove(taskId, fromColumnId, toColumnId);
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {columns.map(column => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-80 bg-muted/30 rounded-lg p-4 border-2 transition-all ${
            dragOverColumn === column.id 
              ? 'border-accent border-dashed bg-accent/10' 
              : 'border-transparent'
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${column.color === '#ef4444' ? 'bg-red-500' : 
                           column.color === '#f59e0b' ? 'bg-yellow-500' : 
                           column.color === '#10b981' ? 'bg-green-500' : 
                           column.color === '#3b82f6' ? 'bg-blue-500' : 
                           column.color === '#8b5cf6' ? 'bg-purple-500' : 'bg-gray-500'}`}
              />
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <span className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground">
                {column.tasks.length}
                {column.maxTasks && `/${column.maxTasks}`}
              </span>
            </div>
            
            <button
              onClick={() => onAddTask(column.id)}
              className="p-1 hover:bg-muted rounded transition-colors"
              title={`Add task to ${column.title}`}
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Column Tasks */}
          <div className="min-h-[200px]">
            {column.tasks.map(task => (
              <div
                key={task.id}
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <DraggableTask
                  task={task}
                  onTaskClick={onTaskClick}
                  isDragging={draggedTask === task.id}
                />
              </div>
            ))}
            
            {column.tasks.length === 0 && (
              <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-muted rounded-lg">
                <svg className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm">Drop tasks here</p>
              </div>
            )}
          </div>

          {/* Column Footer */}
          {column.maxTasks && column.tasks.length >= column.maxTasks && (
            <div className="mt-2 text-xs text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded">
              ⚠️ Column limit reached
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;