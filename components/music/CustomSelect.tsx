import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
            <motion.div
                className="rounded-md px-3 py-2 text-sm text-black dark:text-white cursor-pointer flex items-center justify-between min-w-[150px]"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
            >
                <span>{options.find(option => option.value === value)?.label}</span>
                <motion.div
                    animate={{ scale: isOpen ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-full bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
                    >
                        {options.map((option) => (
                            <motion.div
                                key={option.value}
                                className={`px-3 py-2 cursor-pointer text-white text-sm ${value === option.value ? 'bg-gray-700 dark:bg-gray-600' : 'hover:bg-gray-700 dark:hover:bg-gray-600'}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {option.label}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
