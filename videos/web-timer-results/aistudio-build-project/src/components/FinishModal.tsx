import React, { useEffect, useState } from 'react';
import { RotateCcw, X, Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { soundSystem, AlarmSoundType } from '../utils/sound';

interface FinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  activityTitle: string;
  alarmType: AlarmSoundType;
  onChangeAlarmType: (type: AlarmSoundType) => void;
}

const CAROL_OPTIONS: { id: AlarmSoundType; title: string; desc: string; emoji: string }[] = [
  { id: 'jingle_bells', title: '징글벨 (Jingle Bells)', desc: '경쾌한 썰매 방울과 멜로디', emoji: '🎄' },
  { id: 'we_wish_you', title: 'We Wish You a Merry Christmas', desc: '따뜻하고 기쁜 축하 캐롤', emoji: '🎅' },
  { id: 'classic_chime', title: '클래식 학교 차임벨', desc: '단정한 4음 학교 종소리', emoji: '🔔' },
];

export const FinishModal: React.FC<FinishModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  activityTitle,
  alarmType,
  onChangeAlarmType,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setIsPlayingMusic(true);
    } else {
      soundSystem.stopAllSounds();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundSystem.stopAllSounds();
        onClose();
      }
      if (e.key === 'r' || e.key === 'R') {
        soundSystem.stopAllSounds();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onRestart]);

  if (!isOpen) return null;

  const currentOption = CAROL_OPTIONS.find((c) => c.id === alarmType) || CAROL_OPTIONS[0];

  const handleTogglePlayMusic = () => {
    if (isPlayingMusic) {
      soundSystem.stopAllSounds();
      setIsPlayingMusic(false);
    } else {
      soundSystem.playFinishSound();
      setIsPlayingMusic(true);
    }
  };

  const handleSelectSong = (type: AlarmSoundType) => {
    onChangeAlarmType(type);
    soundSystem.setAlarmType(type);
    soundSystem.playFinishSound();
    setIsPlayingMusic(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-red-500/80 shadow-[0_0_70px_rgba(239,68,68,0.35)] text-center text-white select-none overflow-hidden">
        {/* Festive background accents */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundSystem.stopAllSounds();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Christmas Icon with bouncing animation */}
        <div className="mx-auto mb-4 relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-500 flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.5)] animate-bounce">
          <span className="text-4xl sm:text-5xl">{currentOption.emoji}</span>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight mb-1">
          시간 종료! 메리 크리스마스!
        </h2>

        {activityTitle && (
          <p className="text-base sm:text-lg font-bold text-emerald-300 mb-2">
            [{activityTitle}]
          </p>
        )}

        <p className="text-xs sm:text-sm text-slate-300 mb-4">
          선생님과 학생 여러분 수고하셨습니다. 신나는 캐롤송이 울려퍼집니다!
        </p>

        {/* Currently Playing Carol Box */}
        <div className="mb-5 p-3.5 rounded-2xl bg-black/60 border border-white/15 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <Music className={`w-4 h-4 ${isPlayingMusic ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <div>
                <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[210px] sm:max-w-[280px]">
                  {currentOption.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isPlayingMusic ? '🎵 울려퍼지는 중...' : '일시정지됨'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTogglePlayMusic}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlayingMusic
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50 hover:bg-red-500/40'
                  : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/40'
              }`}
            >
              {isPlayingMusic ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingMusic ? '음악 멈춤' : '다시 재생'}</span>
            </button>
          </div>

          {/* Quick Carol Song Switcher */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10">
            {CAROL_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectSong(opt.id)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer truncate ${
                  alarmType === opt.id
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-white/5 hover:bg-white/15 text-slate-300'
                }`}
                title={opt.title}
              >
                {opt.emoji} {opt.id === 'jingle_bells' ? '징글벨' : opt.id === 'we_wish_you' ? 'We Wish' : '학교종'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundSystem.stopAllSounds();
              onClose();
            }}
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-white/15 transition-all cursor-pointer"
          >
            확인 및 닫기
          </button>

          <button
            type="button"
            onClick={() => {
              soundSystem.stopAllSounds();
              onRestart();
            }}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>타이머 다시 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};
