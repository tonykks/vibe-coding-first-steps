import React from 'react';

interface TimerDisplayProps {
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  isRunning: boolean;
  activityTitle: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  activityTitle,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Condition for last 10 seconds: numbers turn RED
  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isFinished = timeLeft === 0;

  // Percentage for progress indicator
  const progressPercent = totalTime > 0 ? Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100)) : 0;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-6xl px-4 py-2 select-none">
      {/* Activity Title Banner */}
      {activityTitle && (
        <div className="mb-2 sm:mb-4 px-6 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-lg">
          <p className="text-sm sm:text-base md:text-xl font-bold tracking-wide text-amber-200">
            {activityTitle}
          </p>
        </div>
      )}

      {/* Main High-Contrast Backdrop Card for Maximum Visibility from the Back of Classroom */}
      <div
        className={`relative flex flex-col items-center justify-center w-full rounded-3xl p-4 sm:p-8 md:p-12 transition-all duration-300
          bg-black/55 backdrop-blur-xl border shadow-2xl ${
            isUrgent
              ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-urgent'
              : 'border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
          }`}
      >
        {/* Urgent warning tag when <= 10s */}
        {isUrgent && (
          <div className="absolute -top-4 sm:-top-5 px-4 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg animate-bounce">
            마지막 10초!
          </div>
        )}

        {/* The Massive Digits Display */}
        <div className="flex items-center justify-center leading-none">
          {/* Minutes */}
          <span
            className={`classroom-digits font-black tracking-tight transition-colors duration-200 text-[21vw] sm:text-[19vw] md:text-[17vw] lg:text-[15vw] select-none ${
              isUrgent ? 'glow-red' : 'glow-yellow'
            }`}
          >
            {formattedMinutes}
          </span>

          {/* Blinking Colon */}
          <span
            className={`classroom-digits font-black px-1 sm:px-2 md:px-3 text-[19vw] sm:text-[17vw] md:text-[15vw] lg:text-[13vw] select-none transition-opacity duration-300 ${
              isUrgent
                ? 'glow-red'
                : 'glow-yellow'
            } ${isRunning ? 'animate-pulse' : 'opacity-90'}`}
          >
            :
          </span>

          {/* Seconds */}
          <span
            className={`classroom-digits font-black tracking-tight transition-colors duration-200 text-[21vw] sm:text-[19vw] md:text-[17vw] lg:text-[15vw] select-none ${
              isUrgent ? 'glow-red' : 'glow-yellow'
            }`}
          >
            {formattedSeconds}
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full max-w-3xl mt-4 sm:mt-6">
          <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1 text-slate-300">
            <span>진행률: {Math.round(progressPercent)}%</span>
            <span>
              {isFinished ? '시간 종료' : `${Math.floor(timeLeft / 60)}분 ${timeLeft % 60}초 남음`}
            </span>
          </div>
          <div className="w-full h-3 sm:h-4 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isUrgent
                  ? 'bg-gradient-to-r from-red-600 to-rose-400'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
