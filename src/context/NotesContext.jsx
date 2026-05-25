import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'

const NotesContext = createContext(null)

let idCounter = Date.now()
function uid() {
  return (++idCounter).toString(36)
}

export function NotesProvider({ children, data, updateData }) {
  const folders = data?.folders ?? []

  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [renameTarget, setRenameTarget] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const announceTimerRef = useRef(null)

  const announce = useCallback((msg) => {
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    setAnnouncement(msg)
    announceTimerRef.current = setTimeout(() => setAnnouncement(''), 3000)
  }, [])

  const selectedNote = useMemo(() => {
    if (!selectedFolderId || !selectedNoteId) return null
    const folder = folders.find((f) => f.id === selectedFolderId)
    if (!folder) return null
    return folder.notes.find((n) => n.id === selectedNoteId) ?? null
  }, [folders, selectedFolderId, selectedNoteId])

  const selectFolder = useCallback((folderId) => {
    setSelectedFolderId(folderId)
    setSelectedNoteId(null)
  }, [])

  const selectNote = useCallback((folderId, noteId) => {
    setSelectedFolderId(folderId)
    setSelectedNoteId(noteId)
  }, [])

  const toggleExpanded = useCallback((folderId) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) =>
        f.id === folderId ? { ...f, collapsed: !f.collapsed } : f,
      ),
    }))
  }, [updateData])

  const addFolder = useCallback(() => {
    const name = prompt('Folder name:')
    if (!name || !name.trim()) return
    const folder = { id: uid(), name: name.trim(), collapsed: true, notes: [] }
    updateData((prev) => ({ ...prev, folders: [...prev.folders, folder] }))
    announce(`Created folder "${folder.name}"`)
  }, [updateData, announce])

  const renameFolder = useCallback((folderId, name) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => (f.id === folderId ? { ...f, name } : f)),
    }))
  }, [updateData])

  const addNote = useCallback(() => {
    const targetId = selectedFolderId || folders[0]?.id
    if (!targetId) return
    updateData((prev) => {
      const now = new Date().toISOString()
      const note = { id: uid(), name: 'Untitled', content: '', updatedAt: now }
      return {
        ...prev,
        folders: prev.folders.map((f) =>
          f.id === targetId ? { ...f, notes: [...f.notes, note] } : f,
        ),
      }
    })
    announce('Created note "Untitled"')
  }, [updateData, selectedFolderId, folders, announce])

  const renameNote = useCallback((noteId, name) => {
    updateData((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => ({
        ...f,
        notes: f.notes.map((n) => (n.id === noteId ? { ...n, name } : n)),
      })),
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
    }))
    setSelectedNoteId((current) => (current === noteId ? null : current))
    setDeleteTarget(null)
  }, [updateData])

  const moveNote = useCallback(
    (noteId, sourceFolderId, destFolderId, sourceIdx, destIdx) => {
      const srcFolder = folders.find((f) => f.id === sourceFolderId)
      const noteName = srcFolder?.notes.find((n) => n.id === noteId)?.name
      const destName = folders.find((f) => f.id === destFolderId)?.name

      updateData((prev) => {
        const folders = prev.folders.map((f) => ({ ...f, notes: [...f.notes] }))
        const srcFolder = folders.find((f) => f.id === sourceFolderId)
        const dstFolder = folders.find((f) => f.id === destFolderId)
        if (!srcFolder || !dstFolder) return prev
        const [note] = srcFolder.notes.splice(sourceIdx, 1)
        dstFolder.notes.splice(destIdx, 0, note)
        return { ...prev, folders }
      })

      if (noteName && destName) {
        announce(`Moved "${noteName}" to ${destName}`)
      }
    },
    [updateData, folders, announce],
  )

  const requestDelete = useCallback((target) => {
    setDeleteTarget(target)
  }, [])

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null)
  }, [])

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

  const firstFolderId = folders[0]?.id ?? null

  const value = useMemo(
    () => ({
      folders,
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
      renameNote,
      updateNoteContent,
      deleteFolder,
      deleteNote,
      moveNote,
      requestDelete,
      cancelDelete,
      confirmDelete,
      requestRename,
      finishRename,
      cancelRename,
    }),
    [
      folders,
      selectedFolderId,
      selectedNoteId,
      selectedNote,
      announcement,
      deleteTarget,
      renameTarget,
      firstFolderId,
    ],
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
