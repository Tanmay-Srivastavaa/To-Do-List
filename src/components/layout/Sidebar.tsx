import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CheckCircle2,
  Home,
  Inbox,
  Calendar,
  CalendarDays,
  CheckCheck,
  Plus,
  Tag,
  UserPlus,
  HelpCircle,
  ChevronsUpDown,
  PanelLeft,
} from 'lucide-react';
import { useProjects, useLabels, useAnalyticsSummary } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { UserDropdown } from './UserDropdown';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { ShortcutsModal } from '@/components/modals/ShortcutsModal';
import { InviteModal } from '@/components/modals/InviteModal';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const pathname = usePathname();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: projectsData } = useProjects();
  const { data: labelsData } = useLabels();
  const { data: summaryData } = useAnalyticsSummary();
  const { data: inboxData } = useTasks({ view: 'inbox' });

  const projects = projectsData?.projects || [];
  const labels = labelsData?.labels || [];

  const navItems = [
    { name: 'Home', href: '/', icon: Home, count: null },
    { name: 'Inbox', href: '/inbox', icon: Inbox, count: inboxData?.total || 8 },
    { name: 'Today', href: '/today', icon: Calendar, count: summaryData?.onListToday || 6 },
    { name: 'Upcoming', href: '/upcoming', icon: CalendarDays, count: null },
    { name: 'Completed', href: '/completed', icon: CheckCheck, count: null },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-sidebar border-r border-border-sidebar flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Brand Logo & Workspace Switcher */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-lg bg-[#3D5A40] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-stone-900 font-sans lowercase">
                  folio
                </span>
              </Link>

              {onToggle && (
                <button
                  onClick={onToggle}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
                  title="Collapse sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Workspace Selector */}
            <div className="w-full flex items-center justify-between px-3 py-2 bg-stone-200/50 hover:bg-stone-200/80 rounded-xl cursor-pointer transition-colors text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#E2E8D8] text-[#3D5A40] flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <span className="text-xs font-medium text-stone-800">
                  Personal workspace
                </span>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-stone-500" />
            </div>
          </div>

          {/* Primary Navigation Views */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sidebar-active text-[#2F4732] font-semibold'
                      : 'text-stone-700 hover:bg-sidebar-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#3D5A40]' : 'text-stone-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.count !== null && item.count > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-[#3D5A40]/15 text-[#2F4732]' : 'text-stone-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* MY PROJECTS Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-stone-500 tracking-wider uppercase">
              <span>MY PROJECTS</span>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="p-1 hover:bg-stone-200/60 rounded-md text-stone-500 hover:text-stone-900 transition-colors"
                title="Create new project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {projects.map((project) => {
                const isProjectActive = pathname === `/projects/${project.id}`;

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      isProjectActive
                        ? 'bg-sidebar-active text-stone-900 font-semibold'
                        : 'text-stone-700 hover:bg-sidebar-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.colorHex }}
                      />
                      <span className="truncate">{project.title}</span>
                    </div>
                    {project.activeTasks !== undefined && project.activeTasks > 0 && (
                      <span className="text-[11px] text-stone-400 font-normal">
                        {project.activeTasks}
                      </span>
                    )}
                  </Link>
                );
              })}

              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 hover:bg-sidebar-hover rounded-xl transition-colors text-left"
              >
                <Plus className="w-3.5 h-3.5 text-stone-400" />
                <span>New project</span>
              </button>
            </div>
          </div>

          {/* LABELS Section */}
          <div className="space-y-2 pt-2">
            <div className="px-3 text-[11px] font-semibold text-stone-500 tracking-wider uppercase">
              <span>LABELS</span>
            </div>

            <div className="space-y-0.5">
              {labels.map((label) => (
                <Link
                  key={label.id}
                  href={`/?label=${encodeURIComponent(label.name)}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-stone-700 hover:bg-sidebar-hover transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-xs">#</span>
                    <span>{label.name}</span>
                  </div>
                  {label.taskCount !== undefined && label.taskCount > 0 && (
                    <span className="text-[11px] text-stone-400">{label.taskCount}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Profile Card */}
        <div className="p-3 border-t border-border-sidebar space-y-1 bg-sidebar/50">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-sidebar-hover rounded-xl transition-colors text-left"
          >
            <UserPlus className="w-4 h-4 text-stone-400" />
            <span>Invite a friend</span>
          </button>

          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-sidebar-hover rounded-xl transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-stone-400" />
            <span>Help &amp; shortcuts</span>
          </button>

          <div className="pt-2">
            <UserDropdown />
          </div>
        </div>
      </aside>

      {/* Modals */}
      <NewProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
};

