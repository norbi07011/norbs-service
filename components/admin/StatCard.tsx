import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string; // e.g., 'text-green-400'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="uiverse-card p-6">
       <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
      <div className="uiverse-card-content relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-glass ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
