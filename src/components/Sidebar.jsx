import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useNotes } from '../context/NotesContext'
import FolderItem from './FolderItem'

export default function Sidebar() {
  const { folders, moveNote, moveFolder } = useNotes()

  function handleDragEnd(result) {
    const { source, destination, draggableId, type } = result
    if (!destination) return
    if (source.index === destination.index && source.droppableId === destination.droppableId) return

    if (type === 'FOLDER') {
      moveFolder(draggableId, source.index, destination.index)
    } else {
      moveNote(draggableId, source.droppableId, destination.droppableId, source.index, destination.index)
    }
  }

  return (
    <aside
      className="w-64 shrink-0 h-full bg-sidebar-bg text-sidebar-fg border-r border-sidebar-border flex flex-col overflow-hidden"
      role="tree"
      aria-label="Folders and notes"
    >
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          {folders.length === 0 ? (
            <p className="text-sm text-gray-500 px-2 py-4 text-center">
              No folders yet. Click "+ Folder" to begin.
            </p>
          ) : (
            <Droppable droppableId="folders" type="FOLDER">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-1 ${snapshot.isDraggingOver ? 'bg-gray-800 rounded' : ''}`}
                >
                  {folders.map((folder, i) => (
                    <FolderItem key={folder.id} folder={folder} index={i} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </DragDropContext>
      </div>
    </aside>
  )
}
