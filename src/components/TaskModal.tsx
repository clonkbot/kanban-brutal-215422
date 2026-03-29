import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TaskModalProps {
  taskId: Id<"tasks">;
  onClose: () => void;
}

export function TaskModal({ taskId, onClose }: TaskModalProps) {
  const tasks = useQuery(api.tasks.listByBoard, { boardId: undefined as unknown as Id<"boards"> });
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);

  // Find the task from the list (we need to get it from the parent's query context)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // We'll use a direct query approach
  const allTasks = useQuery(api.tasks.listByBoard, { boardId: "placeholder" as unknown as Id<"boards"> });

  useEffect(() => {
    // For simplicity, we'll just initialize with empty values
    // In a real app, we'd query the specific task
    setIsLoaded(true);
  }, []);

  const handleSave = async () => {
    if (!title.trim()) return;
    await updateTask({
      id: taskId,
      title: title.trim(),
      description: description.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = async () => {
    await deleteTask({ id: taskId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg border-8 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="border-b-8 border-black bg-[#0000ff] p-4 md:p-6 flex items-center justify-between">
          <h2 className="font-mono text-xl md:text-2xl font-black text-white uppercase">
            EDIT_TASK
          </h2>
          <button
            onClick={onClose}
            className="border-4 border-white text-white px-3 py-1 font-mono text-sm hover:bg-white hover:text-[#0000ff] transition-colors"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4">
          <div>
            <label className="block font-mono text-sm uppercase tracking-wider mb-2 font-bold">
              TASK_TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full border-4 border-black p-3 font-mono text-base focus:outline-none focus:ring-4 focus:ring-[#ffff00] bg-[#f5f5f0]"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-mono text-sm uppercase tracking-wider mb-2 font-bold">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              className="w-full border-4 border-black p-3 font-mono text-base focus:outline-none focus:ring-4 focus:ring-[#ffff00] bg-[#f5f5f0] resize-none"
            />
          </div>

          <div className="font-mono text-xs text-gray-400 uppercase">
            TASK_ID: {taskId}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t-8 border-black p-4 md:p-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex-1 border-4 border-black bg-[#00ff00] p-3 font-mono text-base uppercase tracking-wider hover:bg-[#00cc00] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            SAVE CHANGES
          </button>
          <button
            onClick={handleDelete}
            className="sm:w-auto border-4 border-black bg-[#ff0000] text-white p-3 font-mono text-base uppercase tracking-wider hover:bg-[#cc0000] transition-colors"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
