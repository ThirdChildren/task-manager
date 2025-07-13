import React, { useState, useCallback } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  addWeeks,
  subWeeks,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
import { it } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragStartEvent } from "@dnd-kit/core";
import type { Task } from "../types/Task";
import TaskForm from "./TaskForm";
import Sidebar from "./Sidebar";
import TaskOverlapManager from "./TaskOverlapManager";
import { testTasks } from "../data/testTasks";

const DAYS = 7;

const Calendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(testTasks);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [quickCreateData, setQuickCreateData] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [filters, setFilters] = useState<any>({
    priority: [],
    category: [],
    completed: null,
    search: "",
  });

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: DAYS }, (_, i) =>
    addDays(weekStart, i)
  );

  // FILTRI
  const filteredTasks = tasks.filter((task) => {
    // Priorità
    if (filters.priority.length && !filters.priority.includes(task.priority))
      return false;
    // Categoria
    if (
      filters.category.length &&
      (!task.category || !filters.category.includes(task.category))
    )
      return false;
    // Stato
    if (filters.completed !== null && task.completed !== filters.completed)
      return false;
    // Ricerca
    if (
      filters.search &&
      !(
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(filters.search.toLowerCase()))
      )
    )
      return false;
    return true;
  });

  // Trova i task che si sovrappongono a questa settimana
  const getTasksForWeek = useCallback(() => {
    return filteredTasks.filter(
      (task) =>
        isWithinInterval(new Date(task.startTime), {
          start: weekStart,
          end: addDays(weekStart, DAYS - 1),
        }) ||
        isWithinInterval(new Date(task.endTime), {
          start: weekStart,
          end: addDays(weekStart, DAYS - 1),
        }) ||
        (isBefore(new Date(task.startTime), weekStart) &&
          isAfter(new Date(task.endTime), addDays(weekStart, DAYS - 1)))
    );
  }, [filteredTasks, weekStart]);

  // Gestione drag&drop e resize
  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setShowTaskForm(false);
    setQuickCreateData(null);
  };

  const handleUpdateTask = (updatedTask: Omit<Task, "id">) => {
    if (!selectedTask) return;
    const taskWithId: Task = { ...updatedTask, id: selectedTask.id };
    setTasks((prev) =>
      prev.map((task) => (task.id === selectedTask.id ? taskWithId : task))
    );
    setSelectedTask(null);
    setShowTaskForm(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSelectedTask(null);
  };

  const handleTaskDrop = (taskId: string, newStart: Date, newEnd: Date) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, startTime: newStart, endTime: newEnd }
          : task
      )
    );
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const handleDayClick = (day: Date) => {
    // Crea un task di 1 giorno
    setQuickCreateData({ start: day, end: addDays(day, 1) });
    setShowTaskForm(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = () => {
    setActiveTask(null);
    // Gestito in TaskOverlapManager
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <Sidebar
          tasks={tasks}
          onFilterChange={setFilters}
          onTaskSelect={(task) => {
            setSelectedTask(task);
            setShowTaskForm(true);
          }}
        />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateWeek("prev")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {format(weekStart, "d MMM yyyy", { locale: it })} -{" "}
                  {format(addDays(weekStart, 6), "d MMM yyyy", { locale: it })}
                </h1>
                <button
                  onClick={() => navigateWeek("next")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => setShowTaskForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Nuova Attività</span>
              </button>
            </div>
          </div>
          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto p-4 min-w-0 min-h-0">
            <div className="bg-white/90 rounded-2xl shadow-xl border border-white/50 h-full min-h-[400px] flex flex-col">
              {/* Days Header */}
              <div className="flex border-b border-gray-200/50">
                {weekDays.map((day, idx) => (
                  <div
                    key={day.toISOString()}
                    className={`flex-1 min-w-0 text-center py-2 px-1 font-semibold text-sm border-r border-gray-100/60 last:border-r-0 ${
                      isToday(day)
                        ? "bg-blue-600 text-white rounded-t-2xl"
                        : idx === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div>{format(day, "EEE", { locale: it })}</div>
                    <div className="text-lg font-bold">{format(day, "d")}</div>
                  </div>
                ))}
              </div>
              {/* Task Bars */}
              <div className="flex-1 relative">
                <TaskOverlapManager
                  weekDays={weekDays}
                  tasks={getTasksForWeek()}
                  onTaskDrop={handleTaskDrop}
                  onTaskEdit={(task) => {
                    setSelectedTask(task);
                    setShowTaskForm(true);
                  }}
                  onTaskDelete={handleDeleteTask}
                  onTaskResize={handleTaskDrop}
                  onEmptyCellClick={handleDayClick}
                />
              </div>
            </div>
          </div>
        </div>
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
                {format(new Date(activeTask.startTime), "d MMM", {
                  locale: it,
                })}{" "}
                -{" "}
                {format(new Date(activeTask.endTime), "d MMM", { locale: it })}
              </div>
            </div>
          ) : null}
        </DragOverlay>
        {showTaskForm && (
          <TaskForm
            task={selectedTask}
            quickCreateData={
              quickCreateData
                ? {
                    startTime: quickCreateData.start,
                    endTime: quickCreateData.end,
                  }
                : undefined
            }
            onSubmit={selectedTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false);
              setSelectedTask(null);
              setQuickCreateData(null);
            }}
          />
        )}
      </div>
    </DndContext>
  );
};

export default Calendar;
