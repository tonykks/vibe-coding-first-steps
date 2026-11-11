import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TimerDisplay } from './components/TimerDisplay';
import { PresetBar } from './components/PresetBar';
import { Controls } from './components/Controls';
import { HeaderBar } from './components/HeaderBar';
import { FinishModal } from './components/FinishModal';
import { SettingsModal, BackgroundOption } from './components/SettingsModal';
import { soundSystem, AlarmSoundType } from './utils/sound';

// Background images
import autumnScenic1 from './assets/images/autumn_golden_landscape_1794195074557.jpg';
import autumnScenic2 from './assets/images/autumn_cozy_nature_1794195073853.jpg';
import winterFestive from './assets/images/winter_festive_forest_1794195672837.jpg';

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'autumn-golden',
    name: '황금빛 가을 호수',
    url: autumnScenic1,
  },
  {
    id: 'autumn-forest',
    name: '따스한 가을 숲길',
    url: autumnScenic2,
  },
  {
    id: 'winter-christmas',
    name: '🎄 크리스마스 눈꽃 마을',
    url: winterFestive,
  },
  {
    id: 'chalkboard-dark',
    name: '차분한 칠판 모드',
    url: 'linear-gradient(135deg, #091a14 0%, #032115 50%, #04140e 100%)',
  },
];

