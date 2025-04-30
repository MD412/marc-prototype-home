"use client";

import Link from "next/link";
import styles from './styles/home.module.css';
import { spaceGrotesk } from './fonts';
import ParticleField from './components/ParticleField';

export default function Home() {
  const prototypes = [
    {
      title: 'Typography Experiments',
      description: 'Interactive typography playground with creative CSS effects',
      path: '/prototypes/typography-experiments'
    },
    {
      title: 'Digital Piano',
      description: 'A retro-styled digital piano with Mac OS aesthetics',
      path: '/prototypes/digital-piano'
    },
    {
      title: 'Getting started',
      description: 'Learn how to create and customize your prototypes',
      path: '/prototypes/example'
    },
    {
      title: 'Confetti button',
      description: 'Interactive button with confetti animation',
      path: '/prototypes/confetti-button'
    },
  ];

  return (
    <div className={`${styles.container} ${spaceGrotesk.className}`}>
      <ParticleField />
      
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Marc's Prototypes</h1>
          <a 
            href="https://twitter.com/Zanzoy" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.twitterLink}
          >
            @Zanzoy
          </a>
        </header>

        <main className={styles.grid}>
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.linkCard}
            >
              <div className={styles.card}>
                <h3>{prototype.title}</h3>
                <p>{prototype.description}</p>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}
