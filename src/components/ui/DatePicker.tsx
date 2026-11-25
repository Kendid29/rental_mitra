'use client';

import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { dropdownVariants } from '@/lib/motion/variants';

export interface DatePickerProps {
  value?: string; // 'YYYY-MM-DD'
  defaultValue?: string;
  onChange?: (e: any) => void;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  min?: string; // 'YYYY-MM-DD'
  max?: string; // 'YYYY-MM-DD'
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

const BULAN_INDO = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const BULAN_INDO_PENDEK = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const HARI_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function formatDateString(year: number, month: number, day: number): string {
  return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;
  return `${day} ${BULAN_INDO_PENDEK[month] || ''} ${year}`;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value: propValue,
      defaultValue,
      onChange,
      onValueChange,
      label,
      placeholder = 'Pilih tanggal...',
      min,
      max,
      error,
      helperText,
      required = false,
      disabled = false,
      className,
      name,
      id,
    },
    ref
  ) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const currentValue = propValue !== undefined ? propValue : defaultValue ?? '';

    // Initialize calendar view year and month
    const initialDate = useMemo(() => {
      if (currentValue) {
        const parts = currentValue.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m, d);
          }
        }
      }
      return new Date();
    }, [currentValue]);

    const [viewYear, setViewYear] = useState(initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

    // Update view month/year when currentValue changes
    useEffect(() => {
      if (currentValue) {
        const parts = currentValue.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          if (!isNaN(y) && !isNaN(m)) {
            setViewYear(y);
            setViewMonth(m);
          }
        }
      }
    }, [currentValue]);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
      }
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    // Days in current view month calculation
    const calendarDays = useMemo(() => {
      const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
      const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

      // Empty lead slots before month starts
      for (let i = 0; i < firstDayIndex; i++) {
        days.push({ day: 0, dateStr: '', isCurrentMonth: false });
      }

      // Actual days of the month
      for (let d = 1; d <= daysInCurrentMonth; d++) {
        days.push({
          day: d,
          dateStr: formatDateString(viewYear, viewMonth, d),
          isCurrentMonth: true,
        });
      }

      return days;
    }, [viewYear, viewMonth]);

    const handlePrevMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((prev) => prev - 1);
      } else {
        setViewMonth((prev) => prev - 1);
      }
    };

    const handleNextMonth = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((prev) => prev + 1);
      } else {
        setViewMonth((prev) => prev + 1);
      }
    };

    const handleSelectDay = (dateStr: string) => {
      if (disabled) return;

      if (onChange) {
        const syntheticEvent = {
          target: { value: dateStr, name: name || generatedId || '' },
          currentTarget: { value: dateStr, name: name || generatedId || '' },
        };
        onChange(syntheticEvent);
      }

      if (onValueChange) {
        onValueChange(dateStr);
      }

      setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;

      if (onChange) {
        const syntheticEvent = {
          target: { value: '', name: name || generatedId || '' },
          currentTarget: { value: '', name: name || generatedId || '' },
        };
        onChange(syntheticEvent);
      }

      if (onValueChange) {
        onValueChange('');
      }

      setIsOpen(false);
    };

    const todayStr = useMemo(() => {
      const now = new Date();
      return formatDateString(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    const tomorrowStr = useMemo(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDateString(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate()
      );
    }, []);

    const isDateDisabled = (dateStr: string) => {
      if (!dateStr) return true;
      if (min && dateStr < min) return true;
      if (max && dateStr > max) return true;
      return false;
    };

    return (
      <div
        className={cn('w-full relative', isOpen ? 'z-30' : 'z-auto')}
        ref={containerRef}
      >
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider font-heading select-none"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Custom Trigger Button */}
          <button
            id={generatedId}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            className={cn(
              'w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-900',
              'flex items-center justify-between text-left transition-all duration-150 shadow-xs cursor-pointer select-none',
              'hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0866F5] focus:border-[#0866F5]',
              isOpen && 'border-[#0866F5] ring-1 ring-[#0866F5]',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 ring-rose-500/20',
              disabled && 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed hover:border-slate-200',
              className
            )}
          >
            <div className="flex items-center gap-2 truncate flex-1 min-w-0">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span
                className={cn(
                  'truncate',
                  !currentValue ? 'text-slate-400' : 'text-slate-800 font-medium'
                )}
              >
                {currentValue ? formatTanggalIndo(currentValue) : placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {currentValue && !required && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  title="Hapus tanggal"
                  className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180 text-[#0866F5]'
                )}
              />
            </div>
          </button>

          {/* Hidden input for form integration */}
          <input
            ref={ref}
            type="hidden"
            name={name}
            value={currentValue}
            required={required}
            disabled={disabled}
          />

          {/* Calendar Dropdown Popover */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                data-lenis-prevent
                className="absolute z-50 mt-1 w-72 bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 p-3 select-none left-0 origin-top"
              >
                {/* Header: Month / Year pagination */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-[#102447] font-heading">
                    {BULAN_INDO[viewMonth]} {viewYear}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Bulan selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day of Week headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {HARI_SINGKAT.map((h, i) => (
                    <div
                      key={h}
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider py-1',
                        i === 0 ? 'text-rose-400' : 'text-slate-400'
                      )}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Day cells grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarDays.map((d, idx) => {
                    if (!d.isCurrentMonth) {
                      return <div key={`empty-${idx}`} className="h-7 w-7" />;
                    }

                    const isSelected = d.dateStr === currentValue;
                    const isToday = d.dateStr === todayStr;
                    const isDisabled = isDateDisabled(d.dateStr);

                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelectDay(d.dateStr)}
                        className={cn(
                          'h-7 w-7 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-colors cursor-pointer',
                          isSelected &&
                            'bg-[#0866F5] text-white font-bold shadow-xs hover:bg-[#0756d1]',
                          !isSelected &&
                            isToday &&
                            'ring-1 ring-[#0866F5]/40 text-[#0866F5] font-bold hover:bg-blue-50',
                          !isSelected &&
                            !isToday &&
                            !isDisabled &&
                            'text-slate-700 hover:bg-blue-50 hover:text-[#0866F5]',
                          isDisabled &&
                            'text-slate-300 cursor-not-allowed hover:bg-transparent hover:text-slate-300'
                        )}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>

                {/* Quick action shortcuts footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isDateDisabled(todayStr)}
                      onClick={() => handleSelectDay(todayStr)}
                      className="px-2 py-0.5 rounded-md text-[#0866F5] hover:bg-blue-50 font-medium transition-colors cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed"
                    >
                      Hari Ini
                    </button>
                    <button
                      type="button"
                      disabled={isDateDisabled(tomorrowStr)}
                      onClick={() => handleSelectDay(tomorrowStr)}
                      className="px-2 py-0.5 rounded-md text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed"
                    >
                      Besok
                    </button>
                  </div>

                  {currentValue && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-2 py-0.5 rounded-md text-rose-500 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">{helperText}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
