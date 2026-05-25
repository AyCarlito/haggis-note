import { useNotes } from '../context/NotesContext'

export default function Header() {
  const { addFolder, addNote } = useNotes()

  return (
    <header className="flex items-center justify-between h-14 px-4 shrink-0 bg-gradient-to-r from-[#232544] via-[#2a2b4e] to-[#232544] text-sidebar-fg border-b border-sidebar-border">
      <h1 className="text-xl font-semibold tracking-tight">HaggisNote</h1>
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
