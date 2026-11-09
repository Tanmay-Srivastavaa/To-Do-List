import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderGreetingProps {
  onAddTaskClick: () => void;
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({ onAddTaskClick }) => {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState('Good morning');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('MONDAY, NOVEMBER 9');

  const userName = session?.user?.name ? session.user.name.split(' ')[0] : 'Alex';

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    setCurrentDateFormatted(format(now, 'EEEE, MMMM d').toUpperCase());
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 text-folio-canvasLight">
      <div>
        <div className="text-[11px] font-semibold tracking-widest uppercase text-stone-300/80 mb-1">
          {currentDateFormatted}
        </div>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white font-sans">
          {greeting}, {userName} <span className="opacity-90">☀</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-300/80 mt-1">
          A fresh start. Let&apos;s make room for what matters.
        </p>
      </div>

      <button
        onClick={onAddTaskClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3D5A40] hover:bg-[#314833] text-white text-xs sm:text-sm font-medium rounded-xl shadow-md transition-all self-start sm:self-auto hover:shadow-lg active:scale-98"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add task</span>
      </button>
    </div>
  );
};

