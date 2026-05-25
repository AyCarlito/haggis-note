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
  if (!editor) return null

  function isMarkActive(name) {
    return editor.isActive(name)
  }

  return (
    <div
      className="sticky top-0 z-10 glass p-2 flex gap-1 flex-wrap items-center"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white/40 transition-colors ${isMarkActive('bold') ? 'bg-white/60 text-accent' : ''}`}
        aria-label="Bold"
      ><BoldIcon /></button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white/40 transition-colors ${isMarkActive('italic') ? 'bg-white/60 text-accent' : ''}`}
        aria-label="Italic"
      ><ItalicIcon /></button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white/40 transition-colors ${isMarkActive('underline') ? 'bg-white/60 text-accent' : ''}`}
        aria-label="Underline"
      ><UnderlineIcon /></button>

      <span className="w-px h-5 bg-white/30 mx-1" aria-hidden="true" />

      <select
        value={editor.getAttributes('textStyle').fontFamily || 'sans-serif'}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="px-1.5 py-1 text-xs border border-white/30 rounded-lg bg-white/60 text-gray-700"
        aria-label="Font family"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>

      <select
        value={editor.getAttributes('textStyle').fontSize || '16px'}
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
        value={editor.getAttributes('heading')?.level || 0}
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
        value={editor.getAttributes('textStyle').color || '#000000'}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-7 h-7 p-0.5 border border-white/30 rounded-lg cursor-pointer bg-white/60"
        aria-label="Text color"
      />

      <button
        onClick={() => {
          const url = window.prompt('URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-white/40 transition-colors ${isMarkActive('link') ? 'bg-white/60 text-accent' : ''}`}
        aria-label="Insert link"
      ><LinkIcon /></button>
    </div>
  )
}
