import { useStorage } from './hooks/useStorage'
import { NotesProvider } from './context/NotesContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import EditorArea from './components/EditorArea'
import StatusBar from './components/StatusBar'
import StorageWarning from './components/StorageWarning'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import ContextMenu from './components/ContextMenu'

import { useNotes } from './context/NotesContext'

// Screen-reader live region that announces folder/note create, delete, and
// move actions. Visually hidden — Tailwind sr-only keeps it accessible.
function AriaLive() {
  const { announcement } = useNotes()
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  )
}

export default function App() {
  const { data, updateData, storageUsage, isLow } = useStorage({
    folders: [
      {
        id: 'f1',
        name: 'General',
        collapsed: true,
        notes: [
          {
            id: 'n1',
            name: 'Welcome',
            content: '<h1>Welcome to HaggisNote!</h1><p>Start writing your notes here.</p>',
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
    notes: [],
  })

  return (
    <NotesProvider data={data} updateData={updateData}>
      <div className="h-screen flex flex-col">
        <StorageWarning isLow={isLow} usage={storageUsage} />
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <EditorArea />
        </div>
        <StatusBar />
      </div>
      <DeleteConfirmDialog />
      <ContextMenu />
      <AriaLive />
    </NotesProvider>
  )
}
