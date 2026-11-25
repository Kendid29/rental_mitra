import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'ghost'
    | 'success'
    | 'soft'
    | 'soft-blue'
    | 'soft-emerald'
    | 'soft-danger'
    | 'soft-warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none focus:outline-none focus:ring-2 focus:ring-offset-1 shrink-0 active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#0866F5] text-white hover:bg-[#0756D1] active:bg-[#0647ad] shadow-xs focus:ring-[#0866F5]',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-300 border border-slate-200/60',
      outline:
        'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-300 shadow-xs',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs focus:ring-rose-500',
      ghost:
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus:ring-slate-300',
      success:
        'bg-[#00C48C] text-white hover:bg-[#00b07d] active:bg-[#009b6e] shadow-xs focus:ring-[#00C48C]',
      soft:
        'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-300',
      'soft-blue':
        'bg-blue-50 text-[#0866F5] hover:bg-blue-100 border border-blue-200/60 focus:ring-[#0866F5]',
      'soft-emerald':
        'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 focus:ring-emerald-500',
      'soft-danger':
        'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 focus:ring-rose-500',
      'soft-warning':
        'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60 focus:ring-amber-500',
    };

    const sizes = {
      xs: 'h-7 px-2 text-[11px] gap-1',
      sm: 'h-8 px-2.5 text-xs gap-1.5',
      md: 'h-9 px-3.5 text-xs gap-2',
      lg: 'h-10 px-4 text-sm gap-2',
      icon: 'h-9 w-9 p-0',
      'icon-sm': 'h-7 w-7 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
