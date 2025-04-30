"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

export default function TypographyExperiments() {
  const [text, setText] = useState("Type something magical");
  const [effect, setEffect] = useState("glitch");

  const effects = {
    "glitch": styles.effectGlitch,
    "circular": styles.effectCircular,
    "wavy": styles.effectWavy,
    "gradient": styles.effectGradient
  };

  // Function to render circular text
  const renderCircularText = (text: string) => {
    const characters = text.split('');
    const radius = 120;
    const totalChars = characters.length;
    
    return (
      <div className={styles.circularContainer}>
        {characters.map((char, index) => {
          const angle = (index * 360) / totalChars;
          const style = {
            '--char-angle': `${angle}deg`,
            '--radius': `${radius}px`,
          } as React.CSSProperties;
          
          return (
            <span 
              key={index} 
              className={styles.circularChar}
              style={style}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  // Function to render wavy text
  const renderWavyText = (text: string) => {
    const characters = text.split('');
    
    return (
      <div className={styles.wavyContainer}>
        {characters.map((char, index) => {
          const style = {
            '--char-index': index,
          } as React.CSSProperties;
          
          return (
            <span 
              key={index} 
              className={styles.wavyChar}
              style={style}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  // Function to render glitch text
  const renderGlitchText = (text: string) => {
    const characters = text.split('');
    
    return (
      <div className={styles.glitchContainer}>
        {characters.map((char, index) => {
          const style = {
            '--char-index': index,
            '--total-chars': characters.length,
          } as React.CSSProperties;
          
          return (
            <div 
              key={index} 
              className={styles.glitchCharWrapper}
              style={style}
            >
              <span className={styles.glitchChar}>{char}</span>
              <span className={styles.glitchCharCyan}>{char}</span>
              <span className={styles.glitchCharMagenta}>{char}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Add this new function after the other render functions
  const renderGradientText = (text: string) => {
    const characters = text.split('');
    
    return (
      <div className={styles.gradientContainer}>
        {characters.map((char, index) => {
          const style = {
            '--char-index': index,
            '--total-chars': characters.length,
          } as React.CSSProperties;
          
          return (
            <span 
              key={index} 
              className={styles.gradientChar}
              style={style}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const renderText = () => {
    switch(effect) {
      case 'circular':
        return renderCircularText(text);
      case 'wavy':
        return renderWavyText(text);
      case 'glitch':
        return renderGlitchText(text);
      case 'gradient':
        return renderGradientText(text);
      default:
        return text;
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back to Prototypes
      </Link>
      
      <main className={styles.main}>
        <div 
          className={`${styles.displayText} ${effects[effect as keyof typeof effects]}`}
          data-text={text}
        >
          {renderText()}
        </div>

        <div className={styles.controls}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.textInput}
            placeholder="Enter your text..."
            maxLength={50}
          />
          
          <div className={styles.effectControls}>
            {Object.keys(effects).map((effectName) => (
              <button
                key={effectName}
                className={`${styles.effectButton} ${effect === effectName ? styles.active : ''}`}
                onClick={() => setEffect(effectName)}
              >
                {effectName}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 