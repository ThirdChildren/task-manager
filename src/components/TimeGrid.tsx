import React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/Task";

interface TimeGridProps {
  day: Date;
  hour: number;
  tasks: Task[];
  onTaskDrop: (taskId: string, newStartTime: Date, newEndTime: Date) => void;
}

const TimeGrid: React.FC<TimeGridProps> = ({ day, hour, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `time-slot-${day.toISOString()}-${hour}`,
    data: {
      day,
      hour,
      type: "time-slot",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-16 border-b border-gray-100 relative ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="absolute left-1 right-1 rounded-lg border-2 shadow-sm"
          style={{
            backgroundColor: task.color,
            borderColor: task.color,
            top: `${index * 20}px`,
            height: "60px",
            zIndex: index + 1,
          }}
        >
          <div className="p-2 text-white text-xs">
            <div className="font-medium truncate">{task.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeGrid;
