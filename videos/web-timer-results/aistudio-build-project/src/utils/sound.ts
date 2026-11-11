// Web Audio API Synthesizer for Classroom Chime and Christmas Carol Sounds

export type AlarmSoundType = 'jingle_bells' | 'we_wish_you' | 'classic_chime';

interface ActiveNode {
  stop: (time?: number) => void;
}

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private activeNodes: ActiveNode[] = [];
  private activeMasterGains: GainNode[] = [];
  private currentAlarmType: AlarmSoundType = 'jingle_bells';

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllSounds();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setAlarmType(type: AlarmSoundType) {
    this.currentAlarmType = type;
  }

  public getAlarmType(): AlarmSoundType {
    return this.currentAlarmType;
  }

  public stopAllSounds() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Quick gentle fade out to prevent clicks
    this.activeMasterGains.forEach((gain) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch {
        // ignore
      }
    });

    this.activeNodes.forEach((node) => {
      try {
        node.stop(now + 0.06);
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.activeMasterGains = [];
  }

  // Play a single bell / chime note with warm harmonic overtones
  private playBellNote(
    ctx: AudioContext,
    masterGain: GainNode,
    freq: number,
    startTime: number,
    duration: number,
    noteGain: number = 0.35
  ) {
    // 1. Fundamental sine wave
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    g1.gain.setValueAtTime(0, startTime);
    g1.gain.linearRampToValueAtTime(noteGain, startTime + 0.015);
    g1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(g1);
    g1.connect(masterGain);
    osc1.start(startTime);
    osc1.stop(startTime + duration);
    this.activeNodes.push(osc1);

    // 2. Chime harmonic overtone (celesta / glockenspiel feel)
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, startTime);

    g2.gain.setValueAtTime(0, startTime);
    g2.gain.linearRampToValueAtTime(noteGain * 0.45, startTime + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.65);

    osc2.connect(g2);
    g2.connect(masterGain);
    osc2.start(startTime);
    osc2.stop(startTime + duration * 0.7);
    this.activeNodes.push(osc2);

    // 3. High sparkling 3rd harmonic
    const osc3 = ctx.createOscillator();
    const g3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3.0, startTime);

    g3.gain.setValueAtTime(0, startTime);
    g3.gain.linearRampToValueAtTime(noteGain * 0.2, startTime + 0.008);
    g3.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.4);

    osc3.connect(g3);
    g3.connect(masterGain);
    osc3.start(startTime);
    osc3.stop(startTime + duration * 0.45);
    this.activeNodes.push(osc3);
  }

  // Play joyful Sleigh Bell percussion sound
  private playSleighBell(ctx: AudioContext, masterGain: GainNode, time: number) {
    const clusterFreqs = [2400, 2750, 3100, 3700, 4200];
    clusterFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.04, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.13);
      this.activeNodes.push(osc);
    });
  }

  // 1. Play "Jingle Bells" (징글벨) Chorus
  public playJingleBells() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAllSounds();

    const now = ctx.currentTime + 0.05;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);
    this.activeMasterGains.push(masterGain);

    const beat = 0.36; // Brisk and cheerful!

    // Note frequencies
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;
    const G5 = 783.99;
    const C4 = 261.63;
    const F4 = 349.23;
    const G4 = 392.00;

    // Melody: [freq, startBeat, durationInBeats, noteGain]
    const melody: Array<[number, number, number, number?]> = [
      // "Jin-gle bells, jin-gle bells,"
      [E5, 0, 0.8],
      [E5, 1, 0.8],
      [E5, 2, 1.8],

      [E5, 4, 0.8],
      [E5, 5, 0.8],
      [E5, 6, 1.8],

      // "jin-gle all the way!"
      [E5, 8, 0.8],
      [G5, 9, 0.8],
      [C5, 10, 1.2],
      [D5, 11.2, 0.6],
      [E5, 12, 3.2],

      // "Oh what fun it is to ride in a"
      [F5, 16, 0.8],
      [F5, 17, 0.8],
      [F5, 18, 1.2],
      [F5, 19.2, 0.6],
      [F5, 20, 0.8],
      [E5, 21, 0.8],
      [E5, 22, 0.8],
      [E5, 22.8, 0.5],
      [E5, 23.4, 0.5],

      // "one-horse o-pen sleigh, hey!"
      [E5, 24, 0.8],
      [D5, 25, 0.8],
      [D5, 26, 0.8],
      [E5, 27, 0.8],
      [D5, 28, 1.8],
      [G5, 30, 1.8],

      // "Jin-gle bells, jin-gle bells,"
      [E5, 32, 0.8],
      [E5, 33, 0.8],
      [E5, 34, 1.8],

      [E5, 36, 0.8],
      [E5, 37, 0.8],
      [E5, 38, 1.8],

      // "jin-gle all the way!"
      [E5, 40, 0.8],
      [G5, 41, 0.8],
      [C5, 42, 1.2],
      [D5, 43.2, 0.6],
      [E5, 44, 3.2],

      // "Oh what fun it is to ride in a"
      [F5, 48, 0.8],
      [F5, 49, 0.8],
      [F5, 50, 1.2],
      [F5, 51.2, 0.6],
      [F5, 52, 0.8],
      [E5, 53, 0.8],
      [E5, 54, 0.8],
      [E5, 55, 0.8],

      // "one horse o-pen sleigh!"
      [G5, 56, 0.8],
      [G5, 57, 0.8],
      [F5, 58, 0.8],
      [D5, 59, 0.8],
      [C5, 60, 3.6, 0.45], // Grand finish ring!
    ];

    // Schedule melody notes
    melody.forEach(([freq, startBeat, durBeats, gainVal]) => {
      const startTime = now + startBeat * beat;
      const duration = durBeats * beat * 1.35; // natural decay
      this.playBellNote(ctx, masterGain, freq, startTime, duration, gainVal || 0.35);
    });

    // Schedule sleigh bells & warm bass harmony on every beat
    const totalBeats = 64;
    for (let b = 0; b <= totalBeats; b++) {
      const time = now + b * beat;
      // Sleigh bell jingle
      this.playSleighBell(ctx, masterGain, time);

      // Bass notes on bar downbeats (every 4 beats)
      if (b % 4 === 0 && b < 60) {
        let bassFreq = C4;
        if (b >= 16 && b < 24) bassFreq = F4;
        else if (b >= 24 && b < 32) bassFreq = G4;
        else if (b >= 48 && b < 56) bassFreq = F4;
        else if (b >= 56) bassFreq = G4;

        this.playBellNote(ctx, masterGain, bassFreq, time, beat * 3.5, 0.18);
      }
    }
  }

  // 2. Play "We Wish You a Merry Christmas"
  public playWeWishYou() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAllSounds();

    const now = ctx.currentTime + 0.05;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);
    this.activeMasterGains.push(masterGain);

    const beat = 0.42;

    const D4 = 293.66;
    const G4 = 392.00;
    const A4 = 440.00;
    const B4 = 493.88;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const FS5 = 739.99; // F#5
    const G5 = 783.99;
    const A5 = 880.00;

    // Melody in G Major (3/4 time)
    const melody: Array<[number, number, number, number?]> = [
      // "We wish you a"
      [D5, 0, 1.0],
      [G5, 1, 1.0],
      [G5, 2, 0.5],
      [A5, 2.5, 0.5],
      [G5, 3, 0.5],
      [FS5, 3.5, 0.5],
      // "mer-ry Christ-mas,"
      [E5, 4, 1.0],
      [E5, 5, 1.0],
      [E5, 6, 1.0],

      // "We wish you a"
      [E5, 7, 1.0],
      [A5, 8, 1.0],
      [A5, 9, 0.5],
      [B4, 9.5, 0.5],
      [A5, 10, 0.5],
      [G5, 10.5, 0.5],
      // "mer-ry Christ-mas,"
      [FS5, 11, 1.0],
      [D5, 12, 1.0],
      [D5, 13, 1.0],

      // "We wish you a"
      [D5, 14, 1.0],
      [B4, 15, 1.0],
      [B4, 16, 0.5],
      [C5, 16.5, 0.5],
      [B4, 17, 0.5],
      [A5, 17.5, 0.5],
      // "mer-ry Christ-mas and a"
      [G5, 18, 1.0],
      [E5, 19, 1.0],
      [D4, 20, 0.5],
      [D4, 20.5, 0.5],
      // "hap-py New Year!"
      [E5, 21, 1.0],
      [A5, 22, 1.0],
      [FS5, 23, 1.0],
      [G5, 24, 3.0, 0.45],
    ];

    melody.forEach(([freq, startBeat, durBeats, gainVal]) => {
      const startTime = now + startBeat * beat;
      const duration = durBeats * beat * 1.35;
      this.playBellNote(ctx, masterGain, freq, startTime, duration, gainVal || 0.35);
    });

    for (let b = 0; b <= 26; b++) {
      const time = now + b * beat;
      this.playSleighBell(ctx, masterGain, time);
    }
  }

  // 3. Classic School Westminster Chime
  public playClassicChime() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAllSounds();

    const now = ctx.currentTime + 0.05;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);
    this.activeMasterGains.push(masterGain);

    const notes = [
      { freq: 659.25, time: 0.0, dur: 0.8 }, // E5
      { freq: 523.25, time: 0.65, dur: 0.8 }, // C5
      { freq: 587.33, time: 1.3, dur: 0.8 }, // D5
      { freq: 392.00, time: 1.95, dur: 1.4 }, // G4
      // Final chord
      { freq: 523.25, time: 2.8, dur: 2.0 }, // C5
      { freq: 659.25, time: 2.8, dur: 2.0 }, // E5
      { freq: 783.99, time: 2.8, dur: 2.2 }, // G5
      { freq: 1046.50, time: 2.85, dur: 2.5 }, // C6
    ];

    notes.forEach((note) => {
      this.playBellNote(ctx, masterGain, note.freq, now + note.time, note.dur, 0.4);
    });
  }

  // Play configured finish sound
  public playFinishSound() {
    if (this.currentAlarmType === 'jingle_bells') {
      this.playJingleBells();
    } else if (this.currentAlarmType === 'we_wish_you') {
      this.playWeWishYou();
    } else {
      this.playClassicChime();
    }
  }

  // Soft rhythmic tick for the final 10 seconds countdown
  public playCountdownTick(secondNumber: number) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.7, now);
    masterGain.connect(ctx.destination);

    const isFinalThree = secondNumber <= 3;
    const baseFreq = isFinalThree ? 880 : 587.33;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isFinalThree ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(isFinalThree ? 0.35 : 0.22, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinalThree ? 0.25 : 0.15));

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Click feedback
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    gain.gain.setValueAtTime(0.08 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const soundSystem = new SoundSystem();
