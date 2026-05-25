import { useNotes } from '../context/NotesContext'

export default function BulkActionBar({ count }) {
  const { requestBulkDelete, clearMultiSelection } = useNotes()

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[#1e1f3a] border-t border-sidebar-border shrink-0">
      <span className="text-sm text-gray-300">
        {count} item{count !== 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={clearMultiSelection}
          className="text-xs text-gray-400 hover:text-sidebar-fg transition-colors p-1"
          aria-label="Clear selection"
        >
          &#x2715;
        </button>
        <button
          onClick={requestBulkDelete}
          className="text-xs px-2 py-1 rounded bg-danger text-white hover:bg-danger-hover transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
