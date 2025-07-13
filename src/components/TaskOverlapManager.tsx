import React, { useState, useRef } from "react";
import {
  format,
  isBefore,
  isAfter,
  addDays,
  differenceInCalendarDays,
} from "date-fns";
import { it } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/Task";

interface TaskOverlapManagerProps {
  weekDays: Date[];
  tasks: Task[];
  onTaskDrop: (taskId: string, newStart: Date, newEnd: Date) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskResize?: (taskId: string, newStart: Date, newEnd: Date) => void;
  onEmptyCellClick?: (day: Date) => void;
}

const TaskOverlapManager: React.FC<TaskOverlapManagerProps> = ({
  weekDays,
  tasks,
  onTaskDrop,
  onTaskEdit,
  onTaskDelete,
  onTaskResize,
  onEmptyCellClick,
}) => {
  // Calcola le righe per sovrapposizione
  const rows: Task[][] = [];
  tasks.forEach((task) => {
    let placed = false;
    for (const row of rows) {
      if (!row.some((t) => overlap(task, t))) {
        row.push(task);
        placed = true;
        break;
      }
    }
    if (!placed) rows.push([task]);
  });

  return (
    <div className="absolute inset-0">
      {/* Celle vuote per click */}
      {weekDays.map((day, colIdx) => (
        <div
          key={day.toISOString()}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(colIdx / weekDays.length) * 100}%`,
            width: `${100 / weekDays.length}%`,
            zIndex: 1,
          }}
          onClick={(e) => {
            if (onEmptyCellClick && e.target === e.currentTarget)
              onEmptyCellClick(day);
          }}
        />
      ))}
      {/* Task Bars */}
      {rows.map((row, rowIdx) =>
        row.map((task) => (
          <TaskBar
            key={task.id}
            task={task}
            weekDays={weekDays}
            rowIdx={rowIdx}
            onTaskDrop={onTaskDrop}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onTaskResize={onTaskResize}
          />
        ))
      )}
    </div>
  );
};

function overlap(a: Task, b: Task) {
  return (
    new Date(a.startTime) <= new Date(b.endTime) &&
    new Date(a.endTime) >= new Date(b.startTime)
  );
}

interface TaskBarProps {
  task: Task;
  weekDays: Date[];
  rowIdx: number;
  onTaskDrop: (taskId: string, newStart: Date, newEnd: Date) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskResize?: (taskId: string, newStart: Date, newEnd: Date) => void;
}

const TaskBar: React.FC<TaskBarProps> = ({
  task,
  weekDays,
  rowIdx,
  onTaskDrop,
  onTaskEdit,
  onTaskDelete,
  onTaskResize,
}) => {
  const { setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task, type: "task" },
  });

  // Calcola posizione e larghezza
  const weekStart = weekDays[0];
  const weekEnd = weekDays[weekDays.length - 1];
  const start = isBefore(new Date(task.startTime), weekStart)
    ? weekStart
    : new Date(task.startTime);
  const end = isAfter(new Date(task.endTime), weekEnd)
    ? weekEnd
    : new Date(task.endTime);
  const top = rowIdx * 38;

  // Stati per resize e drag
  const [resizing, setResizing] = useState<null | "left" | "right">(null);
  const [resizePreview, setResizePreview] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [wasResized, setWasResized] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Gestione resize
  const handleResizeStart = (side: "left" | "right", e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(side);
    setResizePreview({
      start: new Date(task.startTime),
      end: new Date(task.endTime),
    });
    setWasResized(false);
  };

  // Gestione drag
  const handleDragStart = (e: React.MouseEvent) => {
    // Solo se non stiamo facendo resize
    if (resizing) return;

    e.stopPropagation();
    setDragging(true);
    setDragPreview({
      start: new Date(task.startTime),
      end: new Date(task.endTime),
    });
    setWasDragged(false);
  };

  // Unico useEffect per gestire tutti i movimenti del mouse
  React.useEffect(() => {
    if (!resizing && !dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return;

      const rect = barRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const dayWidth = rect.width / weekDays.length;
      let dayIdx = Math.floor(x / dayWidth);
      dayIdx = Math.max(0, Math.min(weekDays.length - 1, dayIdx));

      if (resizing) {
        setWasResized(true);
        if (resizing === "left") {
          const newStart = weekDays[dayIdx];
          const currentEnd = new Date(task.endTime);
          // Impedisce resize impossibili (start >= end)
          if (newStart < currentEnd && newStart >= weekStart) {
            setResizePreview((prev) =>
              prev ? { ...prev, start: newStart } : null
            );
          }
        } else {
          const newEnd = addDays(weekDays[dayIdx], 1);
          const currentStart = new Date(task.startTime);
          // Impedisce resize impossibili (end <= start)
          if (newEnd > currentStart && newEnd <= addDays(weekEnd, 1)) {
            setResizePreview((prev) =>
              prev ? { ...prev, end: newEnd } : null
            );
          }
        }
      } else if (dragging) {
        setWasDragged(true);
        const originalStart = new Date(task.startTime);
        const originalStartIdx = differenceInCalendarDays(
          originalStart,
          weekStart
        );
        const offset = dayIdx - originalStartIdx;

        if (offset !== 0) {
          const newStart = addDays(originalStart, offset);
          const newEnd = addDays(new Date(task.endTime), offset);
          setDragPreview({ start: newStart, end: newEnd });
        } else {
          setDragPreview(null);
        }
      }
    };

    const handleMouseUp = () => {
      if (
        resizing &&
        resizePreview &&
        resizePreview.start < resizePreview.end
      ) {
        onTaskResize?.(task.id, resizePreview.start, resizePreview.end);
      } else if (dragging && dragPreview) {
        onTaskDrop(task.id, dragPreview.start, dragPreview.end);
      }

      setResizing(null);
      setDragging(false);
      setResizePreview(null);
      setDragPreview(null);

      // Reset flags dopo un breve delay
      setTimeout(() => {
        setWasResized(false);
        setWasDragged(false);
      }, 100);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    resizing,
    dragging,
    resizePreview,
    dragPreview,
    weekDays,
    task,
    onTaskResize,
    onTaskDrop,
    weekStart,
    weekEnd,
  ]);

  // Calcola la posizione finale (con preview se necessario)
  const finalStart = dragPreview
    ? dragPreview.start
    : resizePreview
    ? resizePreview.start
    : start;
  const finalEnd = dragPreview
    ? dragPreview.end
    : resizePreview
    ? resizePreview.end
    : end;
  const finalStartIdx = differenceInCalendarDays(finalStart, weekStart);
  const finalEndIdx = differenceInCalendarDays(finalEnd, weekStart);
  const finalLeft = (finalStartIdx / weekDays.length) * 100;
  const finalWidth =
    ((finalEndIdx - finalStartIdx + 1) / weekDays.length) * 100;

  // Click handler
  const handleBarClick = (e: React.MouseEvent) => {
    if (!wasResized && !wasDragged && onTaskEdit) {
      e.stopPropagation();
      onTaskEdit(task);
    }
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        barRef.current = el;
      }}
      style={{
        position: "absolute",
        left: `${finalLeft}%`,
        width: `${finalWidth}%`,
        top,
        height: 34,
        zIndex: 10,
        transform: CSS.Transform.toString(transform),
        background: task.color,
        borderRadius: 8,
        boxShadow: resizing
          ? "0 4px 12px 0 rgba(0,0,0,0.15)"
          : "0 2px 8px 0 rgba(0,0,0,0.08)",
        border: resizing ? "2px solid #3b82f6" : "2px solid " + task.color,
        cursor: resizing ? "ew-resize" : dragging ? "grabbing" : "grab",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        opacity: resizing || dragging ? 0.8 : 1,
        transition: resizing || dragging ? "none" : "all 0.15s ease-out",
      }}
      onMouseDown={handleDragStart}
      onClick={handleBarClick}
    >
      {/* Resize left */}
      <div
        ref={resizeRef}
        className={`h-full w-3 cursor-ew-resize transition-all duration-150 ${
          resizing === "left"
            ? "bg-blue-400/60 shadow-inner"
            : "bg-black/10 hover:bg-black/20 hover:w-4"
        }`}
        style={{
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          minWidth: "12px",
        }}
        onMouseDown={(e) => handleResizeStart("left", e)}
      />

      {/* Content */}
      <div className="flex-1 px-2 py-1 text-xs text-white flex flex-col justify-center">
        <div className="font-bold truncate">{task.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="bg-white/20 rounded px-1 text-[10px] font-semibold uppercase tracking-wider">
            {format(new Date(task.startTime), "d MMM", { locale: it })} -{" "}
            {format(new Date(task.endTime), "d MMM", { locale: it })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onTaskEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTaskEdit(task);
            }}
            className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
          >
            <Edit className="w-3 h-3 text-white" />
          </button>
        )}
        {onTaskDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTaskDelete(task.id);
            }}
            className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
          >
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      {/* Resize right */}
      <div
        className={`h-full w-3 cursor-ew-resize transition-all duration-150 ${
          resizing === "right"
            ? "bg-blue-400/60 shadow-inner"
            : "bg-black/10 hover:bg-black/20 hover:w-4"
        }`}
        style={{
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          minWidth: "12px",
        }}
        onMouseDown={(e) => handleResizeStart("right", e)}
      />
    </div>
  );
};

export default TaskOverlapManager;
