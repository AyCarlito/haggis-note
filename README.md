# HaggisNote

Note-taking app that runs entirely in your browser. No server, no accounts. Everything stays on your computer.

## Features

- Rich text editor with bold, italic, headings, colors, fonts, font sizes
- Internal note-to-note linking
- Folders with drag-and-drop reordering
- Search notes by name
- Multi-select with Ctrl+Click and Shift+Click for bulk operations
- Keyboard shortcuts
- Glass & Gradient UI theme

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (CSS-based config via `@theme` in `index.css`)
- **TipTap v3** (StarterKit, Underline, Link, TextStyle, Color, FontFamily, FontSize)
- **@hello-pangea/dnd** for drag-and-drop

## Getting Started

### Prerequisites

- Node.js 22 (see `mise.toml`)

### Commands

```sh
npm install       # install dependencies
npm run dev       # start dev server (usually http://localhost:5173)
npm run build     # production build
npm run preview   # preview production build
npm run lint      # run ESLint
