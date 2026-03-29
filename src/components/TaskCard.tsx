import { Doc } from "../../convex/_generated/dataModel";

interface TaskCardProps {
  task: Doc<"tasks">;
  onDragStart: () => void;
  onClick: () => void;
}

export function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="border-4 border-black bg-white p-3 md:p-4 cursor-grab active:cursor-grabbing hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
    >
      <h4 className="font-mono text-sm md:text-base font-bold uppercase break-words">
        {task.title}
      </h4>
      {task.description && (
        <p className="font-mono text-xs mt-2 text-gray-600 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[10px] md:text-xs text-gray-400 uppercase">
          #{task._id.slice(-6)}
        </span>
        <span className="font-mono text-[10px] md:text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          [DRAG TO MOVE]
        </span>
      </div>
    </div>
  );
}
