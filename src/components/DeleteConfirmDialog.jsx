import { useEffect, useRef } from 'react'
import { useNotes } from '../context/NotesContext'

export default function DeleteConfirmDialog() {
  const { deleteTarget, cancelDelete, confirmDelete } = useNotes()
  const confirmRef = useRef(null)
  const prevFocusRef = useRef(null)

  // Captures the previously focused element when the dialog opens and restores
  // focus when it closes, so keyboard/screen-reader users don't lose their
  // place in the sidebar.
  useEffect(() => {
    if (deleteTarget) {
      prevFocusRef.current = document.activeElement
      confirmRef.current?.focus()
    } else if (prevFocusRef.current) {
      prevFocusRef.current.focus()
      prevFocusRef.current = null
    }
  }, [deleteTarget])

  useEffect(() => {
    if (!deleteTarget) return
    function onKey(e) {
      if (e.key === 'Escape') cancelDelete()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [deleteTarget, cancelDelete])

  if (!deleteTarget) return null

  const label =
    deleteTarget.type === 'folder'
      ? `Delete folder "${deleteTarget.name}" and all its notes?`
      : `Delete note "${deleteTarget.name}"?`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overlay-blur"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm deletion"
      onClick={cancelDelete}
    >
      <div
        className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 mx-4 max-w-sm w-full border border-white/30"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-gray-800 mb-5">{label}</p>
        <p className="text-xs text-gray-500 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelDelete}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={confirmDelete}
            className="px-4 py-2 text-sm rounded-lg bg-danger text-white hover:bg-danger-hover transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
