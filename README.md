# Prototyping with Cursor

This is your personal prototyping workspace for the "Prototyping with Cursor" class. Here you can create and organize all your interaction design prototypes using Next.js.

## Getting started

1. Click "Use this template"
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Creating a new prototype

1. Open Composer Agent `(⌘-I)`
2. Type: "Create a prototype for me named `<name>`. "
3. Describe the key features
4. Share any design style preferences

### In case you need the manual way

1. Navigate to the `app/prototypes` directory
2. Create a new folder with your prototype name (e.g., `my-prototype`)
3. Copy the contents of the `_template` folder into your new folder:
   - Copy `page.tsx` - This contains the basic prototype structure
   - Copy `styles.module.css` - This contains the prototype styles
4. Create an `images` folder in your prototype directory for any images you'll use
5. Customize the files:
   - Rename the component in `page.tsx`
   - Update the title and content
   - Modify the styles in `styles.module.css`
   - Add images to your prototype's `images` folder
6. Add your prototype to the home page:
   - Open `app/page.tsx`
   - Find the `prototypes` array at the top of the file
   - Add a new object for your prototype:
     ```typescript
     {
       title: 'My New Prototype',
       description: 'A short description of what this prototype does',
       path: '/prototypes/my-prototype'  // This should match your folder name
     }
     ```
   - Your prototype will automatically appear on the home page

### Example structure
```
app/
├── prototypes/
│   ├── _template/              # Template folder - don't modify!
│   │   ├── page.tsx           # Template component
│   │   └── styles.module.css  # Template styles
│   ├── example/               # Example prototype
│   │   ├── images/           # Prototype-specific images
│   │   │   └── example.jpg
│   │   ├── page.tsx
│   │   └── styles.module.css
│   └── your-prototype/        # Your new prototype
│       ├── images/           # Your prototype's images
│       ├── page.tsx
│       └── styles.module.css
├── components/               # Shared components
└── public/                  # Global static assets only like images
```

## Working with images

Store all images in the `/public` directory using this structure:

```
public/
    prototypes/           # Prototype-specific images
        example/          # Images for the example prototype
        your-prototype/   # Images for your prototype
    shared/              # Shared images used across prototypes
        icons/
        common/
```

## Adding a new component

Components are reusable pieces of UI that you can share across different prototypes. Here's how to create and use them:

1. Create a new component in the `app/components` directory:
   ```tsx
   // app/components/Button.tsx
   import styles from './Button.module.css'
   
   interface ButtonProps {
     children: React.ReactNode
     onClick?: () => void
     variant?: 'primary' | 'secondary'
   }
   
   export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
     return (
       <button 
         className={`${styles.button} ${styles[variant]}`}
         onClick={onClick}
       >
         {children}
       </button>
     )
   }
   ```

2. Create a CSS module for your component:
   ```css
   /* app/components/Button.module.css */
   .button {
     padding: 8px 16px;
     border-radius: 4px;
     border: none;
     cursor: pointer;
   }
   
   .primary {
     background: var(--primary-color);
     color: white;
   }
   
   .secondary {
     background: var(--secondary-color);
     color: black;
   }
   ```

3. Use your component in any prototype:
   ```tsx
   import { Button } from '@/components/Button'
   
   export default function YourPrototype() {
     return (
       <div>
         <Button variant="primary" onClick={() => alert('Clicked!')}>
           Click Me
         </Button>
       </div>
     )
   }
   ```