export default function App() {
  // Default to 10 minutes (600 seconds) as requested
  const [totalSeconds, setTotalSeconds] = useState<number>(600);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState<boolean>(false);

  // Sound selection: defaults to Christmas carol 'jingle_bells'
  const [alarmType, setAlarmType] = useState<AlarmSoundType>('jingle_bells');

  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentBgId, setCurrentBgId] = useState<string>('autumn-golden');
  const [dimLevel, setDimLevel] = useState<number>(15); // 15% light natural scrim so the background is clear & vivid
  const [blurLevel, setBlurLevel] = useState<number>(0); // 0px default (completely sharp and clear)
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [enableTickSound, setEnableTickSound] = useState<boolean>(true);
  const [activityTitle, setActivityTitle] = useState<string>('수업 집중 시간');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Ref to track last second tick to avoid duplicate beeps
  const lastTickSecondRef = useRef<number | null>(null);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Sound system volume and mute sync
  useEffect(() => {
    soundSystem.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    soundSystem.setMuted(isMuted);
  }, [isMuted]);

  // Main countdown timer interval
  useEffect(() => {
    let intervalId: number | null = null;

    if (isRunning && timeLeft > 0) {
      intervalId = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Reached 0! Trigger finish
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft]);

  // React to timeLeft reaching 0 or last 10 seconds
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinishModalOpen(true);
      soundSystem.playFinishSound();
    } else if (isRunning && timeLeft <= 10 && timeLeft > 0) {
      // Last 10 seconds countdown tick sound
      if (enableTickSound && lastTickSecondRef.current !== timeLeft) {
        lastTickSecondRef.current = timeLeft;
        soundSystem.playCountdownTick(timeLeft);
      }
    }
  }, [timeLeft, isRunning, enableTickSound]);

  // Handlers for controls
  const handleStart = useCallback(() => {
    soundSystem.stopAllSounds();
    if (timeLeft === 0) {
      // If time was 0, reset to total and start
      setTimeLeft(totalSeconds);
    }
    setIsRunning(true);
  }, [timeLeft, totalSeconds]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    soundSystem.stopAllSounds();
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    lastTickSecondRef.current = null;
  }, [totalSeconds]);

  const handleSelectPreset = (seconds: number) => {
    setIsRunning(false);
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    lastTickSecondRef.current = null;
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    if (isRunning) {
      setTimeLeft((prev) => Math.max(1, prev + deltaSeconds));
    } else {
      const nextTime = Math.max(10, totalSeconds + deltaSeconds);
      setTotalSeconds(nextTime);
      setTimeLeft(nextTime);
    }
    lastTickSecondRef.current = null;
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleNextBg = () => {
    const currentIndex = BACKGROUND_OPTIONS.findIndex((b) => b.id === currentBgId);
    const nextIndex = (currentIndex + 1) % BACKGROUND_OPTIONS.length;
    setCurrentBgId(BACKGROUND_OPTIONS[nextIndex].id);
  };

  // Quick cycle between Brightness levels: 0% (완전 선명 맑음) -> 15% (기본 선명) -> 45% (어둡게 집중)
  const handleCycleDimLevel = () => {
    if (dimLevel === 0) {
      setDimLevel(15);
      setBlurLevel(0);
    } else if (dimLevel <= 20) {
      setDimLevel(45);
      setBlurLevel(0);
    } else {
      setDimLevel(0);
      setBlurLevel(0);
    }
  };

  // Keyboard shortcuts (Space = Play/Pause, R = Reset, F = Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, handleStart, handlePause, handleReset]);

  const activeBg = BACKGROUND_OPTIONS.find((b) => b.id === currentBgId) || BACKGROUND_OPTIONS[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between bg-black text-white select-none">
      {/* 1. Background Image Layer */}
      {activeBg.url.startsWith('linear') ? (
        <div
          className="absolute inset-0 z-0 transition-all duration-700"
          style={{ background: activeBg.url }}
        />
      ) : (
        <img
          src={activeBg.url}
          alt={activeBg.name}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 pointer-events-none scale-105"
        />
      )}

      {/* 2. Scrim Overlay: Now 100% crisp without forced blur! */}
      <div
        className="absolute inset-0 z-1 pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${dimLevel / 100})`,
          backdropFilter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none',
        }}
      />

      {/* 3. Subtle Vignette Gradient for edge framing */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-radial from-transparent via-transparent to-black/50" />

      {/* 4. Top Header Bar */}
      <HeaderBar
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activityTitle={activityTitle}
        onOpenActivityTitleModal={() => setIsSettingsOpen(true)}
        currentBgName={activeBg.name}
        onNextBg={handleNextBg}
        dimLevel={dimLevel}
        onCycleDimLevel={handleCycleDimLevel}
      />

      {/* 5. Center Stage: The Ultra-Large High-Visibility Digits */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-6">
        <TimerDisplay
          timeLeft={timeLeft}
          totalTime={totalSeconds}
          isRunning={isRunning}
          activityTitle={activityTitle}
        />
      </main>

      {/* 6. Bottom Controls and 1·5·10·20분 Presets */}
      <footer className="relative z-10 w-full flex flex-col items-center gap-2 pb-5 sm:pb-8 pt-2">
        {/* Presets Bar */}
        <PresetBar
          currentTotalSeconds={totalSeconds}
          onSelectPreset={handleSelectPreset}
          onAdjustTime={handleAdjustTime}
          isRunning={isRunning}
        />

        {/* Start / Pause / Reset Controls */}
        <Controls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        {/* Keyboard shortcut hint text */}
        <p className="hidden md:block text-[11px] font-medium text-slate-400/80 drop-shadow">
          단축키: <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-slate-200">Space</kbd> 시작·일시정지 · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-slate-200">R</kbd> 처음으로 · <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-slate-200">F</kbd> 전체화면
        </p>
      </footer>

      {/* 7. Finish Modal When Time Reaches 0 */}
      <FinishModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onRestart={() => {
          setIsFinishModalOpen(false);
          handleReset();
          handleStart();
        }}
        activityTitle={activityTitle}
        alarmType={alarmType}
        onChangeAlarmType={(type) => {
          setAlarmType(type);
          soundSystem.setAlarmType(type);
        }}
      />

      {/* 8. Settings & Customization Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          soundSystem.stopAllSounds();
          setIsSettingsOpen(false);
        }}
        backgrounds={BACKGROUND_OPTIONS}
        currentBgId={currentBgId}
        onSelectBg={(id) => setCurrentBgId(id)}
        dimLevel={dimLevel}
        onChangeDimLevel={setDimLevel}
        blurLevel={blurLevel}
        onChangeBlurLevel={setBlurLevel}
        volume={volume}
        onChangeVolume={setVolume}
        enableTickSound={enableTickSound}
        onToggleTickSound={() => setEnableTickSound((prev) => !prev)}
        activityTitle={activityTitle}
        onChangeActivityTitle={setActivityTitle}
        alarmType={alarmType}
        onChangeAlarmType={(type) => {
          setAlarmType(type);
          soundSystem.setAlarmType(type);
        }}
      />
    </div>
  );
}
