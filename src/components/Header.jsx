import { useNotes } from '../context/NotesContext'
import haggisLogo from '../assets/haggis.jpg'

export default function Header() {
  const { addFolder, addNote } = useNotes()

  return (
    <header className="flex items-center justify-between h-14 px-4 shrink-0 bg-gradient-to-r from-[#232544] via-[#2a2b4e] to-[#232544] text-sidebar-fg border-b border-sidebar-border">
      <div className="flex items-center gap-2.5">
        <img src={haggisLogo} alt="" className="h-8 w-8 rounded-lg object-cover" />
        <h1 className="text-xl font-semibold tracking-tight">HaggisNote</h1>
      </div>
      <div className="flex gap-2">
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
      </div>
    </header>
  )
}
