import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useNotes } from '../context/NotesContext'
import FolderItem from './FolderItem'

export default function Sidebar() {
  const { folders, moveNote, moveFolder } = useNotes()

  // Dispatches to moveFolder or moveNote based on the DnD type. The folder
  // list Droppable uses type="FOLDER" to keep folder drags isolated from note
  // drags — notes live in DEFAULT-type Droppables inside each folder.
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
      className="w-72 shrink-0 h-full bg-gradient-to-b from-[#232544] to-[#2a2b4e] text-sidebar-fg border-r border-sidebar-border flex flex-col overflow-hidden"
      role="tree"
      aria-label="Folders and notes"
    >
      <div className="flex-1 overflow-y-auto px-2 py-2 sidebar-scroll">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* type="FOLDER" isolates folder drags from note drags
               (notes use the default type in per-folder Droppables). */}
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
