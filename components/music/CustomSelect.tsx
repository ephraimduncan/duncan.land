import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export default function CustomSelect({ value, onChange, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <div
        className="bg-transparent rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer flex items-center justify-between min-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{options.find(option => option.value === value)?.label}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 rounded shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-2 py-1 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}