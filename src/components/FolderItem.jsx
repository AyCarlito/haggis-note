import { useState, useRef, useEffect } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { useNotes } from '../context/NotesContext'
import NoteItem from './NoteItem'

export default function FolderItem({ folder, index, forceExpanded = false, disableDnd = false }) {
  const {
    toggleExpanded,
    selectedFolderId,
    selectFolder,
    requestDelete,
    requestRename,
    renameTarget,
    finishRename,
    cancelRename,
    addNoteToFolder,
    openContextMenu,
  } = useNotes()

  const isExpanded = forceExpanded || !folder.collapsed
  const isSelected = selectedFolderId === folder.id
  const editing = renameTarget?.type === 'folder' && renameTarget?.id === folder.id
  const [editValue, setEditValue] = useState(folder.name)
  const inputRef = useRef(null)

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
    finishRename(folder.id, editValue)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setEditValue(folder.name)
      cancelRename()
    }
  }

  function handleToggle() {
    if (!forceExpanded) toggleExpanded(folder.id)
    selectFolder(folder.id)
  }

  const headerContent = (
    <div
      className={`group flex items-center gap-1.5 px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
        isSelected
          ? 'text-sidebar-fg bg-white/[0.06] border-l-2 border-accent pl-[10px]'
          : 'text-gray-300 hover:bg-white/[0.04]'
      }`}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle()
        }
        if (!forceExpanded) {
          if (e.key === 'ArrowRight' && !isExpanded) toggleExpanded(folder.id)
          if (e.key === 'ArrowLeft' && isExpanded) toggleExpanded(folder.id)
        }
      }}
    >
      {!forceExpanded && (
        <span
          className={`shrink-0 text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          &#x25B6;
        </span>
      )}
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
      {!editing && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            addNoteToFolder(folder.id)
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-xs text-gray-400 hover:text-accent transition-opacity"
          aria-label={`Add note to ${folder.name}`}
          tabIndex={-1}
        >
          +
        </button>
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
          &#x2715;
        </button>
      )}
    </div>
  )

  if (disableDnd) {
    return (
      <div
        role="treeitem"
        aria-expanded={isExpanded}
        onContextMenu={(e) => openContextMenu(e, { type: 'folder', id: folder.id, name: folder.name })}
      >
        {headerContent}
        {isExpanded && (
          <div
            className="ml-3 pl-2 border-l border-white/10 min-h-[4px]"
            role="group"
            aria-label={`Notes in ${folder.name}`}
          >
            {folder.notes.map((note, i) => (
              <NoteItem key={note.id} note={note} folderId={folder.id} index={i} disableDnd />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Draggable draggableId={folder.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
          className={snapshot.isDragging ? 'opacity-50' : ''}
          role="treeitem"
          aria-expanded={isExpanded}
          onContextMenu={(e) => openContextMenu(e, { type: 'folder', id: folder.id, name: folder.name })}
        >
          <div {...provided.dragHandleProps}>
            {headerContent}
          </div>
          {isExpanded && (
            <Droppable droppableId={folder.id} direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`ml-3 pl-2 border-l border-white/10 min-h-[4px] transition-colors ${
                    snapshot.isDraggingOver ? 'border-accent bg-white/[0.04] rounded' : ''
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
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  )
}
