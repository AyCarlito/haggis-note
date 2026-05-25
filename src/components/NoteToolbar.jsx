import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { FONT_SIZES } from '../extensions/FontSize'
import { useNotes } from '../context/NotesContext'

const FONT_FAMILIES = ['sans-serif', 'serif', 'monospace', 'Arial', 'Georgia', 'Courier New', 'Times New Roman']

function BoldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  )
}

function ItalicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  )
}

function UnderlineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function NoteToolbar({ editor }) {
  const { allNotes } = useNotes()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [noteSearchQuery, setNoteSearchQuery] = useState('')
  const [noteSearchFocusedIndex, setNoteSearchFocusedIndex] = useState(-1)
  const inputRef = useRef(null)
  const popupRef = useRef(null)
  const noteSearchInputRef = useRef(null)

  const noteSearchResults = useMemo(() => {
    const q = noteSearchQuery.toLowerCase().trim()
    if (!q) return []
    return allNotes
      .filter((n) => n.name.toLowerCase().includes(q))
      .slice(0, 5)
  }, [allNotes, noteSearchQuery])

  const linkedNote = useMemo(() => {
    if (!linkUrl.startsWith('note://')) return null
    const noteId = linkUrl.slice('note://'.length)
    return allNotes.find((n) => n.id === noteId) ?? null
  }, [allNotes, linkUrl])

  const handleGlobalMouseDown = useCallback((e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setShowLinkInput(false)
    }
  }, [])

  useEffect(() => {
    if (showLinkInput) {
      document.addEventListener('mousedown', handleGlobalMouseDown)
      inputRef.current?.focus()
      inputRef.current?.select()
    } else {
      document.removeEventListener('mousedown', handleGlobalMouseDown)
    }
    return () => document.removeEventListener('mousedown', handleGlobalMouseDown)
  }, [showLinkInput, handleGlobalMouseDown])

  if (!editor) return null

  function isActive(name) {
    return editor.isActive(name)
  }

  function attrs(name) {
    return editor.getAttributes(name)
  }

  const hasLink = isActive('link')
  const currentHref = hasLink ? attrs('link').href : ''

  function openLinkInput() {
    setLinkUrl(currentHref || '')
    setNoteSearchQuery('')
    setNoteSearchFocusedIndex(-1)
    setShowLinkInput(true)
  }

  function applyLink() {
    const trimmed = linkUrl.trim()
    if (!trimmed) return
    editor.chain().focus().setLink({ href: trimmed }).run()
    setShowLinkInput(false)
  }

  function selectNoteLink(note) {
    setLinkUrl(`note://${note.id}`)
    setNoteSearchQuery('')
    setNoteSearchFocusedIndex(-1)
    noteSearchInputRef.current?.focus()
  }

  function removeLink() {
    editor.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }

  function cancelLink() {
    setShowLinkInput(false)
  }

  function handleNoteSearchKeyDown(e) {
    if (noteSearchResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setNoteSearchFocusedIndex((prev) =>
        prev < noteSearchResults.length - 1 ? prev + 1 : 0,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setNoteSearchFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : noteSearchResults.length - 1,
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const idx = noteSearchFocusedIndex >= 0 ? noteSearchFocusedIndex : 0
      if (noteSearchResults[idx]) selectNoteLink(noteSearchResults[idx])
    } else if (e.key === 'Escape') {
      cancelLink()
    }
  }

  function handleNoteSearchBlur() {
    setNoteSearchFocusedIndex(-1)
  }

  return (
    <div
      className="relative sticky top-0 z-10 glass p-2 flex gap-1 flex-wrap items-center"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          isActive('bold')
            ? 'bg-accent/20 text-accent'
            : 'text-gray-600 hover:bg-white/40'
        }`}
        aria-label="Bold"
      ><BoldIcon /></button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          isActive('italic')
            ? 'bg-accent/20 text-accent'
            : 'text-gray-600 hover:bg-white/40'
        }`}
        aria-label="Italic"
      ><ItalicIcon /></button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          isActive('underline')
            ? 'bg-accent/20 text-accent'
            : 'text-gray-600 hover:bg-white/40'
        }`}
        aria-label="Underline"
      ><UnderlineIcon /></button>

      <span className="w-px h-5 bg-white/30 mx-1" aria-hidden="true" />

      <select
        value={attrs('textStyle').fontFamily || 'sans-serif'}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="px-1.5 py-1 text-xs border border-white/30 rounded-lg bg-white/60 text-gray-700"
        aria-label="Font family"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>

      <select
        value={attrs('textStyle').fontSize || '16px'}
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className="px-1.5 py-1 text-xs border border-white/30 rounded-lg bg-white/60 text-gray-700"
        aria-label="Font size"
      >
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <span className="w-px h-5 bg-white/30 mx-1" aria-hidden="true" />

      <select
        value={attrs('heading')?.level || 0}
        onChange={(e) => {
          const level = parseInt(e.target.value)
          if (level) editor.chain().focus().toggleHeading({ level }).run()
          else editor.chain().focus().setParagraph().run()
        }}
        className="px-1.5 py-1 text-xs border border-white/30 rounded-lg bg-white/60 text-gray-700"
        aria-label="Heading level"
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
      </select>

      <span className="w-px h-5 bg-white/30 mx-1" aria-hidden="true" />

      <input
        type="color"
        value={attrs('textStyle').color || '#000000'}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-7 h-7 p-0.5 border border-white/30 rounded-lg cursor-pointer bg-white/60"
        aria-label="Text color"
      />

      <button
        onClick={openLinkInput}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          hasLink || showLinkInput
            ? 'bg-accent/20 text-accent'
            : 'text-gray-600 hover:bg-white/40'
        }`}
        aria-label="Insert link"
      ><LinkIcon /></button>

      {showLinkInput && (
        <div
          ref={popupRef}
          className="absolute top-full right-0 max-md:left-2 max-md:right-2 mt-1 z-20 glass p-3 rounded-xl border border-white/20 shadow-xl min-w-[280px] max-md:min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') cancelLink()
            }}
            placeholder="https://example.com"
            className="w-full px-2.5 py-1.5 text-sm border border-white/30 rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none focus:border-accent transition-colors"
          />

          {linkedNote && (
            <div className="mt-1 text-xs text-accent">
              {'\u2192'} {linkedNote.name}
              {linkedNote.folderName && <span className="text-gray-400">{' \u00b7 '}{linkedNote.folderName}</span>}
            </div>
          )}

          <div className="mt-2 border-t border-white/20 pt-2">
            <label className="block text-xs text-gray-500 mb-1">Link to note</label>
            <input
              ref={noteSearchInputRef}
              type="text"
              value={noteSearchQuery}
              onChange={(e) => {
                setNoteSearchQuery(e.target.value)
                setNoteSearchFocusedIndex(-1)
              }}
              onKeyDown={handleNoteSearchKeyDown}
              onBlur={handleNoteSearchBlur}
              placeholder="Search notes..."
              className="w-full px-2.5 py-1.5 text-sm border border-white/30 rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none focus:border-accent transition-colors"
            />
            {noteSearchResults.length > 0 && (
              <div className="mt-1 max-h-40 overflow-y-auto border border-white/20 rounded-lg bg-white/90">
                {noteSearchResults.map((note, i) => (
                  <button
                    key={note.id}
                    onClick={(e) => {
                      e.preventDefault()
                      selectNoteLink(note)
                    }}
                    onMouseEnter={() => setNoteSearchFocusedIndex(i)}
                    className={`w-full text-left px-2.5 py-1.5 text-sm transition-colors ${
                      i === noteSearchFocusedIndex
                        ? 'bg-accent/10 text-accent'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{note.name}</span>
                    <span className="text-gray-400 text-xs ml-1.5">
                      {note.folderName ?? 'Unparented'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={applyLink}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
            >
              Apply
            </button>
            {hasLink && (
              <button
                onClick={removeLink}
                className="px-3 py-1.5 text-sm rounded-lg bg-danger text-white hover:bg-danger-hover transition-colors"
              >
                Remove
              </button>
            )}
            <button
              onClick={cancelLink}
              className="px-3 py-1.5 text-sm rounded-lg border border-white/30 text-gray-600 hover:bg-white/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
