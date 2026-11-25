'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  side = 'right',
  children,
  footer,
  className,
}: SheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          'fixed inset-y-0 z-50 flex max-w-full bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          side === 'right' ? 'right-0 w-full sm:max-w-md' : 'left-0 w-full sm:max-w-md',
          side === 'right' ? 'animate-in slide-in-from-right' : 'animate-in slide-in-from-left',
          className
        )}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          {(title || description) && (
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                {title && (
                  <h3 className="text-base font-bold text-[#102447] font-heading">{title}</h3>
                )}
                {description && (
                  <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Tutup Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
