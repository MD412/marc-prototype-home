"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import { useEffect, useState, useRef } from 'react';
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

  useEffect(() => {
    const ctx = new AudioContext();
    const analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 2048;
    analyserNode.connect(ctx.destination);
    setAudioContext(ctx);
    setAnalyser(analyserNode);

    const handleKeyDown = (e: KeyboardEvent) => {
      const note = keyboardMap[e.key.toLowerCase()];
      if (!note || e.repeat) return;
      
      if (!noteStatesRef.current[note]) {
        playNote(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyboardMap[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    // Handle page visibility change to stop all notes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllNotes();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAllNotes();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(10, 10, 31, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ffff';
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
  }, [analyser]);

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

  const stopNote = (note: string) => {
    const noteState = noteStatesRef.current[note];
    if (noteState && audioContext) {
      const { oscillator, gain } = noteState;
      
      gain.gain.cancelScheduledValues(audioContext.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.01);
      
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
  };

  const playNote = (note: string) => {
    if (!audioContext || !analyser) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = waveform;
    osc.frequency.setValueAtTime(getNoteFrequency(note), audioContext.currentTime);
    
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + attack);
    
    osc.connect(gain);
    gain.connect(analyser);
    osc.start();

    noteStatesRef.current[note] = { oscillator: osc, gain };
    setActiveNotes(prev => new Set(prev).add(note));
  };

  return (
    <>
      <div className={styles.background} />
      <div className={styles.starfield} />
      <div className={styles.container}>
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
                    onClick={() => setWaveform('sine')}
                  >
                    Sine
                  </button>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'square' ? styles.active : ''}`}
                    onClick={() => setWaveform('square')}
                  >
                    Square
                  </button>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'sawtooth' ? styles.active : ''}`}
                    onClick={() => setWaveform('sawtooth')}
                  >
                    Saw
                  </button>
                  <button
                    className={`${styles.waveformButton} ${waveform === 'triangle' ? styles.active : ''}`}
                    onClick={() => setWaveform('triangle')}
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
                      onMouseDown={() => playNote(note)}
                      onMouseUp={() => stopNote(note)}
                      onMouseLeave={() => stopNote(note)}
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
      {audioContext && analyser && (
        <VaporwaveBackground 
          audioContext={audioContext} 
          analyser={analyser}
          waveform={waveform}
        />
      )}
    </>
  );
} 