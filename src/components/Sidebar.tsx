import React, { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Tag,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Task } from "../types/Task";

interface SidebarProps {
  tasks: Task[];
  onFilterChange: (filters: FilterState) => void;
  onTaskSelect: (task: Task) => void;
}

interface FilterState {
  priority: string[];
  category: string[];
  completed: boolean | null;
  search: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  onFilterChange,
  onTaskSelect,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    category: [],
    completed: null,
    search: "",
  });

  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    priority: true,
    category: true,
    status: true,
  });

  const priorities = ["low", "medium", "high"];
  const categories = Array.from(
    new Set(
      tasks
        .map((task) => task.category)
        .filter((category): category is string => Boolean(category))
    )
  );

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const togglePriority = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    handleFilterChange({ priority: newPriorities });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    handleFilterChange({ category: newCategories });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priority: [],
      category: [],
      completed: null,
      search: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(
      (task) => task.priority === "high" && !task.completed
    ).length;

    return { total, completed, pending, highPriority };
  };

  const stats = getTaskStats();
  const activeFiltersCount =
    filters.priority.length +
    filters.category.length +
    (filters.completed !== null ? 1 : 0) +
    (filters.search ? 1 : 0);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm border-r border-gray-200/50 transition-all duration-300 flex flex-col ${
        isOpen ? "w-80" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2
            className={`font-bold text-gray-900 ${isOpen ? "block" : "hidden"}`}
          >
            Task Manager
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Statistics Cards */}
          <div className="p-4 border-b border-gray-200/50 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-xs text-blue-700">Totali</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </div>
                <div className="text-xs text-green-700">Completati</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <div className="text-xs text-yellow-700">In attesa</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {stats.highPriority}
                </div>
                <div className="text-xs text-red-700">Alta priorità</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200/50 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca task..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="p-4 border-b border-gray-200/50 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Filtri attivi
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Cancella tutto
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.priority.map((priority) => (
                  <span
                    key={priority}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      priority
                    )}`}
                  >
                    {priority}
                    <button
                      onClick={() => togglePriority(priority)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.category.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200"
                  >
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.completed !== null && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    {filters.completed ? "Completati" : "In attesa"}
                    <button
                      onClick={() => handleFilterChange({ completed: null })}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="flex-1 overflow-y-auto">
            {/* Priority Filter */}
            <div className="border-b border-gray-200/50">
              <button
                onClick={() => toggleSection("priority")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-700">Priorità</h3>
                {expandedSections.priority ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.priority && (
                <div className="px-4 pb-4 space-y-2">
                  {priorities.map((priority) => (
                    <label
                      key={priority}
                      className="flex items-center group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(priority)}
                        onChange={() => togglePriority(priority)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`ml-3 text-sm capitalize group-hover:text-gray-900 transition-colors ${
                          filters.priority.includes(priority)
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {priority}
                      </span>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                          priority
                        )}`}
                      >
                        {tasks.filter((t) => t.priority === priority).length}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="border-b border-gray-200/50">
                <button
                  onClick={() => toggleSection("category")}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-sm font-medium text-gray-700">
                    Categorie
                  </h3>
                  {expandedSections.category ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.category && (
                  <div className="px-4 pb-4 space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center group cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`ml-3 text-sm group-hover:text-gray-900 transition-colors ${
                            filters.category.includes(category)
                              ? "text-gray-900 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {category}
                        </span>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                          {tasks.filter((t) => t.category === category).length}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Status Filter */}
            <div className="border-b border-gray-200/50">
              <button
                onClick={() => toggleSection("status")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-700">Stato</h3>
                {expandedSections.status ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.status && (
                <div className="px-4 pb-4 space-y-2">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={filters.completed === null}
                      onChange={() => handleFilterChange({ completed: null })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span
                      className={`ml-3 text-sm group-hover:text-gray-900 transition-colors ${
                        filters.completed === null
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      Tutti
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                      {tasks.length}
                    </span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={filters.completed === false}
                      onChange={() => handleFilterChange({ completed: false })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span
                      className={`ml-3 text-sm group-hover:text-gray-900 transition-colors ${
                        filters.completed === false
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      In attesa
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">
                      {tasks.filter((t) => !t.completed).length}
                    </span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={filters.completed === true}
                      onChange={() => handleFilterChange({ completed: true })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span
                      className={`ml-3 text-sm group-hover:text-gray-900 transition-colors ${
                        filters.completed === true
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      Completati
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                      {tasks.filter((t) => t.completed).length}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200/50">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Task Recenti
              </h3>
              <div className="space-y-2">
                {tasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onTaskSelect(task)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: task.color }}
                          />
                          <h4
                            className={`text-sm font-medium truncate group-hover:text-blue-600 transition-colors ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(task.startTime), "dd/MM", {
                              locale: it,
                            })}
                          </span>
                          {task.category && (
                            <span className="flex items-center">
                              <Tag className="w-3 h-3 mr-1" />
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {task.completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {task.priority === "high" && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
