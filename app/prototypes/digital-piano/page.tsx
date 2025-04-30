"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';
import VaporwaveBackground from './VaporwaveBackground';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const keyboardMap: { [key: string]: string } = {
  'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
  'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
  'u': 'A#', 'j': 'B'
};

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface NoteState {
  oscillator: OscillatorNode;
  gain: GainNode;
}

interface Note {
  note: string;
  duration: number; // in milliseconds
}

const themes = {
  quantum: {
    name: 'Quantum',
    primary: '#00ffff',
    secondary: '#ff00ff',
    bgStart: '#001a2c',
    bgEnd: '#003344',
    accent: 'rgba(0, 255, 255, 0.2)'
  },
  eva: {
    name: 'EVA-01',
    primary: '#a020f0',
    secondary: '#d891ef',
    bgStart: '#1a0044',
    bgEnd: '#0f0022',
    accent: 'rgba(160, 32, 240, 0.15)'
  },
  matrix: {
    name: 'Matrix',
    primary: '#00ff00',
    secondary: '#39ff14',
    bgStart: '#001a00',
    bgEnd: '#002200',
    accent: 'rgba(0, 255, 0, 0.2)'
  },
  neon: {
    name: 'Neon',
    primary: '#ff0000',
    secondary: '#ff4d4d',
    bgStart: '#1a0000',
    bgEnd: '#330000',
    accent: 'rgba(255, 0, 0, 0.2)'
  }
};

type ThemeKey = keyof typeof themes;

