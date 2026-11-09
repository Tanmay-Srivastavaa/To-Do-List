'use client';

import React, { useState } from 'react';
import { HeaderGreeting } from '@/components/dashboard/HeaderGreeting';
import { StatCards } from '@/components/dashboard/StatCard';
import { TaskBoard } from '@/components/dashboard/TaskBoard';
import { WeeklyChart } from '@/components/widgets/WeeklyChart';
import { UpcomingCard } from '@/components/widgets/UpcomingCard';
import { FocusTimerCard } from '@/components/widgets/FocusTimerCard';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { QuickAddTask } from '@/components/dashboard/QuickAddTask';

export default function DashboardHomePage() {
  const [showTaskAddModal, setShowTaskAddModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Dynamic Header Greeting & Date */}
      <HeaderGreeting onAddTaskClick={() => setShowTaskAddModal(true)} />

      {/* 3 Top Summary Metrics */}
      <StatCards />

      {/* Main 2-Column Split: Task Board + Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Task Board (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <TaskBoard />
        </div>

        {/* Right Widgets Column (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5">
          <WeeklyChart />
          <UpcomingCard />
          <FocusTimerCard />
        </div>
      </div>

      {/* Bottom Section: Your Projects (3 Cards with Progress Bars) */}
      <ProjectGrid />

      {/* Quick Add Modal when "+ Add task" button in header is clicked */}
      {showTaskAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Add New Task</h3>
              <button
                onClick={() => setShowTaskAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>
            <QuickAddTask defaultSection="PRIORITIES" />
          </div>
        </div>
      )}
    </div>
  );
}

