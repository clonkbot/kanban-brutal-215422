import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";

interface KanbanBoardProps {
  boardId: Id<"boards">;
  onBack: () => void;
}

export function KanbanBoard({ boardId, onBack }: KanbanBoardProps) {
  const board = useQuery(api.boards.get, { id: boardId });
  const columns = useQuery(api.columns.listByBoard, { boardId });
  const tasks = useQuery(api.tasks.listByBoard, { boardId });
  const createTask = useMutation(api.tasks.create);
  const moveTask = useMutation(api.tasks.moveToColumn);
  const createColumn = useMutation(api.columns.create);

  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({});
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [showNewColumnForm, setShowNewColumnForm] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [draggedTask, setDraggedTask] = useState<Id<"tasks"> | null>(null);
  const [editingTask, setEditingTask] = useState<Id<"tasks"> | null>(null);

  const handleAddTask = async (columnId: Id<"columns">) => {
    const title = newTaskTitle[columnId]?.trim();
    if (!title) return;

    await createTask({
      title,
      columnId,
      boardId,
    });
    setNewTaskTitle((prev) => ({ ...prev, [columnId]: "" }));
    setAddingToColumn(null);
  };

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;

    await createColumn({
      boardId,
      name: newColumnName.trim().toUpperCase(),
    });
    setNewColumnName("");
    setShowNewColumnForm(false);
  };

  const handleDragStart = (taskId: Id<"tasks">) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: Id<"columns">) => {
    if (!draggedTask) return;

    const columnTasks = tasks?.filter((t: typeof tasks[number]) => t.columnId === columnId) || [];
    await moveTask({
      id: draggedTask,
      columnId,
      order: columnTasks.length,
    });
    setDraggedTask(null);
  };

  if (!board || !columns || !tasks) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="border-4 border-black p-8 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
            <span className="font-mono text-xl uppercase tracking-widest">LOADING BOARD...</span>
          </div>
        </div>
      </div>
    );
  }

  const getTasksForColumn = (columnId: Id<"columns">) =>
    tasks.filter((task: typeof tasks[number]) => task.columnId === columnId);

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Header */}
      <header className="border-b-8 border-black bg-[#ffff00]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-6">
          <button
            onClick={onBack}
            className="border-4 border-black bg-white px-3 md:px-4 py-2 font-mono text-sm md:text-base uppercase tracking-wider hover:bg-[#f5f5f0] transition-colors self-start"
          >
            ← BACK
          </button>
          <h1 className="font-mono text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter truncate">
            {board.name}
          </h1>
        </div>
      </header>

      {/* Board Content */}
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        <div className="flex gap-4 md:gap-6 pb-4 min-w-max">
          {columns.map((column: typeof columns[number], colIndex: number) => (
            <div
              key={column._id}
              className="w-72 md:w-80 lg:w-96 flex-shrink-0 border-8 border-black bg-white"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column._id)}
            >
              {/* Column Header */}
              <div
                className="border-b-8 border-black p-3 md:p-4"
                style={{
                  backgroundColor: ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#ff00ff", "#00ffff"][colIndex % 6],
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-base md:text-lg font-black uppercase text-black truncate">
                    {column.name}
                  </h3>
                  <span className="font-mono text-xs md:text-sm bg-black text-white px-2 py-1 ml-2 flex-shrink-0">
                    {getTasksForColumn(column._id).length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-3 md:p-4 space-y-3 md:space-y-4 min-h-[200px] bg-[#f5f5f0]">
                {getTasksForColumn(column._id).map((task: ReturnType<typeof getTasksForColumn>[number]) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDragStart={() => handleDragStart(task._id)}
                    onClick={() => setEditingTask(task._id)}
                  />
                ))}

                {/* Add Task Form */}
                {addingToColumn === column._id ? (
                  <div className="border-4 border-black border-dashed p-3 bg-white">
                    <input
                      type="text"
                      value={newTaskTitle[column._id] || ""}
                      onChange={(e) =>
                        setNewTaskTitle((prev) => ({
                          ...prev,
                          [column._id]: e.target.value,
                        }))
                      }
                      placeholder="TASK_TITLE"
                      className="w-full border-2 border-black p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#ffff00] bg-[#f5f5f0]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTask(column._id);
                        if (e.key === "Escape") setAddingToColumn(null);
                      }}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAddTask(column._id)}
                        className="flex-1 border-2 border-black bg-[#00ff00] p-2 font-mono text-xs uppercase hover:bg-[#00cc00] transition-colors"
                      >
                        ADD
                      </button>
                      <button
                        onClick={() => setAddingToColumn(null)}
                        className="flex-1 border-2 border-black bg-white p-2 font-mono text-xs uppercase hover:bg-[#f5f5f0] transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingToColumn(column._id)}
                    className="w-full border-4 border-black border-dashed p-3 md:p-4 font-mono text-sm uppercase hover:bg-white transition-colors"
                  >
                    + ADD TASK
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Column */}
          <div className="w-72 md:w-80 flex-shrink-0">
            {showNewColumnForm ? (
              <form
                onSubmit={handleAddColumn}
                className="border-8 border-black bg-white p-4"
              >
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="COLUMN_NAME"
                  className="w-full border-4 border-black p-3 font-mono text-base focus:outline-none focus:ring-4 focus:ring-[#ffff00] bg-[#f5f5f0] uppercase"
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="flex-1 border-4 border-black bg-[#0000ff] text-white p-3 font-mono text-sm uppercase hover:bg-[#0000cc] transition-colors"
                  >
                    CREATE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewColumnForm(false);
                      setNewColumnName("");
                    }}
                    className="flex-1 border-4 border-black bg-white p-3 font-mono text-sm uppercase hover:bg-[#f5f5f0] transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowNewColumnForm(true)}
                className="w-full border-8 border-black border-dashed p-6 md:p-8 font-mono text-base md:text-lg uppercase hover:bg-white transition-colors bg-transparent"
              >
                + ADD COLUMN
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {editingTask && (
        <TaskModal
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white p-4 text-center">
        <p className="font-mono text-xs text-gray-500">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
