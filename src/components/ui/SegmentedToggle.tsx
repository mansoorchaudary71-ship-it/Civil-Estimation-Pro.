import React from 'react';
import { Check } from 'lucide-react';

// Exact color mappings tailored to match the background hues of your tool cards
const themeStyles = {
  brown: {
    selectedBg: 'bg-[#f4ebe1]', // Matches the warm light brown/beige card fill
    selectedText: 'text-[#5c4d3c]',
    borderColor: 'border-amber-900/20',
    divideColor: 'divide-amber-900/20'
  },
  blue: {
    selectedBg: 'bg-[#e8f0fe]', // Matches the soft light blue card fill
    selectedText: 'text-[#1a73e8]',
    borderColor: 'border-blue-900/20',
    divideColor: 'divide-blue-900/20'
  },
  green: {
    selectedBg: 'bg-[#e6f4ea]', // Matches the soft environmental green card fill
    selectedText: 'text-[#137333]',
    borderColor: 'border-emerald-900/20',
    divideColor: 'divide-emerald-900/20'
  }
};

export type ToggleTheme = 'brown' | 'blue' | 'green';

interface Option {
  value: string;
  label: string;
}

interface SegmentedToggleProps {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  colorTheme?: ToggleTheme;
}

const SegmentedToggle = ({ 
  options, 
  selectedValue, 
  onChange, 
  colorTheme = 'brown' 
}: SegmentedToggleProps) => {
  
  const currentTheme = themeStyles[colorTheme] || themeStyles.brown;

  return (
    <div className={`flex overflow-hidden rounded-full border ${currentTheme.borderColor} divide-x ${currentTheme.divideColor}`}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex flex-1 items-center justify-center gap-2 py-2 px-3 sm:px-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap
              ${isSelected 
                ? `${currentTheme.selectedBg} ${currentTheme.selectedText}` 
                : 'bg-transparent text-gray-600 hover:bg-gray-50/50'
              }
            `}
          >
            {isSelected && <Check className="h-4 w-4 stroke-[2.5]" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedToggle;
