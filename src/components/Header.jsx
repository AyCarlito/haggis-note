import { useNotes } from '../context/NotesContext'

export default function Header() {
  const { addFolder, addNote } = useNotes()

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-sidebar-bg text-sidebar-fg border-b border-sidebar-border shrink-0">
      <h1 className="text-lg font-semibold tracking-tight">HaggisNote</h1>
      <div className="flex gap-2">
        <button
          onClick={addNote}
          className="px-3 py-1.5 text-sm rounded bg-accent text-white hover:bg-accent-hover transition-colors"
          aria-label="New note"
        >
          + Note
        </button>
        <button
          onClick={addFolder}
          className="px-3 py-1.5 text-sm rounded border border-sidebar-border text-sidebar-fg hover:bg-gray-700 transition-colors"
          aria-label="New folder"
        >
          + Folder
        </button>
      </div>
    </header>
  )
}
