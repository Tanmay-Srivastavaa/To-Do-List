import React from 'react';
import { Sliders, Check, Clock } from 'lucide-react';
import { useAnalyticsSummary } from '@/hooks/useProjects';

export const StatCards: React.FC = () => {
  const { data: summary, isLoading } = useAnalyticsSummary();

  const onListToday = summary?.onListToday ?? 6;
  const completedToday = summary?.completedToday ?? 3;
  const totalToday = summary?.totalToday ?? 9;
  const focusMotivation = summary?.focusMotivationText ?? 'a little better, every day';

  const cards = [
    {
      title: 'On your list today',
      value: `${onListToday} tasks to go`,
      icon: Sliders,
      bgColor: 'bg-[#F1F4EB]',
      iconColor: 'text-[#3D5A40]',
    },
    {
      title: 'Already completed',
      value: `${completedToday} of ${totalToday} tasks today`,
      icon: Check,
      bgColor: 'bg-[#F1F4EB]',
      iconColor: 'text-[#3D5A40]',
    },
    {
      title: 'Time in focus',
      value: focusMotivation,
      icon: Clock,
      bgColor: 'bg-[#F1F4EB]',
      iconColor: 'text-[#3D5A40]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm border border-border-subtle hover:shadow-md transition-shadow"
          >
            <div
              className={`w-11 h-11 rounded-full ${card.bgColor} ${card.iconColor} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider truncate">
                {card.title}
              </div>
              <div className="text-sm sm:text-base font-semibold text-stone-900 truncate mt-0.5">
                {isLoading ? '...' : card.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

