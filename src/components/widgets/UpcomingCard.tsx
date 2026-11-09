import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const UpcomingCard: React.FC = () => {
  const events = [
    {
      badge: 'TUE 10',
      title: 'Design review & mobile navigation prototype',
      project: 'Website refresh',
      colorHex: '#4E7D65',
      time: '10:00 AM',
    },
    {
      badge: 'THU 12',
      title: 'Coffee tasting & grocery run',
      project: 'Personal',
      colorHex: '#C9705E',
      time: 'All day',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-stone-900">Upcoming Schedule</h3>
        <Link
          href="/upcoming"
          className="text-stone-400 hover:text-stone-700 transition-colors p-1"
          title="View upcoming calendar"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events.map((evt, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* Square Date Badge */}
            <div className="w-12 h-11 bg-stone-100 rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0">
              <span className="text-[9px] font-bold tracking-wider text-stone-500 uppercase leading-tight">
                {evt.badge.split(' ')[0]}
              </span>
              <span className="text-xs font-bold text-stone-800 leading-tight">
                {evt.badge.split(' ')[1]}
              </span>
            </div>

            {/* Event Info */}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-stone-800 truncate">
                {evt.title}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-400">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: evt.colorHex }}
                />
                <span>{evt.project}</span>
                <span>·</span>
                <span>{evt.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

