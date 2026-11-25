import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, children, id, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-[11px] font-semibold text-slate-700 mb-1 uppercase tracking-wider font-heading"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={generatedId}
            ref={ref}
            className={cn(
              'w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-[13px] text-slate-900 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0866F5] focus:border-[#0866F5] transition-all pr-9 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed shadow-xs',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
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
