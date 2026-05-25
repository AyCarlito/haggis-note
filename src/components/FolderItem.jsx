import { useState, useRef, useEffect } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { useNotes } from '../context/NotesContext'
import NoteItem from './NoteItem'

export default function FolderItem({ folder, index }) {
  const {
    toggleExpanded,
    selectedFolderId,
    selectFolder,
    requestDelete,
    requestRename,
    renameTarget,
    finishRename,
    cancelRename,
  } = useNotes()

  const isExpanded = !folder.collapsed
  const isSelected = selectedFolderId === folder.id
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(folder.name)
  const inputRef = useRef(null)

  const isRenaming = renameTarget?.type === 'folder' && renameTarget?.id === folder.id

  useEffect(() => {
    if (isRenaming) {
      setEditing(true)
      setEditValue(folder.name)
    }
  }, [isRenaming, folder.name])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function handleDoubleClick(e) {
    e.stopPropagation()
    requestRename({ type: 'folder', id: folder.id })
  }

  function handleBlur() {
    setEditing(false)
    finishRename(folder.id, editValue)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setEditValue(folder.name)
      setEditing(false)
      cancelRename()
    }
  }

  function handleToggle() {
    toggleExpanded(folder.id)
    selectFolder(folder.id)
  }

  return (
    <div role="treeitem" aria-expanded={isExpanded}>
      <div
        className={`group flex items-center gap-1 px-2 py-2 rounded text-sm cursor-pointer transition-colors ${
          isSelected ? 'bg-gray-700 text-sidebar-fg' : 'text-gray-300 hover:bg-gray-700'
        }`}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
          if (e.key === 'ArrowRight' && !isExpanded) toggleExpanded(folder.id)
          if (e.key === 'ArrowLeft' && isExpanded) toggleExpanded(folder.id)
        }}
      >
        <span
          className={`shrink-0 text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          ▶
        </span>
        {editing ? (
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-b border-current outline-none text-sm min-w-0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 truncate font-medium" onDoubleClick={handleDoubleClick}>
            {folder.name}
          </span>
        )}
        <span className="text-xs text-gray-500">{folder.notes.length}</span>
        {!editing && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              requestDelete({ type: 'folder', id: folder.id, name: folder.name })
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-xs text-gray-400 hover:text-danger transition-opacity"
            aria-label={`Delete folder ${folder.name}`}
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>
      {isExpanded && (
        <Droppable droppableId={folder.id} direction="vertical">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`ml-3 pl-2 border-l border-gray-600 min-h-[4px] transition-colors ${
                snapshot.isDraggingOver ? 'border-accent bg-gray-800 rounded' : ''
              }`}
              role="group"
              aria-label={`Notes in ${folder.name}`}
            >
              {folder.notes.map((note, i) => (
                <NoteItem key={note.id} note={note} folderId={folder.id} index={i} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  )
}
