import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import { FontSize } from '../extensions/FontSize'
import { useNotes } from '../context/NotesContext'
import NoteToolbar from './NoteToolbar'

export default function EditorArea() {
  const { selectedNote, updateNoteContent, selectedNoteId } = useNotes()
  const prevNoteIdRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: { depth: 100 },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: selectedNote?.content || '',
    editorProps: {
      attributes: {
        class: 'flex-1 p-4 w-full outline-none text-gray-900 bg-white',
      },
    },
    onUpdate: ({ editor }) => {
      if (selectedNoteId) {
        updateNoteContent(selectedNoteId, editor.getHTML())
      }
    },
  })

  useEffect(() => {
    if (editor && selectedNote) {
      if (prevNoteIdRef.current !== selectedNote.id) {
        prevNoteIdRef.current = selectedNote.id
        editor.commands.setContent(selectedNote.content || '', false)
      }
    }
  }, [editor, selectedNote])

  if (!selectedNote) {
    return (
      <main className="flex-1 flex items-center justify-center bg-editor-bg editor-grid text-gray-400">
        <div className="text-center glass rounded-xl px-10 py-12 border border-white/30 shadow-sm">
          <svg className="mx-auto mb-4 text-gray-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="text-lg font-medium text-gray-600">Select a note to start editing</p>
          <p className="text-sm mt-1 text-gray-400">Choose a note from the sidebar, or create a new one.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col bg-editor-bg editor-grid overflow-hidden">
      <NoteToolbar editor={editor} />
      {/* Flex chain cascades height so .ProseMirror fills full editor area.
           Without this the contenteditable div only matches content height,
           making empty space below text unclickable. */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <EditorContent editor={editor} className="flex-1 flex flex-col" />
      </div>
    </main>
  )
}
