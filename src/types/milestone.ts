export type Priority = 'low' | 'medium' | 'high';
export type Status = 'not-started' | 'in-progress' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: Status;
  color: string;
}