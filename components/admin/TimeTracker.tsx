import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface TimeTrackingEntry {
  id: string;
  projectId: string;
  taskId?: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  isActive: boolean;
  createdBy: string;
  tags: string[];
}

interface TimeTrackerProps {
  projectId?: string;
  taskId?: string;
  onTimeEntryAdd?: (entry: TimeTrackingEntry) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ projectId, taskId, onTimeEntryAdd }) => {
  const { t } = useTranslations();
  const [activeEntry, setActiveEntry] = useState<TimeTrackingEntry | null>(null);
  const [entries, setEntries] = useState<TimeTrackingEntry[]>([]);
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeEntry) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - activeEntry.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
      setTimerInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [activeEntry]);

  const startTimer = () => {
    if (!description.trim()) {
      alert('Please enter a description for the time entry');
      return;
    }

    const newEntry: TimeTrackingEntry = {
      id: `time-${Date.now()}`,
      projectId: projectId || '',
      taskId,
      description: description.trim(),
      startTime: new Date(),
      duration: 0,
      isActive: true,
      createdBy: 'current-user',
      tags: selectedTags
    };

    setActiveEntry(newEntry);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (!activeEntry) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeEntry.startTime.getTime()) / 60000); // minutes

    const completedEntry: TimeTrackingEntry = {
      ...activeEntry,
      endTime,
      duration,
      isActive: false
    };

    setEntries(prev => [completedEntry, ...prev]);
    setActiveEntry(null);
    setElapsedTime(0);
    setDescription('');
    setSelectedTags([]);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalTime = () => {
    const total = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const current = activeEntry ? Math.floor(elapsedTime / 60) : 0;
    return total + current;
  };

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <div className="uiverse-card p-6">
        <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
        <div className="uiverse-card-content relative z-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {activeEntry ? 'Timer Running' : 'Start Time Tracking'}
          </h3>

          {activeEntry ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-accent mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-muted-foreground">{activeEntry.description}</div>
                {activeEntry.tags.length > 0 && (
                  <div className="flex justify-center space-x-2 mt-2">
                    {activeEntry.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={stopTimer}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Stop Timer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  What are you working on?
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description..."
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:ring-accent focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Development', 'Design', 'Meeting', 'Planning', 'Testing'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startTimer}
                  disabled={!description.trim()}
                  className="px-8 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground rounded-lg transition-colors font-medium"
                >
                  Start Timer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-glass p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="text-2xl font-bold text-foreground">
            {formatDuration(getTotalTime())}
          </div>
        </div>
        <div className="bg-glass p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">This Week</div>
          <div className="text-2xl font-bold text-foreground">
            {formatDuration(getTotalTime() * 2.5)} {/* Mock data */}
          </div>
        </div>
        <div className="bg-glass p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Entries</div>
          <div className="text-2xl font-bold text-foreground">
            {entries.length}
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="uiverse-card p-6">
        <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
        <div className="uiverse-card-content relative z-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Time Entries</h3>
          
          {entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No time entries yet. Start tracking your time!
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-glass rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{entry.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.startTime.toLocaleTimeString()} - {entry.endTime?.toLocaleTimeString()}
                    </div>
                    {entry.tags.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{formatDuration(entry.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;