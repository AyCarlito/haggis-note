import { useState, useEffect } from 'react'
import { useNotes } from '../context/NotesContext'

export default function StatusBar() {
  const { selectedNote } = useNotes()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!selectedNote) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [selectedNote?.updatedAt])

  return (
    <footer className="h-7 shrink-0 flex items-center px-4 text-xs text-status-fg bg-status-bg border-t border-toolbar-border">
      {selectedNote ? (
        <span>
          {visible ? 'Saved' : `${selectedNote.updatedAt ? new Date(selectedNote.updatedAt).toLocaleString() : ''}`}
        </span>
      ) : (
        <span>No note selected</span>
      )}
    </footer>
  )
}
