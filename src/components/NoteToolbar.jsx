const FONT_FAMILIES = ['sans-serif', 'serif', 'monospace', 'Arial', 'Georgia', 'Courier New', 'Times New Roman']
const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']
const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc',
  '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff',
  '#9900ff', '#ff00ff', '#f4cccc', '#d9ead3', '#d0e0f0',
]

export default function NoteToolbar({ editor }) {
  if (!editor) return null

  function isMarkActive(name) {
    return editor.isActive(name)
  }

  return (
    <div
      className="sticky top-0 z-10 border-b border-toolbar-border bg-editor-bg p-2 flex gap-1 flex-wrap items-center"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 text-sm rounded text-gray-700 hover:bg-gray-100 transition-colors ${isMarkActive('bold') ? 'bg-gray-200 font-bold' : ''}`}
        aria-label="Bold"
      >B</button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 text-sm rounded text-gray-700 hover:bg-gray-100 transition-colors italic ${isMarkActive('italic') ? 'bg-gray-200' : ''}`}
        aria-label="Italic"
      >I</button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 text-sm rounded text-gray-700 hover:bg-gray-100 transition-colors underline ${isMarkActive('underline') ? 'bg-gray-200' : ''}`}
        aria-label="Underline"
      >U</button>

      <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />

      <select
        value={editor.getAttributes('textStyle').fontFamily || 'sans-serif'}
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="px-1 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700"
        aria-label="Font family"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>

      <select
        value={editor.getAttributes('textStyle').fontSize || '16px'}
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className="px-1 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700"
        aria-label="Font size"
      >
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />

      <select
        value={editor.getAttributes('heading')?.level || 0}
        onChange={(e) => {
          const level = parseInt(e.target.value)
          if (level) editor.chain().focus().toggleHeading({ level }).run()
          else editor.chain().focus().setParagraph().run()
        }}
        className="px-1 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700"
        aria-label="Heading level"
      >
        <option value={0}>Paragraph</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
      </select>

      <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />

      <input
        type="color"
        value={editor.getAttributes('textStyle').color || '#000000'}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer"
        aria-label="Text color"
      />

      <button
        onClick={() => {
          const url = window.prompt('URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
        className={`px-2 py-1 text-sm rounded text-gray-700 hover:bg-gray-100 transition-colors ${isMarkActive('link') ? 'bg-gray-200' : ''}`}
        aria-label="Insert link"
      >🔗</button>
    </div>
  )
}
