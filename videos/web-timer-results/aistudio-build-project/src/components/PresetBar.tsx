import React from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import { soundSystem } from '../utils/sound';

interface PresetBarProps {
  currentTotalSeconds: number;
  onSelectPreset: (seconds: number) => void;
  onAdjustTime: (deltaSeconds: number) => void;
  isRunning: boolean;
}

export const PRESETS = [
  { label: '1분', seconds: 60, subtext: '집중 퀴즈 / 짧은 발표' },
  { label: '5분', seconds: 300, subtext: '개별 과제 / 생각 정리' },
  { label: '10분', seconds: 600, subtext: '모둠 활동 / 토의 토론' },
  { label: '20분', seconds: 1200, subtext: '실습 / 시험 / 긴 활동' },
];

export const PresetBar: React.FC<PresetBarProps> = ({
  currentTotalSeconds,
  onSelectPreset,
  onAdjustTime,
  isRunning,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-4xl px-4 py-2 select-none">
      {/* 4 Main Preset Buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
        {PRESETS.map((preset) => {
          const isSelected = currentTotalSeconds === preset.seconds;
          return (
            <button
              key={preset.seconds}
              type="button"
              onClick={() => {
                soundSystem.playClick();
                onSelectPreset(preset.seconds);
              }}
              className={`group relative flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-2 sm:px-4 rounded-2xl font-bold transition-all duration-200 cursor-pointer text-center
                ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-[1.02] border-2 border-white'
                    : 'bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 hover:border-amber-400/50 shadow-lg'
                }`}
            >
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight whitespace-nowrap">
                  {preset.label}
                </span>
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium line-clamp-1 mt-0.5 sm:mt-1 hidden sm:block ${
                  isSelected ? 'text-slate-900/80 font-bold' : 'text-slate-400'
                }`}
              >
                {preset.subtext}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick +/- Increments Bar */}
      <div className="flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full border border-white/15 shadow-md">
        <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">시간 미세조정:</span>
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onAdjustTime(-60);
          }}
          disabled={currentTotalSeconds <= 60 && !isRunning}
          className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="1분 빼기"
        >
          <Minus className="w-3 h-3" /> 1분
        </button>
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onAdjustTime(-10);
          }}
          disabled={currentTotalSeconds <= 10 && !isRunning}
          className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="10초 빼기"
        >
          <Minus className="w-3 h-3" /> 10초
        </button>

        <div className="h-4 w-px bg-white/20 mx-1" />

        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onAdjustTime(10);
          }}
          className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
          title="10초 더하기"
        >
          <Plus className="w-3 h-3" /> 10초
        </button>
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onAdjustTime(60);
          }}
          className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
          title="1분 더하기"
        >
          <Plus className="w-3 h-3" /> 1분
        </button>
      </div>
    </div>
  );
};
