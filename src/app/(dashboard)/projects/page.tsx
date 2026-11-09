'use client';

import React, { useState } from 'react';
import { Folder, Plus } from 'lucide-react';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { NewProjectModal } from '@/components/modals/NewProjectModal';

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-white mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3D5A40] flex items-center justify-center text-white">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-normal text-white">All Projects</h1>
            <p className="text-xs text-stone-300">
              Track progress, milestones, and priority execution.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D5A40] hover:bg-[#314833] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      <ProjectGrid />

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