export default function DigitalPiano() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.5);
  const [octave, setOctave] = useState<number>(4);
  const [attack, setAttack] = useState<number>(0.05);
  const [release, setRelease] = useState<number>(0.1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const noteStatesRef = useRef<{ [key: string]: NoteState }>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('quantum');

  // Initialize audio context on component mount
  useEffect(() => {
    initializeAudio();
  }, []);

  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      console.log('Initializing AudioContext');
      const ctx = new AudioContext();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNode.connect(ctx.destination);
      
      audioContextRef.current = ctx;
      analyserRef.current = analyserNode;
      setAudioContext(ctx);
      setAnalyser(analyserNode);
      console.log('AudioContext initialized');
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((note: string) => {
    const ctx = audioContextRef.current;
    const analyserNode = analyserRef.current;
    
    if (!ctx || !analyserNode) {
      console.log('No audio context available');
      return;
    }

    console.log('Playing note:', note);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = waveform;
    osc.frequency.setValueAtTime(getNoteFrequency(note), ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
    
    osc.connect(gain);
    gain.connect(analyserNode);
    osc.start();

    noteStatesRef.current[note] = { oscillator: osc, gain };
    setActiveNotes(prev => new Set(prev).add(note));
  }, [waveform, volume, attack]);

  const stopNote = useCallback((note: string) => {
    console.log('Stopping note:', note);
    const noteState = noteStatesRef.current[note];
    const ctx = audioContextRef.current;
    
    if (noteState && ctx) {
      const { oscillator, gain } = noteState;
      
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.01);
      
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gain.disconnect();
      }, 20);

      delete noteStatesRef.current[note];
      setActiveNotes(prev => {
        const newNotes = new Set(prev);
        newNotes.delete(note);
        return newNotes;
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key down:', e.key);
      const key = e.key.toLowerCase();
      if (keyboardMap[key] && !e.repeat) {
        console.log('Playing note:', keyboardMap[key]);
        initializeAudio();
        playNote(keyboardMap[key]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('Key up:', e.key);
      const key = e.key.toLowerCase();
      if (keyboardMap[key]) {
        console.log('Stopping note:', keyboardMap[key]);
        stopNote(keyboardMap[key]);
      }
    };

    // Handle page visibility change to stop all notes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        Object.keys(noteStatesRef.current).forEach(stopNote);
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      Object.keys(noteStatesRef.current).forEach(stopNote);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeAudio, playNote, stopNote]);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Get the current theme colors
      const wrapper = canvas.closest(`.${styles.wrapper}`)!;
      const themeColor = getComputedStyle(wrapper).getPropertyValue('--theme-primary');
      const themeBgStart = getComputedStyle(wrapper).getPropertyValue('--theme-bg-start');

      // Use theme background color with opacity
      ctx.fillStyle = `${themeBgStart}cc`; // cc = 80% opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = themeColor;
      ctx.beginPath();

      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }, [analyser, currentTheme]);

  const stopAllNotes = () => {
    Object.keys(noteStatesRef.current).forEach(note => {
      stopNote(note);
    });
    setActiveNotes(new Set());
  };

  const getNoteFrequency = (note: string) => {
    const noteIndex = notes.indexOf(note);
    return 440 * Math.pow(2, (noteIndex - 9) / 12 + (octave - 4));
  };

  // Update theme CSS variables when theme changes
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.querySelector(`.${styles.wrapper}`) as HTMLElement;
    if (root) {
      root.style.setProperty('--theme-primary', theme.primary);
      root.style.setProperty('--theme-secondary', theme.secondary);
      root.style.setProperty('--theme-bg-start', theme.bgStart);
      root.style.setProperty('--theme-bg-end', theme.bgEnd);
      root.style.setProperty('--theme-accent', theme.accent);
    }
  }, [currentTheme]);

  return (
    <div className={styles.wrapper}>
      {audioContext && analyser && (
        <VaporwaveBackground
          audioContext={audioContext}
          analyser={analyser}
          waveform={waveform}
          theme={themes[currentTheme]}
        />
      )}
      <div className={styles.background} />
      <div className={styles.starfield} />
      <Link href="/" className={styles.backButton}>
        ← Back to Prototypes
      </Link>
      <div className={styles.themePicker}>
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            className={`${styles.themeButton} ${styles[key]} ${currentTheme === key ? styles.active : ''}`}
            onClick={() => setCurrentTheme(key as ThemeKey)}
            title={theme.name}
          />
        ))}
      </div>
      <div className={styles.container} onClick={initializeAudio}>
        <div className={styles.titleBar}>
          <div className={styles.windowControls}>
            <div className={styles.windowButton}></div>
            <div className={styles.windowButton}></div>
            <div className={styles.windowButton}></div>
          </div>
          <span>QUANTUM SYNTHESIZER v1.0</span>
        </div>
        
        <div className={styles.content}>
          <div className={styles.mainLayout}>
            <div className={styles.controlPanel}>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>WAVEFORM</label>
                <div className={styles.waveformButtons}>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'sine' ? styles.active : ''}`}
                    onClick={() => {
                      initializeAudio();
                      setWaveform('sine');
                    }}
                  >
                    Sine
                  </button>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'square' ? styles.active : ''}`}
                    onClick={() => {
                      initializeAudio();
                      setWaveform('square');
                    }}
                  >
                    Square
                  </button>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'sawtooth' ? styles.active : ''}`}
                    onClick={() => {
                      initializeAudio();
                      setWaveform('sawtooth');
                    }}
                  >
                    Saw
                  </button>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'triangle' ? styles.active : ''}`}
                    onClick={() => {
                      initializeAudio();
                      setWaveform('triangle');
                    }}
                  >
                    Tri
                  </button>
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>AMPLITUDE</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>ATTACK</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={attack}
                  onChange={(e) => setAttack(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>RELEASE</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={release}
                  onChange={(e) => setRelease(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.rightPanel}>
              <canvas 
                ref={canvasRef}
                className={styles.visualizer}
                width={1000}
                height={100}
              />

              <div className={styles.keyboardSection}>
                <div className={styles.octaveControl}>
                  <label className={styles.controlLabel}>OCTAVE</label>
                  <div className={styles.octaveControls}>
                    <button 
                      className={styles.octaveButton}
                      onClick={() => setOctave(o => Math.max(0, o - 1))}
                    >
                      -
                    </button>
                    <div 
                      className={styles.octaveDisplay} 
                      style={{ '--octave': octave } as React.CSSProperties}
                    />
                    <button 
                      className={styles.octaveButton}
                      onClick={() => setOctave(o => Math.min(8, o + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.keyboard}>
                  {notes.map((note) => (
                    <button
                      key={note}
                      className={`${styles.key} ${note.includes('#') ? styles.black : styles.white} 
                        ${activeNotes.has(note) ? styles.active : ''}`}
                      onMouseDown={() => {
                        initializeAudio();
                        playNote(note);
                      }}
                      onMouseUp={() => stopNote(note)}
                      onMouseLeave={() => stopNote(note)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        initializeAudio();
                        playNote(note);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        stopNote(note);
                      }}
                    >
                      <span>{note}</span>
                      <span className={styles.keyLabel}>
                        {Object.entries(keyboardMap).find(([_, n]) => n === note)?.[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.instructions}>
                <p>QUANTUM SYNTHESIZER CONTROL INTERFACE</p>
                <p>PRESS A-J FOR WHITE KEYS</p>
                <p>PRESS W,E,T,Y,U FOR BLACK KEYS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 