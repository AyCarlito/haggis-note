import { useState, useMemo, useEffect } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useNotes } from '../context/NotesContext'
import FolderItem from './FolderItem'
import NoteItem from './NoteItem'
import SearchBar from './SearchBar'
import SearchNoteItem from './SearchNoteItem'

export default function Sidebar() {
  const { folders, rootNotes, moveNote, moveFolder, selectNote, selectFolder, selectedNoteId, openContextMenu } = useNotes()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchNoteFolderId, setSearchNoteFolderId] = useState(null)

  const isSearchActive = searchQuery.trim().length > 0

  const { filteredFolders, filteredNotes } = useMemo(() => {
    if (!isSearchActive) return { filteredFolders: folders, filteredNotes: [] }

    const q = searchQuery.toLowerCase().trim()
    const fFolders = []
    const fNotes = []

    for (const note of rootNotes) {
      if (note.name.toLowerCase().includes(q)) {
        fNotes.push({ note, parentFolderId: null })
      }
    }

    for (const folder of folders) {
      const folderNameMatch = folder.name.toLowerCase().includes(q)

      if (folderNameMatch) {
        fFolders.push({ ...folder, collapsed: false })
      } else if (searchNoteFolderId === folder.id) {
        fFolders.push({ ...folder, collapsed: false })
      } else {
        const matchedNotes = folder.notes.filter((n) =>
          n.name.toLowerCase().includes(q),
        )
        for (const note of matchedNotes) {
          fNotes.push({ note, parentFolderId: folder.id })
        }
      }
    }

    return { filteredFolders: fFolders, filteredNotes: fNotes }
  }, [folders, rootNotes, searchQuery, searchNoteFolderId, isSearchActive])

  function handleClearSearch() {
    setSearchQuery('')
    setSearchNoteFolderId(null)
  }

  function handleSelectSearchNote(folderId, noteId) {
    selectNote(folderId, noteId)
    setSearchNoteFolderId(folderId)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !selectedNoteId) {
        e.preventDefault()
        document.querySelector('[data-search-input]')?.focus()
      }
      if (e.key === 'Escape' && isSearchActive) {
        handleClearSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchActive, selectedNoteId])

  function handleDragEnd(result) {
    const { source, destination, draggableId, type } = result
    if (!destination) return
    if (source.index === destination.index && source.droppableId === destination.droppableId) return

    if (type === 'FOLDER') {
      moveFolder(draggableId, source.index, destination.index)
    } else {
      moveNote(draggableId, source.droppableId, destination.droppableId, source.index, destination.index)
    }
  }

  return (
    <aside
      className="w-72 shrink-0 h-full bg-gradient-to-b from-[#232544] to-[#2a2b4e] text-sidebar-fg border-r border-sidebar-border flex flex-col overflow-hidden"
      role="tree"
      aria-label="Folders and notes"
    >
      <SearchBar query={searchQuery} onChange={setSearchQuery} onClear={handleClearSearch} />

      <div
        className="flex-1 overflow-y-auto px-2 pb-2 sidebar-scroll"
        onClick={(e) => { if (e.target === e.currentTarget) selectFolder(null) }}
        onContextMenu={(e) => openContextMenu(e, { type: 'area' })}
      >
        {isSearchActive ? (
          filteredFolders.length === 0 && filteredNotes.length === 0 ? (
            <p className="text-sm text-gray-500 px-2 py-4 text-center">
              No results found.
            </p>
          ) : (
            <>
              {filteredFolders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  index={0}
                  forceExpanded
                  disableDnd
                />
              ))}
              {filteredNotes.map(({ note, parentFolderId }) => (
                <SearchNoteItem
                  key={note.id}
                  note={note}
                  folderId={parentFolderId}
                  onClick={() => handleSelectSearchNote(parentFolderId, note.id)}
                />
              ))}
            </>
          )
        ) : (
          <>
            {folders.length === 0 && rootNotes.length === 0 ? (
              <p className="text-sm text-gray-500 px-2 py-4 text-center">
                No folders yet. Click &quot;+ Folder&quot; to begin.
              </p>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                {rootNotes.length > 0 && (
                  <div className="mb-3">
                    <div className="px-3 py-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Unparented
                    </div>
                    <Droppable droppableId="__root__">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[4px] transition-colors ${
                            snapshot.isDraggingOver ? 'bg-white/[0.04] rounded' : ''
                          }`}
                        >
                          {rootNotes.map((note, i) => (
                            <NoteItem key={note.id} note={note} folderId={null} index={i} />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
                {folders.length > 0 && (
                  <Droppable droppableId="folders" type="FOLDER">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-1 ${snapshot.isDraggingOver ? 'bg-gray-800 rounded' : ''}`}
                      >
                        {folders.map((folder, i) => (
                          <FolderItem key={folder.id} folder={folder} index={i} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </DragDropContext>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
