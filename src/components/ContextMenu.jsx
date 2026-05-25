import { useRef, useEffect, useCallback } from 'react'
import { useNotes } from '../context/NotesContext'

export default function ContextMenu() {
  const { contextMenu, closeContextMenu, addNoteToFolder, addRootNote, addFolder, requestRename, requestDelete } = useNotes()

  const menuRef = useRef(null)

  const handleGlobalMouseDown = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      closeContextMenu()
    }
  }, [closeContextMenu])

  useEffect(() => {
    if (!contextMenu) return
    document.addEventListener('mousedown', handleGlobalMouseDown)
    return () => document.removeEventListener('mousedown', handleGlobalMouseDown)
  }, [contextMenu, handleGlobalMouseDown])

  useEffect(() => {
    if (!contextMenu) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeContextMenu()
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const items = menuRef.current?.querySelectorAll('[role="menuitem"]')
        if (!items || items.length === 0) return
        const currentIndex = Array.from(items).indexOf(document.activeElement)
        const nextIndex = e.key === 'ArrowDown'
          ? (currentIndex + 1) % items.length
          : (currentIndex - 1 + items.length) % items.length
        items[nextIndex].focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [contextMenu, closeContextMenu])

  useEffect(() => {
    if (!contextMenu || !menuRef.current) return

    const menu = menuRef.current
    const { offsetWidth, offsetHeight } = menu
    const { innerWidth, innerHeight } = window
    let { x, y } = contextMenu

    if (x + offsetWidth > innerWidth) x = innerWidth - offsetWidth - 8
    if (y + offsetHeight > innerHeight) y = innerHeight - offsetHeight - 8
    if (x < 8) x = 8
    if (y < 8) y = 8

    menu.style.left = `${x}px`
    menu.style.top = `${y}px`
  }, [contextMenu])

  useEffect(() => {
    if (!contextMenu) return
    const savedActive = document.activeElement
    const firstItem = menuRef.current?.querySelector('[role="menuitem"]')
    requestAnimationFrame(() => firstItem?.focus())
    return () => {
      if (savedActive && document.contains(savedActive)) {
        savedActive.focus()
      }
    }
  }, [contextMenu])

  if (!contextMenu) return null

  const { target } = contextMenu

  const folderItems = [
    {
      label: 'Add Note',
      onClick: () => { addNoteToFolder(target.id); closeContextMenu() },
    },
    {
      label: 'Rename',
      onClick: () => { requestRename({ type: 'folder', id: target.id, name: target.name }); closeContextMenu() },
    },
    {
      label: 'Delete',
      onClick: () => { requestDelete({ type: 'folder', id: target.id, name: target.name }); closeContextMenu() },
    },
  ]

  const noteItems = [
    {
      label: 'Rename',
      onClick: () => { requestRename({ type: 'note', id: target.id, name: target.name }); closeContextMenu() },
    },
    {
      label: 'Delete',
      onClick: () => { requestDelete({ type: 'note', id: target.id, name: target.name }); closeContextMenu() },
    },
  ]

  const areaItems = [
    {
      label: 'New Note',
      onClick: () => { addRootNote(); closeContextMenu() },
    },
    {
      label: 'New Folder',
      onClick: () => { addFolder(); closeContextMenu() },
    },
  ]

  const items = target.type === 'folder' ? folderItems
    : target.type === 'note' ? noteItems
    : areaItems

  return (
    <div
      ref={menuRef}
      role="menu"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      className="fixed z-50 bg-[#232544] border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px]"
    >
      {items.map((item, i) => (
        <div
          key={i}
          role="menuitem"
          tabIndex={-1}
          className="px-3 py-1.5 text-sm text-sidebar-fg hover:bg-white/[0.06] cursor-pointer transition-colors flex items-center gap-2"
          onClick={item.onClick}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
