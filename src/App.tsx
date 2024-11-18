import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MilestoneCard } from './components/MilestoneCard';
import { MilestoneForm } from './components/MilestoneForm';
import { useMilestoneStore } from './store/useMilestoneStore';
import { Milestone } from './types/milestone';
import { cn } from './lib/utils';
import {
  Download,
  Moon,
  Plus,
  Sun,
  Filter,
  HelpCircle,
  X,
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showHelp, setShowHelp] = useState(false);

  const {
    milestones,
    theme,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    reorderMilestones,
    toggleTheme,
  } = useMilestoneStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = milestones.findIndex((m) => m.id === active.id);
      const newIndex = milestones.findIndex((m) => m.id === over.id);
      reorderMilestones(arrayMove(milestones, oldIndex, newIndex));
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('roadmap-content');
    if (element) {
      const opt = {
        margin: 1,
        filename: 'roadmap.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const filteredMilestones = milestones.filter((milestone) =>
    statusFilter === 'all' ? true : milestone.status === statusFilter
  );

  const completedPercentage =
    (milestones.filter((m) => m.status === 'completed').length /
      milestones.length) *
    100;

  return (
    <div
      className={cn(
        'min-h-screen bg-gray-50 transition-colors',
        'dark:bg-gray-900'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TaskTrek
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHelp(true)}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Milestone
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(
                'rounded-md border border-gray-300 px-3 py-1.5',
                'bg-white text-sm text-gray-700',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
              )}
            >
              <option value="all">All Milestones</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {milestones.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Overall Progress
              </span>
              <div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${completedPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {Math.round(completedPercentage)}%
              </span>
            </div>
          )}
        </div>

        <div id="roadmap-content" className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredMilestones.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredMilestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onEdit={(m) => {
                    setEditingMilestone(m);
                    setIsFormOpen(true);
                  }}
                  onDelete={deleteMilestone}
                />
              ))}
            </SortableContext>
          </DndContext>

          {filteredMilestones.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 dark:border-gray-700">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No milestones found. Click "Add Milestone" to create your first
                milestone.
              </p>
            </div>
          )}
        </div>

        {isFormOpen && (
          <MilestoneForm
            onSubmit={(data) => {
              if (editingMilestone) {
                updateMilestone(editingMilestone.id, data);
              } else {
                addMilestone(data);
              }
              setEditingMilestone(null);
            }}
            onClose={() => {
              setIsFormOpen(false);
              setEditingMilestone(null);
            }}
            initialData={editingMilestone || undefined}
          />
        )}

        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  How to Use
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  1. Click "Add Milestone" to create a new milestone with a
                  title, description, and deadline.
                </p>
                <p>
                  2. Drag and drop milestones to reorder them using the grip
                  handle on the left.
                </p>
                <p>
                  3. Use the status filter to view specific milestones based on
                  their progress.
                </p>
                <p>
                  4. Click the edit or delete icons on each milestone to modify
                  or remove them.
                </p>
                <p>
                  5. Export your roadmap to PDF using the "Export PDF" button.
                </p>
                <p>
                  6. Toggle between light and dark mode using the theme button.
                </p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
