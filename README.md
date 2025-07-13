# Task Manager – Modern Weekly Calendar

A modern web application for task and project management, featuring a Gantt-style weekly calendar, advanced sidebar with filters/statistics, drag & drop functionality, resize capabilities, and a responsive interface.

## Key Features

- **Gantt-style Weekly View**: Display tasks as horizontal bars spanning multiple days
- **Drag & Drop and Resize**: Move and resize tasks directly on the calendar with live preview
- **Advanced Sidebar**: Filter by priority, category, status, search by text, view statistics, and active filter badges
- **Task Creation/Edit Form**: Modern interface with quick-create support, color picker, priority, category, and completion status
- **Test Data**: Ready-to-use demo with sample tasks covering various scenarios
- **Responsive UI**: Modern design optimized for desktop and tablet
- **Clean TypeScript Code**: No warnings or unused variables

## Demo

The application comes with comprehensive test data including tasks spanning multiple days, different priorities, categories, completed/pending tasks, and various date ranges.

## Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd task-manager
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**

   ```bash
   pnpm build
   # or
   npm run build
   # or
   yarn build
   ```

5. **Preview production build**
   ```bash
   pnpm preview
   # or
   npm run preview
   # or
   yarn preview
   ```

## Project Structure

```
src/
  components/      // Main React components (Calendar, Sidebar, TaskForm, etc.)
  data/            // Test data (testTasks.ts)
  types/           // TypeScript types (Task.ts)
  assets/          // Static assets
  index.css        // Global styles (Tailwind)
  App.tsx          // App entry point
  main.tsx         // React mounting
```

### Main Components

- **Calendar.tsx**: Weekly view, task management, filters, week navigation
- **Sidebar.tsx**: Advanced filters, statistics, search, active filter badges
- **TaskForm.tsx**: Form for creating/editing tasks
- **TaskOverlapManager.tsx**: Task bar visualization and overlap management
- **TaskItem.tsx**: Individual task representation (for alternative views)
- **TimeGrid.tsx**: (for potential time slot extensions)

### Test Data

Sample tasks are defined in `src/data/testTasks.ts` and cover various scenarios: multi-day tasks, different priorities, categories, completed/pending tasks, etc.

Example:

```ts
{
  id: "1",
  title: "Team Meeting",
  description: "Discussion about project objectives",
  startTime: new Date(2025, 0, 20),
  endTime: new Date(2025, 0, 20),
  color: "#3b82f6",
  priority: "high",
  completed: false,
  category: "Meeting",
}
```

### Data Model

Defined in `src/types/Task.ts`:

```ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  category?: string;
}
```

## Tech Stack

- **React 19 + TypeScript**
- **Vite** (dev server and build)
- **TailwindCSS** (styling)
- **@dnd-kit** (drag & drop)
- **date-fns** (date handling)
- **lucide-react** (icons)

## Usage

### Basic Operations

1. **Create a Task**: Click the "New Task" button or click on an empty day cell
2. **Edit a Task**: Click on any task bar to open the edit form
3. **Move a Task**: Drag and drop task bars to new dates
4. **Resize a Task**: Use the left/right handles to extend or shorten task duration
5. **Filter Tasks**: Use the sidebar to filter by priority, category, status, or search text
6. **Navigate Weeks**: Use the arrow buttons to move between weeks

### Advanced Features

- **Quick Create**: Click on empty day cells to create tasks for that specific day
- **Color Coding**: Choose from 8 predefined colors for task organization
- **Priority Levels**: Set low, medium, or high priority with visual indicators
- **Categories**: Organize tasks by category with automatic filtering
- **Completion Status**: Mark tasks as completed with visual feedback

## Customization

- Modify sample tasks in `src/data/testTasks.ts`
- Add new categories/priorities in the form
- Customize colors and styling through Tailwind classes
- Extend the data model in `src/types/Task.ts`

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Code Quality

The project maintains clean TypeScript code with:

- No unused variables or imports
- Proper type definitions
- ESLint configuration for React and TypeScript
- Consistent code formatting

## Future Enhancements

- Backend integration and API synchronization
- Notifications and reminders
- Full mobile support
- Multi-user collaboration
- Export/import functionality
- Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code quality (no linting errors)
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or contributions, please open an issue on the repository.
