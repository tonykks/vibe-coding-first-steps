import React from 'react';
import { X, Volume2, Image as ImageIcon, Eye, Sparkles, Music } from 'lucide-react';
import { soundSystem, AlarmSoundType } from '../utils/sound';

export interface BackgroundOption {
  id: string;
  name: string;
  url: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backgrounds: BackgroundOption[];
  currentBgId: string;
  onSelectBg: (id: string) => void;
  dimLevel: number;
  onChangeDimLevel: (level: number) => void;
  blurLevel: number;
  onChangeBlurLevel: (blur: number) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  enableTickSound: boolean;
  onToggleTickSound: () => void;
  activityTitle: string;
  onChangeActivityTitle: (title: string) => void;
  alarmType: AlarmSoundType;
  onChangeAlarmType: (type: AlarmSoundType) => void;
}

const COMMON_ACTIVITIES = [
  '모둠 토의·토론',
  '수학 문제 풀이',
  '독서 및 생각 정리',
  '단어 시험 / 퀴즈',
  '자유 발표 시간',
  '쉬는 시간',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  backgrounds,
  currentBgId,
  onSelectBg,
  dimLevel,
  onChangeDimLevel,
  blurLevel,
  onChangeBlurLevel,
  volume,
  onChangeVolume,
  enableTickSound,
  onToggleTickSound,
  activityTitle,
  onChangeActivityTitle,
  alarmType,
  onChangeAlarmType,
}) => {
  if (!isOpen) return null;

  const CAROLS: { id: AlarmSoundType; name: string; desc: string; emoji: string }[] = [
    { id: 'jingle_bells', name: '징글벨 (Jingle Bells)', desc: '경쾌한 썰매 방울 & 멜로디', emoji: '🎄' },
    { id: 'we_wish_you', name: 'We Wish You a Merry Christmas', desc: '따스한 축하 캐롤송', emoji: '🎅' },
    { id: 'classic_chime', name: '클래식 학교 차임벨', desc: '단정한 4음 학교 종소리', emoji: '🔔' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-slate-900 border border-white/20 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold tracking-tight">타이머 및 화면 설정</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundSystem.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Activity Title Setting */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              수업 활동 안내 문구
            </label>
            <input
              type="text"
              value={activityTitle}
              onChange={(e) => onChangeActivityTitle(e.target.value)}
              placeholder="예: 3모둠 협동 탐구 활동 (비워두면 숨김)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
              maxLength={40}
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {COMMON_ACTIVITIES.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => onChangeActivityTitle(act)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                >
                  + {act}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Background Selection */}
          <div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200 mb-2.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>가을 계절 배경 선택</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {backgrounds.map((bg) => {
                const isSelected = bg.id === currentBgId;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => {
                      soundSystem.playClick();
                      onSelectBg(bg.id);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 text-left cursor-pointer group ${
                      isSelected
                        ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <div className="w-full h-20 rounded-lg overflow-hidden bg-slate-800 relative">
                      {bg.url.startsWith('linear') ? (
                        <div className="w-full h-full" style={{ background: bg.url }} />
                      ) : (
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          선택됨
                        </div>
                      )}
                    </div>
                    <span className="block mt-1 text-xs font-semibold text-slate-300 truncate">
                      {bg.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Background Clarity, Brightness & Blur Controls */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-400/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold text-amber-300">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>배경 선명도 & 밝기 조절 (흐림 해결)</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300">
                어둡기 {dimLevel}% · 흐림 {blurLevel}px
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <p className="text-xs text-slate-400 mb-1.5">선명도 추천 프리셋:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChangeDimLevel(0);
                    onChangeBlurLevel(0);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    dimLevel === 0 && blurLevel === 0
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-700/70 text-slate-200 border-white/10 hover:border-white/30'
                  }`}
                >
                  ✨ 완전 맑고 선명하게
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeDimLevel(15);
                    onChangeBlurLevel(0);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    dimLevel === 15 && blurLevel === 0
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-700/70 text-slate-200 border-white/10 hover:border-white/30'
                  }`}
                >
                  🍁 추천 (선명+은은)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeDimLevel(45);
                    onChangeBlurLevel(0);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    dimLevel === 45 && blurLevel === 0
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-700/70 text-slate-200 border-white/10 hover:border-white/30'
                  }`}
                >
                  🏫 교실 집중 모드
                </button>
              </div>
            </div>

            {/* 1. Brightness / Dimming Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>배경 어둡기 (0%: 가장 밝고 맑음 ~ 80%: 어둡게)</span>
                <span className="text-amber-300 font-mono">{dimLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={dimLevel}
                onChange={(e) => onChangeDimLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* 2. Blur Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>배경 흐림 효과 (0px: 완전 선명한 원본 사진)</span>
                <span className="text-amber-300 font-mono">{blurLevel}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={blurLevel}
                onChange={(e) => onChangeBlurLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <p className="text-[11px] text-amber-200/90 leading-relaxed bg-amber-500/10 p-2 rounded-lg border border-amber-400/20">
              💡 <strong>배경이 흐리게 보일 때:</strong> &apos;완전 맑고 선명하게&apos; 버튼을 누르거나, 위 슬라이더에서 <strong>어둡기를 0~15%</strong>로 낮추고 <strong>흐림 효과를 0px</strong>로 두시면 원본 고화질 사진이 선명하게 나타납니다!
            </p>
          </div>

          {/* 4. Sound & Carol Song Selection */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200 mb-2">
                <Music className="w-4 h-4 text-amber-400" />
                <span>종료 알림음 선택 (크리스마스 캐롤송)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CAROLS.map((carol) => {
                  const isSelected = alarmType === carol.id;
                  return (
                    <button
                      key={carol.id}
                      type="button"
                      onClick={() => {
                        onChangeAlarmType(carol.id);
                        soundSystem.setAlarmType(carol.id);
                        soundSystem.playFinishSound();
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-400/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                          : 'bg-slate-800/80 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                          <span>{carol.emoji}</span>
                          <span className="truncate">{carol.name.split(' ')[0]}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{carol.desc}</p>
                      </div>
                      {isSelected && (
                        <span className="mt-2 text-[10px] font-black text-amber-300">선택 및 미리듣기 중</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-200 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>알림음 음량</span>
                </div>
                <span className="text-amber-300 font-mono text-xs">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onChangeVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    soundSystem.playFinishSound();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shrink-0 transition-colors cursor-pointer"
                >
                  캐롤 미리듣기
                </button>
              </div>
            </div>

            {/* Tick Sound Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold text-slate-200">마지막 10초 째깍 소리</p>
                <p className="text-[10px] text-slate-400">10초 전부터 초마다 카운트다운 비프음 재생</p>
              </div>
              <button
                type="button"
                onClick={onToggleTickSound}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  enableTickSound ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                    enableTickSound ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundSystem.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
