export interface Batch {
  id: string;
  name: string;
  startDate: Date;
  status: 'brewing' | 'ready' | 'bottled' | 'archived';
  teaType: string;
  notes?: string;
  targetDays: number; // Target fermentation days (typically 7-14)
  currentDay: number; // Current brewing day
  isActive: boolean; // Whether this batch is currently being tracked
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchFormData {
  name: string;
  teaType: string;
  notes?: string;
  targetDays: number;
}

export type BatchStatus = Batch['status'];

export interface BatchStats {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  averageBrewingDays: number;
  longestRunningBatch: Batch | null;
}
