import React from 'react';
import Link from 'next/link';
import { Layout, Coffee, BookOpen, MoreHorizontal, ArrowRight, Folder } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProgressBar } from '@/components/ui/ProgressBar';

export const ProjectGrid: React.FC = () => {
  const { data: projectsData, isLoading } = useProjects();
  const projects = projectsData?.projects || [];

  const getProjectIcon = (iconName: string, colorHex: string) => {
    const iconProps = { className: 'w-4 h-4', style: { color: colorHex } };
    switch (iconName) {
      case 'layout':
        return <Layout {...iconProps} />;
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'book-open':
        return <BookOpen {...iconProps} />;
      default:
        return <Folder {...iconProps} />;
    }
  };

  const getLightBg = (colorHex: string) => {
    if (colorHex === '#4E7D65') return 'bg-[#E8F1EC]';
    if (colorHex === '#C9705E') return 'bg-[#FBECE8]';
    if (colorHex === '#8B8A9F') return 'bg-[#EFEFF5]';
    return 'bg-stone-100';
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-white tracking-tight">
          Your projects
        </h2>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-xs text-stone-300 hover:text-white transition-colors group"
        >
          <span>View all projects</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3 Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-border-subtle animate-pulse h-40"
            />
          ))
        ) : (
          projects.map((project) => {
            const completed = project.completedTasks || 0;
            const total = project.totalTasks || 0;
            const percentage = project.progressPercentage || (total > 0 ? Math.round((completed / total) * 100) : 0);

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-9 h-9 rounded-xl ${getLightBg(
                        project.colorHex
                      )} flex items-center justify-center`}
                    >
                      {getProjectIcon(project.icon, project.colorHex)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {project.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-stone-500 mt-2 mb-2 font-medium">
                    <span>
                      {completed} of {total} tasks complete
                    </span>
                    <span className="font-semibold text-stone-700">
                      {percentage}%
                    </span>
                  </div>

                  <ProgressBar
                    value={percentage}
                    colorHex={project.colorHex}
                    heightClass="h-2"
                  />
                </div>

                {project.subtitle && (
                  <div className="pt-3 mt-3 border-t border-stone-100 text-[11px] text-stone-400 truncate">
                    {project.subtitle}
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

