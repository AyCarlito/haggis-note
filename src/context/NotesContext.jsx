import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'

const NotesContext = createContext(null)

let idCounter = Date.now()
function uid() {
  return (++idCounter).toString(36)
}

export function NotesProvider({ children, data, updateData }) {
  const folders = useMemo(() => data?.folders ?? [], [data])
  const rootNotes = useMemo(() => data?.notes ?? [], [data])

  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [renameTarget, setRenameTarget] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)

  // Holds the current screen-reader announcement string. Cleared after 3s so
  // repeated identical announcements re-trigger the aria-live region in App.jsx.
  const [announcement, setAnnouncement] = useState('')
  const announceTimerRef = useRef(null)

  // Sets announcement and schedules a clear so a new message always differs
  // from the previous one, forcing screen-reader re-announcement.
  const announce = useCallback((msg) => {
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    setAnnouncement(msg)
    announceTimerRef.current = setTimeout(() => setAnnouncement(''), 3000)
  }, [])

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null
    if (selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId)
      if (!folder) return null
      return folder.notes.find((n) => n.id === selectedNoteId) ?? null
    }
    return rootNotes.find((n) => n.id === selectedNoteId) ?? null
  }, [folders, rootNotes, selectedFolderId, selectedNoteId])

  const selectFolder = useCallback((folderId) => {
    setSelectedFolderId(folderId)
    setSelectedNoteId(null)
  }, [])

  const selectNote = useCallback((folderId, noteId) => {
    setSelectedFolderId(folderId)
    setSelectedNoteId(noteId)
  }, [])

  // Persists folder collapse state in localStorage (via updateData) so
  // expanded/collapsed survives page reloads. Previously this used an
  // in-memory Set that reset on every load.
  const toggleExpanded = useCallback((folderId) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) =>
        f.id === folderId ? { ...f, collapsed: !f.collapsed } : f,
      ),
    }))
  }, [updateData])

  // Creates a folder named "Untitled" without prompting, matching the new-note
  // behaviour so both buttons feel consistent. Rename via double-click.
  const addFolder = useCallback(() => {
    const folder = { id: uid(), name: 'Untitled', collapsed: true, notes: [] }
    updateData((prev) => ({ ...prev, folders: [...prev.folders, folder] }))
    announce('Created folder "Untitled"')
  }, [updateData, announce])

  const renameFolder = useCallback((folderId, name) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => (f.id === folderId ? { ...f, name } : f)),
    }))
  }, [updateData])

  // Creates a new "Untitled" note in the given folder. Exists as a separate
  // action from addNote so the sidebar per-folder "+" button can target a
  // specific folder without changing the global selection.
  const addNoteToFolder = useCallback((folderId) => {
    updateData((prev) => {
      const now = new Date().toISOString()
      const note = { id: uid(), name: 'Untitled', content: '', updatedAt: now }
      return {
        ...prev,
        folders: prev.folders.map((f) =>
          f.id === folderId ? { ...f, notes: [...f.notes, note] } : f,
        ),
      }
    })
    announce('Created note "Untitled"')
  }, [updateData, announce])

  const addRootNote = useCallback(() => {
    const now = new Date().toISOString()
    const note = { id: uid(), name: 'Untitled', content: '', updatedAt: now }
    updateData((prev) => ({
      ...prev,
      notes: [...(prev.notes ?? []), note],
    }))
    announce('Created note "Untitled"')
  }, [updateData, announce])

  // Default add-note entry point used by the header button. Targets the
  // currently selected folder, or creates an unparented note.
  const addNote = useCallback(() => {
    if (selectedFolderId) {
      addNoteToFolder(selectedFolderId)
    } else {
      addRootNote()
    }
  }, [selectedFolderId, addNoteToFolder, addRootNote])

  const renameNote = useCallback((noteId, name) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => ({
        ...f,
        notes: f.notes.map((n) => (n.id === noteId ? { ...n, name } : n)),
      })),
      notes: (prev.notes ?? []).map((n) =>
        n.id === noteId ? { ...n, name } : n,
      ),
    }))
  }, [updateData])

  const updateNoteContent = useCallback((noteId, content) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => ({
        ...f,
        notes: f.notes.map((n) =>
          n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n,
        ),
      })),
      notes: (prev.notes ?? []).map((n) =>
        n.id === noteId ? { ...n, content, updatedAt: new Date().toISOString() } : n,
      ),
    }))
  }, [updateData])

  const deleteFolder = useCallback((folderId) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.filter((f) => f.id !== folderId),
    }))
    setSelectedFolderId((current) => (current === folderId ? null : current))
    setDeleteTarget(null)
  }, [updateData])

  const deleteNote = useCallback((noteId) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => ({
        ...f,
        notes: f.notes.filter((n) => n.id !== noteId),
      })),
      notes: (prev.notes ?? []).filter((n) => n.id !== noteId),
    }))
    setSelectedNoteId((current) => (current === noteId ? null : current))
    setDeleteTarget(null)
  }, [updateData])

  const ROOT_NOTES_ID = '__root__'

  const moveNote = useCallback(
    (noteId, sourceFolderId, destFolderId, sourceIdx, destIdx) => {
      const srcIsRoot = sourceFolderId === ROOT_NOTES_ID
      const dstIsRoot = destFolderId === ROOT_NOTES_ID

      let noteName
      if (srcIsRoot) {
        noteName = rootNotes.find((n) => n.id === noteId)?.name
      } else {
        const srcFolder = folders.find((f) => f.id === sourceFolderId)
        noteName = srcFolder?.notes.find((n) => n.id === noteId)?.name
      }

      let destName
      if (dstIsRoot) {
        destName = 'Unparented'
      } else {
        const dstFolder = folders.find((f) => f.id === destFolderId)
        destName = dstFolder?.name
      }

      updateData((prev) => {
        const folders = prev.folders.map((f) => ({ ...f, notes: [...f.notes] }))
        const rootNotes = [...(prev.notes ?? [])]

        let note
        if (srcIsRoot) {
          ;[note] = rootNotes.splice(sourceIdx, 1)
        } else {
          const srcFolder = folders.find((f) => f.id === sourceFolderId)
          if (!srcFolder) return prev
          ;[note] = srcFolder.notes.splice(sourceIdx, 1)
        }

        if (dstIsRoot) {
          rootNotes.splice(destIdx, 0, note)
        } else {
          const dstFolder = folders.find((f) => f.id === destFolderId)
          if (!dstFolder) return prev
          dstFolder.notes.splice(destIdx, 0, note)
        }

        return { ...prev, folders, notes: rootNotes }
      })

      if (noteName && destName) {
        announce(`Moved "${noteName}" to ${destName}`)
      }
    },
    [updateData, folders, rootNotes, announce],
  )

  // Reorders the folders array for folder drag-and-drop in the sidebar.
  // Separate from moveNote because folders have no nested structure to
  // transfer between — just a position swap within a single flat list.
  const moveFolder = useCallback((folderId, sourceIdx, destIdx) => {
    const folder = folders.find((f) => f.id === folderId)
    updateData((prev) => {
      const newFolders = [...prev.folders]
      const [f] = newFolders.splice(sourceIdx, 1)
      newFolders.splice(destIdx, 0, f)
      return { ...prev, folders: newFolders }
    })
    if (folder) announce(`Moved folder "${folder.name}"`)
  }, [updateData, folders, announce])

  const requestDelete = useCallback((target) => {
    setDeleteTarget(target)
  }, [])

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  // Announces the deletion result so screen-reader users get feedback after
  // confirming the dialog. The announce call runs after the delete callback so
  // deleteTarget.name is still in the closure (setDeleteTarget runs async).
  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'folder') deleteFolder(deleteTarget.id)
    else deleteNote(deleteTarget.id)
    announce(`Deleted ${deleteTarget.type} "${deleteTarget.name}"`)
  }, [deleteTarget, deleteFolder, deleteNote, announce])

  const requestRename = useCallback((target) => {
    setRenameTarget(target)
  }, [])

  const finishRename = useCallback((id, name) => {
    if (!name || !name.trim()) {
      setRenameTarget(null)
      return
    }
    if (renameTarget.type === 'folder') renameFolder(id, name.trim())
    else renameNote(id, name.trim())
    setRenameTarget(null)
  }, [renameTarget, renameFolder, renameNote])

  const cancelRename = useCallback(() => {
    setRenameTarget(null)
  }, [])

  const openContextMenu = useCallback((e, target) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, target })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  const firstFolderId = folders[0]?.id ?? null

  // Callbacks intentionally omitted from deps per React convention (stable via useCallback)
  /* eslint-disable react-hooks/exhaustive-deps */
  const value = useMemo(
    () => ({
      folders,
      rootNotes,
      selectedFolderId,
      selectedNoteId,
      selectedNote,
      announcement,
      deleteTarget,
      renameTarget,
      firstFolderId,
      selectFolder,
      selectNote,
      toggleExpanded,
      addFolder,
      renameFolder,
      addNote,
      addNoteToFolder,
      addRootNote,
      renameNote,
      updateNoteContent,
      deleteFolder,
      deleteNote,
      moveNote,
      moveFolder,
      requestDelete,
      cancelDelete,
      confirmDelete,
      requestRename,
      finishRename,
      cancelRename,
      contextMenu,
      openContextMenu,
      closeContextMenu,
    }),
    [
      folders,
      rootNotes,
      selectedFolderId,
      selectedNoteId,
      selectedNote,
      announcement,
      deleteTarget,
      renameTarget,
      firstFolderId,
      contextMenu,
    ],
  )
  /* eslint-enable react-hooks/exhaustive-deps */

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
