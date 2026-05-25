import { useNotes } from '../context/NotesContext'

export default function SearchNoteItem({ note, folderId, onClick }) {
  const { selectedNoteId, folders } = useNotes()
  const isSelected = selectedNoteId === note.id
  const parentFolder = folderId ? folders.find((f) => f.id === folderId) : null

  return (
    <div
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${
        isSelected
          ? 'text-sidebar-fg bg-accent/[0.12] border-l-[3px] border-accent pl-[9px]'
          : 'text-gray-300 hover:bg-white/[0.04]'
      }`}
      role="treeitem"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick()
      }}
    >
      <span className="text-xs shrink-0 w-4 text-center text-gray-500" aria-hidden="true">
        &bull;
      </span>
      <span className="flex-1 truncate">{note.name}</span>
      <span className="text-xs text-gray-500 truncate max-w-[100px] text-right">
        {parentFolder ? parentFolder.name : 'Unparented'}
      </span>
    </div>
  )
}
