# Prototyping with Cursor

This is your personal prototyping workspace for the "Prototyping with Cursor" class. Here you can create and organize all your interaction design prototypes using Next.js.

<available_instructions>
Cursor rules are user provided instructions for the AI to follow to help work with the codebase.
They may or may not be relevent to the task at hand. If they are, use the fetch_rules tool to fetch the full rule.
Some rules may be automatically attached to the conversation if the user attaches a file that matches the rule's glob, and wont need to be fetched.

css-rules: Adding a new CSS file and global styles
create-component: How to specify requirements when creating a new component
heading-case: All headings (h1, h2, h3, etc.) should use sentence case instead of title case.
prototype-home: Creating prototypes
</available_instructions>

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

1. Create a new component directory in `app/components`:
   ```
   app/components/
   └── button/              # Component directory
       ├── Button.tsx       # Component implementation
       ├── Button.module.css # Component styles
       └── index.ts         # Clean exports
   ```

2. Create the component implementation:
   ```tsx
   // app/components/button/Button.tsx
   'use client';
   
   import React from 'react';
   import styles from './Button.module.css';
   
   export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary';
     isLoading?: boolean;
   }
   
   export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className = '', children, variant = 'primary', isLoading, disabled, ...props }, ref) => {
       const buttonClasses = [
         styles.button,
         styles[variant],
         styles.md,
         className
       ].filter(Boolean).join(' ');
   
       return (
         <button
           ref={ref}
           className={buttonClasses}
           disabled={disabled || isLoading}
           {...props}
         >
           {isLoading ? (
             <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24">
               {/* Loading spinner SVG */}
             </svg>
           ) : null}
           {children}
         </button>
       );
     }
   );
   
   Button.displayName = 'Button';
   ```

3. Create the CSS module:
   ```css
   /* app/components/button/Button.module.css */
   .button {
     display: inline-flex;
     align-items: center;
     justify-content: center;
     border-radius: 6px;
     font-weight: 500;
     transition: all 0.2s ease;
     cursor: pointer;
     outline: none;
     border: none;
   }
   
   .button:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }
   
   /* Variants */
   .primary {
     background-color: #2563eb;
     color: white;
   }
   
   .primary:hover:not(:disabled) {
     background-color: #1d4ed8;
   }
   
   .secondary {
     background-color: #f3f4f6;
     color: #111827;
   }
   
   .secondary:hover:not(:disabled) {
     background-color: #e5e7eb;
   }
   
   /* Size (medium only) */
   .md {
     height: 40px;
     padding: 0 16px;
     font-size: 16px;
   }
   ```

4. Create the index file for clean exports:
   ```typescript
   // app/components/button/index.ts
   export { Button } from './Button';
   export type { ButtonProps } from './Button';
   ```

5. Use the component in any prototype:
   ```tsx
   import { Button } from '../../components/button';
   
   export default function YourPrototype() {
     return (
       <div>
         <Button onClick={() => alert('Clicked!')}>
           Primary button
         </Button>
         <Button variant="secondary" isLoading>
           Loading secondary
         </Button>
       </div>
     )
   }
   ```

This component structure provides:
- Clear organization with all related files in one directory
- Type-safe props with TypeScript
- Proper forwarding of HTML button attributes
- Loading state with spinner
- Disabled state handling
- CSS modules for scoped styling
- Clean exports through index.ts

## Creating a new component with AI

When asking the AI to create a new component, use this format:

```
Create a new component named <name> with these specifications:
1. Purpose: [Describe what the component does]
2. Props: [List the props the component should accept]
3. Variants: [List any visual variants needed]
4. States: [List any states like hover, disabled, loading, etc.]
5. Styling: [Describe any specific styling requirements]
6. Behavior: [Describe any interactive behavior]
7. Accessibility: [List any accessibility requirements]
```

Example request:
```
Create a new component named Input with these specifications:
1. Purpose: A text input field for forms
2. Props:
   - label: string
   - placeholder: string
   - error?: string
   - type?: 'text' | 'password' | 'email'
3. Variants:
   - Default
   - With error
4. States:
   - Default
   - Focus
   - Disabled
   - Error
5. Styling:
   - Modern minimal design
   - Subtle border that highlights on focus
   - Error state should show red border
6. Behavior:
   - Show error message below input when error prop is provided
   - Password type should have a show/hide password toggle
7. Accessibility:
   - Label should be properly associated with input
   - Error messages should be announced by screen readers
```

The AI will create the component following our established patterns:
- Component directory structure
- TypeScript with proper types
- CSS modules
- React best practices
- Accessibility features
- Clean exports