'use client';

import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options: rawOptions,
      children,
      id,
      value,
      defaultValue,
      onChange,
      onValueChange,
      placeholder = 'Pilih salah satu...',
      disabled = false,
      required = false,
      name,
      ...props
    },
    ref
  ) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Extract options from either props.options OR React.Children (<option> tags)
    const options: SelectOption[] = useMemo(() => {
      if (rawOptions && rawOptions.length > 0) {
        return rawOptions;
      }

      if (children) {
        const extracted: SelectOption[] = [];
        React.Children.forEach(children, (child) => {
          if (React.isValidElement(child) && child.props) {
            const childProps = child.props as any;
            extracted.push({
              value: String(childProps.value ?? ''),
              label: String(childProps.children ?? childProps.value ?? ''),
              disabled: Boolean(childProps.disabled),
            });
          }
        });
        return extracted;
      }

      return [];
    }, [rawOptions, children]);

    // Current internal value
    const currentValue = String(value !== undefined ? value : defaultValue ?? '');
    const selectedOption = options.find((opt) => opt.value === currentValue);

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

    const handleSelectOption = (opt: SelectOption) => {
      if (opt.disabled || disabled) return;

      // Dispatch synthetic event for backward compatibility with (e) => setVal(e.target.value)
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: opt.value,
            name: name || generatedId || '',
          },
          currentTarget: {
            value: opt.value,
            name: name || generatedId || '',
          },
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }

      if (onValueChange) {
        onValueChange(opt.value);
      }

      setIsOpen(false);
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
          {/* Custom Dropdown Trigger */}
          <button
            id={generatedId}
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
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
            <span
              className={cn(
                'truncate flex items-center gap-2',
                !selectedOption || selectedOption.value === ''
                  ? 'text-slate-400'
                  : 'text-slate-800 font-medium'
              )}
            >
              {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              {selectedOption?.label || placeholder}
            </span>

            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-2',
                isOpen && 'rotate-180 text-[#0866F5]'
              )}
            />
          </button>

          {/* Hidden Native Select to keep form refs & accessibility working */}
          <select
            ref={ref}
            name={name}
            value={currentValue}
            onChange={onChange}
            disabled={disabled}
            required={required}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Popover Dropdown Menu */}
          {isOpen && (
            <div
              role="listbox"
              className="absolute z-50 mt-1 w-full bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 py-1 max-h-60 overflow-y-auto overscroll-contain animate-in fade-in-0 zoom-in-95 duration-100"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400 text-center">
                  Tidak ada pilihan tersedia
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === currentValue;
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectOption(opt)}
                      className={cn(
                        'w-full px-3 py-2 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between gap-2 select-none mx-auto',
                        isSelected
                          ? 'bg-blue-50 text-[#0866F5] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                        opt.disabled && 'text-slate-300 cursor-not-allowed hover:bg-transparent hover:text-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#0866F5] shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
