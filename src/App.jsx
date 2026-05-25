import { useState, useEffect } from 'react'
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const toggleSidebar = () => setSidebarOpen((v) => !v)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && sidebarOpen && window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  return (
    <NotesProvider data={data} updateData={updateData}>
      <div className="h-screen flex flex-col">
        <StorageWarning isLow={isLow} usage={storageUsage} />
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1 overflow-hidden">
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`fixed inset-y-0 left-0 z-30 w-72 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:z-auto md:translate-x-0 ${sidebarOpen ? '' : 'md:w-0 md:overflow-hidden'}`}>
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <EditorArea />
          </div>
        </div>
        <StatusBar />
      </div>
      <DeleteConfirmDialog />
      <ContextMenu />
      <AriaLive />
    </NotesProvider>
  )
}
