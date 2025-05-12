# Noted OS

A modern note-taking app that reimagines digital note-taking through the lens of classic operating system interfaces. Built with a modern aesthetic that combines ShadCN's clean design principles with Miyazaki-inspired pastel colors.

## Features

### 1. Window Management System
- Draggable windows with smooth performance
- Minimize/close functionality
- Window focus management
- Position and size memory
- Automatic position saving between sessions

### 2. Text Notes
- Rich text editing with ReactQuill
- Auto-saving functionality
- Full formatting toolbar
- Clean, modern interface
- Persistent storage using localStorage

### 3. Drawing Canvas
- Simple drawing tools
- Undo/clear functionality
- Auto-save with localStorage persistence
- Smooth drawing experience

## Technical Stack
- Next.js
- React-Rnd for window management
- ReactQuill for rich text editing
- HTML5 Canvas for drawing
- CSS Modules for styling
- Local Storage for persistence

## Setup Instructions
1. The prototype is already integrated into the main project
2. No additional setup required
3. Access via the homepage or directly at `/prototypes/noted-os`

## Usage
1. Click "New Note" to create a text note
2. Click "New Canvas" to create a drawing canvas
3. Drag windows by their title bar
4. Resize windows from any edge or corner
5. Use the minimize (-) button to collapse windows
6. Use the close (×) button to remove windows
7. All changes are automatically saved to localStorage

## Development Notes
- The prototype uses modern React patterns and hooks
- Styling follows a modular approach with CSS Modules
- Window state is managed using React's useState and useEffect
- Local storage is used for persistence between sessions
- Canvas drawing uses native HTML5 Canvas API

## Snapshot Version
- **Version 1.0** - May 12, 2025
- Stable implementation with working window system, notes, and drawing 