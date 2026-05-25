import { useState } from 'react'
import { useNotes } from '../context/NotesContext'
import haggisLogo from '../assets/haggis.jpg'
import HelpDialog from './HelpDialog'

export default function Header() {
  const { addFolder, addNote } = useNotes()
  const [showHelp, setShowHelp] = useState(false)

  return (
    <header className="flex items-center justify-between h-14 px-4 shrink-0 bg-gradient-to-r from-[#232544] via-[#2a2b4e] to-[#232544] text-sidebar-fg border-b border-sidebar-border">
      <div className="flex items-center gap-2.5">
        <img src={haggisLogo} alt="" className="h-8 w-8 rounded-lg object-cover" />
        <h1 className="text-xl font-semibold tracking-tight">HaggisNote</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={addNote}
          className="px-4 py-1.5 text-sm rounded-full bg-accent/90 text-white hover:bg-accent-hover transition-colors shadow-sm"
          aria-label="New note"
        >
          + Note
        </button>
        <button
          onClick={addFolder}
          className="px-4 py-1.5 text-sm rounded-full border border-white/10 bg-white/5 text-sidebar-fg hover:bg-white/10 transition-colors"
          aria-label="New folder"
        >
          + Folder
        </button>
        <button
          onClick={() => setShowHelp(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-accent hover:bg-white/[0.06] transition-colors"
          aria-label="Help"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
      </div>
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
    </header>
  )
}
