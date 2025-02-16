import Link from "next/link";
import styles from './styles/home.module.css';
import { instrumentSans } from './fonts';

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Example Prototype',
      description: 'Create your first prototype by adding a new page in the prototypes folder.',
      path: '/prototypes/example'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'My New Prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <div className={`${styles.container} ${instrumentSans.className}`}>
      <header className={styles.header}>
        <h1>Elizabeth's prototypes</h1>
      </header>

      <main>
        <section className={styles.grid}>
          {/* Map through the prototypes array to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.card}
            >
              <h3>{prototype.title}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
