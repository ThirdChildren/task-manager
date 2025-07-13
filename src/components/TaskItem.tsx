import React, { useState, useRef } from "react";
import { format, differenceInMinutes } from "date-fns";
import { it } from "date-fns/locale";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/Task";

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDrop: (taskId: string, newStartTime: Date, newEndTime: Date) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onDrop,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{
    y: number;
    startTime: Date;
  } | null>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
      type: "task",
    },
  });

  const duration = differenceInMinutes(
    new Date(task.endTime),
    new Date(task.startTime)
  );
  const height = Math.max(30, (duration / 60) * 64); // 64px per ora

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      y: e.clientY,
      startTime: new Date(task.startTime),
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !resizeStart) return;

    const deltaY = e.clientY - resizeStart.y;
    const deltaMinutes = Math.round(deltaY / (64 / 60)); // 64px per ora

    const newStartTime = new Date(resizeStart.startTime);
    newStartTime.setMinutes(newStartTime.getMinutes() + deltaMinutes);

    const newEndTime = new Date(task.endTime);
    newEndTime.setMinutes(newEndTime.getMinutes() + deltaMinutes);

    if (newStartTime < newEndTime) {
      onDrop(task.id, newStartTime, newEndTime);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeStart(null);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, resizeStart]);

  const priorityColors = {
    low: "bg-green-100 border-green-300 text-green-800",
    medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
    high: "bg-red-100 border-red-300 text-red-800",
  };

  const style = {
    height: `${height}px`,
    transform: CSS.Transform.toString(transform),
    backgroundColor: task.color,
    borderColor: task.color,
    opacity: task.completed ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute left-1 right-1 rounded-lg border-2 cursor-move shadow-sm hover:shadow-md transition-all duration-200 ${
        task.completed ? "line-through" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-black bg-opacity-10 rounded-b-lg"
        onMouseDown={handleResizeStart}
      />

      {/* Drag Handle */}
      <div className="absolute top-1 left-1 text-white opacity-70">
        <GripVertical className="w-3 h-3" />
      </div>

      {/* Task Content */}
      <div className="p-2 text-white text-xs">
        <div className="font-medium truncate">{task.title}</div>
        <div className="text-xs opacity-90">
          {format(new Date(task.startTime), "HH:mm", { locale: it })} -
          {format(new Date(task.endTime), "HH:mm", { locale: it })}
        </div>
        {task.description && (
          <div className="text-xs opacity-75 truncate mt-1">
            {task.description}
          </div>
        )}
      </div>

      {/* Priority Badge */}
      <div
        className={`absolute top-1 right-1 px-1 py-0.5 rounded text-xs font-medium ${
          priorityColors[task.priority]
        }`}
      >
        {task.priority}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-6 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
        >
          <Edit className="w-3 h-3 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors ml-1"
        >
          <Trash2 className="w-3 h-3 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
