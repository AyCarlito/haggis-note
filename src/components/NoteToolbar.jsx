import { useState, useRef, useEffect, useCallback } from 'react'
import { FONT_SIZES } from '../extensions/FontSize'

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
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const inputRef = useRef(null)
  const popupRef = useRef(null)

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
    setShowLinkInput(true)
  }

  function applyLink() {
    const trimmed = linkUrl.trim()
    if (trimmed) {
      editor.chain().focus().setLink({ href: trimmed }).run()
    }
    setShowLinkInput(false)
  }

  function removeLink() {
    editor.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }

  function cancelLink() {
    setShowLinkInput(false)
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
          className="absolute top-full right-0 mt-1 z-20 glass p-3 rounded-xl border border-white/20 shadow-xl min-w-[280px]"
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
