import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { useWeeklyAnalytics } from '@/hooks/useProjects';

export const WeeklyChart: React.FC = () => {
  const { data: chartData } = useWeeklyAnalytics();
  const [timeframe, setTimeframe] = useState('Last 7 days');

  const days = chartData?.days || [
    { dayLabel: 'T', date: '2026-11-03', completedCount: 4 },
    { dayLabel: 'W', date: '2026-11-04', completedCount: 7 },
    { dayLabel: 'T', date: '2026-11-05', completedCount: 5 },
    { dayLabel: 'F', date: '2026-11-06', completedCount: 9 },
    { dayLabel: 'S', date: '2026-11-07', completedCount: 3 },
    { dayLabel: 'S', date: '2026-11-08', completedCount: 6 },
    { dayLabel: 'M', date: '2026-11-09', completedCount: 5 },
  ];

  const deltaText = chartData?.deltaText || '8 more than the previous week';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-subtle flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-semibold text-stone-900">
            tasks completed
          </div>
          <button className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors">
            <span>{timeframe}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-32 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="dayLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#8E9480' }}
            />
            <Tooltip
              cursor={{ fill: '#F1F3EB', radius: 4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-stone-900 text-white text-[11px] px-2 py-1 rounded-md shadow-lg">
                      {data.completedCount} tasks ({data.date})
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="completedCount"
              fill="#4E7D65"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Delta */}
      <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-2 border-t border-stone-100">
        <TrendingUp className="w-3.5 h-3.5 text-[#4E7D65]" />
        <span>{deltaText}</span>
      </div>
    </div>
  );
};

