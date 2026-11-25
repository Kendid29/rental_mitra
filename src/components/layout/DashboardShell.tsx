'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Sidebar for Desktop & Mobile Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area: Standardized 256px offset (lg:pl-64) */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-200">
        <Topbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-5">
          {children}
        </main>
      </div>
    </div>
  );
}
