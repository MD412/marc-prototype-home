// Template for creating a new prototype
// To use this template:
// 1. Create a new folder in app/prototypes with your prototype name
// 2. Copy this file and styles.module.css into your new folder
// 3. Create an 'images' folder for your prototype's images
// 4. Rename and customize the component and styles as needed

import Link from 'next/link';
import styles from './styles.module.css';

export default function PrototypeTemplate() {
  return (
    <div className={styles.container}>
      {/* Main content area */}
      <main className={styles.main}>
        <h1 className={styles.title}>Your Prototype Title</h1>
        
        {/* Add your prototype content here */}
        <section className={styles.content}>
          <p>Start building your prototype here!</p>
          
          {/* Example of image usage */}
          <div className={styles.imageExample}>
            <p>Images should be stored in the images/ folder within your prototype:</p>
            <pre className={styles.code}>
              prototypes/
              └── your-prototype/
                  ├── images/
                  │   └── example.jpg
                  ├── page.tsx
                  └── styles.module.css
            </pre>
            <p>Then import them using Next.js Image component:</p>
            <pre className={styles.code}>
              {`import Image from 'next/image';
// ...
<Image
  src="/prototypes/your-prototype/images/example.jpg"
  alt="Description of image"
  width={400}
  height={300}
/>`}
            </pre>
          </div>
          
          {/* Example of a custom styled element */}
          <div className={styles.customElement}>
            <p>This is an example of a custom styled element.</p>
          </div>
        </section>

        {/* Example of an interactive element */}
        <button 
          className={styles.button}
          onClick={() => alert('Button clicked!')}
        >
          Interactive Button
        </button>
      </main>

      {/* Optional: Add a back link to the home page */}
      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>← Back to prototypes</Link>
      </footer>
    </div>
  );
} 