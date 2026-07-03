import React from 'react';

interface UnitToggleGroupProps {
  units: { id: string; label: string }[];
  activeUnit: string;
  onChange: (unit: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function UnitToggleGroup({ units, activeUnit, onChange, size = 'md' }: UnitToggleGroupProps) {
  const sizeClasses = {
    sm: 'text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5',
    md: 'text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2',
    lg: 'text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-2.5'
  };

  const activeStyle = 'bg-gradient-to-br from-indigo-500  text-white shadow-md shadow-indigo-500/25 border-transparent ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 scale-100 sm:scale-105 z-20';
  const inactiveStyle = 'bg-bg-card text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-transparent shadow-sm hover:shadow cursor-pointer';

  return (
    <div className="flex flex-wrap items-center justify-center bg-slate-100/90 dark:bg-slate-900/90 p-1 sm:p-1.5 rounded-xl sm:rounded-[1.25rem] shadow-inner w-full sm:w-fit backdrop-blur-sm gap-1 border border-slate-200/50 dark:border-slate-800">
      {units.map((unit) => {
        const isActive = activeUnit === unit.id;
        return (
          <button
            key={unit.id}
            onClick={() => onChange(unit.id)}
            className={`relative flex min-w-[3.5rem] sm:min-w-[4rem] flex-1 sm:flex-none items-center justify-center font-bold tracking-wide rounded-[0.85rem] sm:rounded-[1rem] transition-all duration-300 ${sizeClasses[size]} ${
              isActive ? activeStyle : inactiveStyle
            }`}
          >
            {unit.label}
          </button>
        );
      })}
    </div>
  );
}
