import React from 'react';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Milestone } from '../types/milestone';
import { cn } from '../lib/utils';
import {
  Calendar,
  Clock,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

const statusColors = {
  'not-started': 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
};

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border p-4 shadow-sm transition-all hover:shadow-md',
        'bg-white dark:bg-gray-800 dark:border-gray-700'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners}>
              <GripVertical className="h-5 w-5 cursor-grab text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {milestone.title}
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {milestone.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {format(new Date(milestone.deadline), 'MMM d, yyyy')}
              </span>
            </div>
            <div
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium text-white',
                priorityColors[milestone.priority]
              )}
            >
              {milestone.priority}
            </div>
            <div
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium text-white',
                statusColors[milestone.status]
              )}
            >
              {milestone.status.replace('-', ' ')}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(milestone)}
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(milestone.id)}
            className="rounded p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};