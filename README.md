# Prototyping with Next.js

This is your personal prototyping workspace for the "Prototyping with Cursor" class. Here you can create and organize all your interaction design prototypes using Next.js.

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Creating a New Prototype

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

Example structure:
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
└── public/                  # Global static assets only
```

## Working with Images

Each prototype should store its images in its own `images` folder:

1. Create an `images` folder in your prototype directory:
   ```
   app/prototypes/your-prototype/images/
   ```

2. Add your images to this folder

3. Use them in your prototype with the Next.js Image component:
   ```tsx
   import Image from 'next/image';

   // In your component:
   <Image
     src="/prototypes/your-prototype/images/example.jpg"
     alt="Description of image"
     width={400}
     height={300}
   />
   ```

This organization keeps each prototype's assets self-contained and makes it easier to:
- Manage assets for each prototype
- Avoid naming conflicts
- Remove prototypes when no longer needed
- Share prototypes with others

## Project Structure

- `app/page.tsx` - The main landing page that displays all your prototypes
- `app/prototypes/` - Create your prototypes here, one folder per prototype
- `app/prototypes/_template/` - Template for creating new prototypes
- `app/components/` - Shared components that can be used across prototypes
- `app/styles/` - CSS modules and style utilities
- `public/` - Global static assets only (favicon, logos, etc.)

## Best Practices

1. Keep each prototype in its own folder
2. Store prototype images in the prototype's `images` folder
3. Use meaningful names for your prototype folders
4. Create reusable components in the `components` folder
5. Add comments to explain complex interactions
6. Use CSS modules for styling to avoid conflicts
7. Keep prototype descriptions on the home page short and clear

## Need Help?

- Check the example prototype in `app/prototypes/example`
- Look at the template in `app/prototypes/_template`
- Refer to the [Next.js Documentation](https://nextjs.org/docs)
- Ask questions in class or during office hours

Happy prototyping! 🚀
