import { useEffect, useRef } from 'react'

export default function HelpDialog({ onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const prev = document.activeElement
    dialogRef.current?.focus()
    return () => prev?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="overlay-blur fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 border border-gray-200 shadow-xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">About HaggisNote</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p>
            HaggisNote saves everything in your browser. Your notes stay on your
            computer - nothing is sent to any server.
          </p>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">How to use</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Create</strong> - Use the + Note / + Folder buttons in the header</li>
              <li><strong>Edit</strong> - Click a note in the sidebar to open it in the editor</li>
              <li><strong>Format</strong> - Use the toolbar above the editor for bold, italic, headings, and more</li>
              <li><strong>Link notes</strong> - Select text, click the link icon, then enter a web address or search for a note to link to</li>
              <li><strong>Drag and drop</strong> - Reorder notes and folders in the sidebar</li>
              <li><strong>Multi-select</strong> - Ctrl+Click to toggle, Shift+Click to select a range</li>
              <li><strong>Search</strong> - Press Ctrl+F to find notes by name</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">Keyboard shortcuts</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Ctrl+F</strong> - Search notes (when no note is focused)</li>
              <li><strong>Ctrl+Shift+&gt;</strong> - Increase font size</li>
              <li><strong>Ctrl+Shift+&lt;</strong> - Decrease font size</li>
              <li><strong>Esc</strong> - Close dialogs / clear search</li>
            </ul>
          </div>

          <p className="text-xs text-gray-400">
            Everything stays in your browser. Clearing your browser data will remove your notes.
          </p>
        </div>
      </div>
    </div>
  )
}
