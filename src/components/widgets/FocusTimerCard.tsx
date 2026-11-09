import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Check, Sparkles } from 'lucide-react';
import { useLogFocusSession } from '@/hooks/useProjects';

export const FocusTimerCard: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isCompleted, setIsCompleted] = useState(false);

  const logFocusMutation = useLogFocusSession();

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      logFocusMutation.mutate({ durationMinutes: 25, isCompleted: true });
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, logFocusMutation]);

  const handleStart = () => {
    setIsModalOpen(true);
    setIsActive(true);
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
    setIsCompleted(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
      {/* Forest Green Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-md text-white p-6 bg-gradient-to-br from-[#2D3F33] via-[#354B3C] to-[#25352A] border border-white/10 flex flex-col justify-between min-h-[170px]">
        {/* Subtle decorative nature glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-stone-300/90 mb-1">
            A LITTLE LESS DISTRACTION
          </div>
          <h3 className="text-xl font-medium tracking-tight text-white font-sans">
            One thing at a time.
          </h3>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-4">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold rounded-full shadow-md transition-all hover:scale-102 active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start focus</span>
          </button>

          <span className="text-xs text-stone-300 font-normal">
            25 min session
          </span>
        </div>
      </div>

      {/* Focus Timer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#2D3F33] text-white rounded-3xl p-8 shadow-2xl border border-white/10 text-center relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-semibold tracking-widest uppercase text-stone-300/80 mb-2">
              Deep Work Focus
            </div>

            {isCompleted ? (
              <div className="py-8 space-y-3 animate-in zoom-in-95">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto text-amber-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold">Session Complete!</h3>
                <p className="text-xs text-stone-300">
                  25 minutes of deep focus logged to your momentum.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-6 py-2.5 bg-white text-stone-900 text-xs font-semibold rounded-full hover:bg-stone-100 transition-colors"
                >
                  Start Another
                </button>
              </div>
            ) : (
              <>
                <div className="my-8">
                  <div className="text-6xl font-light font-mono tracking-tight">
                    {timeString}
                  </div>
                  <div className="text-xs text-stone-300 mt-2">
                    {isActive ? 'In Deep Focus...' : 'Timer Paused'}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleToggleTimer}
                    className="p-4 bg-white text-stone-900 rounded-full hover:bg-stone-100 shadow-lg transition-transform active:scale-95"
                    title={isActive ? 'Pause' : 'Resume'}
                  >
                    {isActive ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current" />
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

