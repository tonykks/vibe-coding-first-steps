import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { soundSystem } from '../utils/sound';

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 py-2 select-none">
      {/* Reset Button (처음으로 돌리기) */}
      <button
        type="button"
        onClick={() => {
          soundSystem.playClick();
          onReset();
        }}
        className="flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-extrabold text-base sm:text-lg text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 active:scale-95 border border-white/20 shadow-xl backdrop-blur-md transition-all cursor-pointer"
        title="처음으로 돌리기 (단축키: R)"
      >
        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>처음으로</span>
        <span className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded bg-black/40 text-slate-400 font-mono">
          R
        </span>
      </button>

      {/* Start / Pause Button (시작 / 일시정지) */}
      {isRunning ? (
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onPause();
          }}
          className="flex items-center justify-center gap-2.5 px-8 sm:px-12 py-4 sm:py-4.5 rounded-2xl font-black text-lg sm:text-xl text-amber-950 bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 active:scale-95 border-2 border-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
          title="일시정지 (단축키: 스페이스바)"
        >
          <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-950" />
          <span>일시정지</span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-amber-950/20 text-amber-950 font-mono">
            Space
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onStart();
          }}
          className="flex items-center justify-center gap-2.5 px-8 sm:px-12 py-4 sm:py-4.5 rounded-2xl font-black text-lg sm:text-xl text-slate-950 bg-gradient-to-b from-emerald-300 to-emerald-500 hover:from-emerald-200 hover:to-emerald-400 active:scale-95 border-2 border-emerald-200 shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
          title="시작하기 (단축키: 스페이스바)"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 ml-0.5" />
          <span>시작</span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-slate-950/20 text-slate-950 font-mono">
            Space
          </span>
        </button>
      )}
    </div>
  );
};
