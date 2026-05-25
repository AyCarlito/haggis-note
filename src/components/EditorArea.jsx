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
        class: 'flex-1 p-4 w-full outline-none text-gray-900 prose prose-sm',
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
      <main className="flex-1 flex items-center justify-center bg-editor-bg text-gray-400">
        <div className="text-center">
          <p className="text-lg">Select a note to start editing</p>
          <p className="text-sm mt-1">Use the sidebar to browse your folders and notes.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col bg-editor-bg overflow-hidden">
      <NoteToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </main>
  )
}
