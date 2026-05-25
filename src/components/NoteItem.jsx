import { useState, useRef, useEffect } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { useNotes } from '../context/NotesContext'

export default function NoteItem({ note, folderId, index }) {
  const { selectedNoteId, selectNote, requestDelete, requestRename, renameTarget, finishRename, cancelRename } = useNotes()
  const isSelected = selectedNoteId === note.id
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(note.name)
  const inputRef = useRef(null)

  const isRenaming = renameTarget?.type === 'note' && renameTarget?.id === note.id

  useEffect(() => {
    if (isRenaming) {
      setEditing(true)
      setEditValue(note.name)
    }
  }, [isRenaming, note.name])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function handleDoubleClick(e) {
    e.stopPropagation()
    requestRename({ type: 'note', id: note.id })
  }

  function handleBlur() {
    setEditing(false)
    finishRename(note.id, editValue)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setEditValue(note.name)
      setEditing(false)
      cancelRename()
    }
  }

  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${
            isSelected
              ? 'text-accent bg-accent/10 border-l-2 border-accent pl-[10px]'
              : snapshot.isDragging
                ? 'text-sidebar-fg bg-white/10 shadow-xl rotate-[0.5deg]'
                : 'text-gray-300 hover:bg-white/[0.04]'
          }`}
          style={{ ...provided.draggableProps.style }}
          role="treeitem"
          aria-selected={isSelected}
          tabIndex={0}
          onClick={() => selectNote(folderId, note.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') selectNote(folderId, note.id)
          }}
        >
          <span className="text-xs shrink-0" aria-hidden="true">&#x2022;</span>
          {editing ? (
            <input
              ref={inputRef}
              className="flex-1 bg-transparent border-b border-current outline-none text-sm min-w-0"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span
              className="flex-1 truncate"
              onDoubleClick={handleDoubleClick}
            >
              {note.name}
            </span>
          )}
          {!editing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                requestDelete({ type: 'note', id: note.id, name: note.name })
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-xs text-gray-400 hover:text-danger transition-opacity"
              aria-label={`Delete note ${note.name}`}
              tabIndex={-1}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </Draggable>
  )
}
