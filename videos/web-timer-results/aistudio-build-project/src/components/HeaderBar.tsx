import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Image as ImageIcon, Sliders, Edit3, Sun } from 'lucide-react';
import { soundSystem } from '../utils/sound';

interface HeaderBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
  activityTitle: string;
  onOpenActivityTitleModal: () => void;
  currentBgName: string;
  onNextBg: () => void;
  dimLevel: number;
  onCycleDimLevel: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenSettings,
  activityTitle,
  onOpenActivityTitleModal,
  currentBgName,
  onNextBg,
  dimLevel,
  onCycleDimLevel,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3 z-20 select-none">
      {/* Brand Title Zone */}
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-md">
          교실 대형 수업 타이머
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-400/30">
          <span>🎄</span>
          <span>캐롤송 알림 지원</span>
        </span>
      </div>

      {/* Middle Quick Actions */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onOpenActivityTitleModal();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/10 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer"
          title="활동 이름 변경"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>{activityTitle || '활동 이름 설정'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onNextBg();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/10 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer"
          title="배경 사진 전환"
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[120px]">{currentBgName}</span>
        </button>

        {/* Quick Brightness / Clarity Button */}
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onCycleDimLevel();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/10 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer"
          title="배경 선명도·밝기 즉시 전환 (클릭 시 맑게/선명하게/어둡게 순환)"
        >
          <Sun className="w-3.5 h-3.5 text-yellow-400" />
          <span>{dimLevel === 0 ? '✨ 가장 맑음' : dimLevel <= 20 ? '☀️ 선명함' : '🌙 집중'}</span>
        </button>
      </div>

      {/* Right Utility Buttons */}
      <div className="flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleMute();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/10 text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
          title={isMuted ? '알림음 켜기' : '알림음 끄기'}
          aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="hidden sm:inline">{isMuted ? '음소거' : '소리 켬'}</span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onOpenSettings();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/10 text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
          title="타이머 및 배경 설정"
          aria-label="설정 열기"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">설정</span>
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onToggleFullscreen();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-400/90 hover:bg-amber-300 text-slate-950 font-bold text-xs backdrop-blur-md shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          title="전체화면 (단축키: F)"
          aria-label={isFullscreen ? '전체화면 해제' : '전체화면 전환'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isFullscreen ? '화면 복귀' : '전체화면'}</span>
        </button>
      </div>
    </header>
  );
};
