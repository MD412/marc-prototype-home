import styles from './styles.module.css';

export default function ExamplePrototype() {
  return (
    <div className={styles.container}>
      <h1>Example Prototype</h1>
      <p>This is an example of how to structure your prototype pages.</p>
      
      <div className={styles.section}>
        <h2>How to Create Your Own Prototype</h2>
        <ol className={styles.list}>
          <li>Create a new folder in the prototypes directory</li>
          <li>Add a page.tsx file inside your folder</li>
          <li>Create your prototype components</li>
          <li>Import and use any shared components from the components folder</li>
        </ol>
      </div>
    </div>
  );
} 