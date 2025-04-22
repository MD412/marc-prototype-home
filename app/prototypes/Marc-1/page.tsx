"use client";

// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import Link from 'next/link';
import styles from './styles.module.css';
import { spaceGrotesk } from '@/app/fonts';
import { useState } from 'react';

export default function Marc1Prototype() {
  const [count, setCount] = useState(0);

  return (
    <div className={`${styles.container} ${spaceGrotesk.className}`}>
      {/* Decorative elements */}
      <div className={styles.starburst} style={{ top: '10%', left: '10%' }} />
      <div className={styles.starburst} style={{ top: '20%', right: '15%' }} />
      <div className={styles.boomerang} style={{ bottom: '10%', right: '20%' }} />
      <div className={styles.boomerang} style={{ top: '30%', left: '25%', transform: 'rotate(45deg)' }} />

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <h1>Googie meets shadcn</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Atomic Age Counter
          </h2>
          <p className={styles.cardDescription}>
            Experience the fusion of retro-futuristic Googie style with modern shadcn components
          </p>
          <button
            className={styles.button}
            onClick={() => setCount(prev => prev + 1)}
          >
            Count: {count}
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Design Elements
          </h2>
          <ul className={styles.featureList}>
            <li>🌟 Atomic age-inspired decorative elements</li>
            <li>🎨 Googie color palette with modern gradients</li>
            <li>💫 Subtle animations and interactions</li>
            <li>🎯 shadcn-style component architecture</li>
            <li>🌈 Retro-futuristic optimism</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 