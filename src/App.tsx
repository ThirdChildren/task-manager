import React from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragStartEvent } from "@dnd-kit/core";
import Calendar from "./components/Calendar";
import type { Task } from "./types/Task";

function App() {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = () => {
    setActiveTask(null);
    // Handle drag end logic here if needed
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Calendar />
      <DragOverlay>
        {activeTask ? (
          <div
            className="bg-white rounded-lg border-2 shadow-lg p-3 opacity-80"
            style={{
              backgroundColor: activeTask.color,
              borderColor: activeTask.color,
              color: "white",
              width: "200px",
            }}
          >
            <div className="font-medium">{activeTask.title}</div>
            <div className="text-sm opacity-90">
              {activeTask.startTime.toLocaleTimeString()} -{" "}
              {activeTask.endTime.toLocaleTimeString()}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
