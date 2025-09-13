export interface Batch {
  id: string;
  name: string;
  startDate: Date;
  status: 'brewing' | 'ready' | 'f2_brewing' | 'f2_ready' | 'bottled' | 'archived';
  teaType: string;
  notes?: string;
  targetDays: number; // Target F1 fermentation days (typically 7-14)
  currentDay: number; // Current brewing day
  isActive: boolean; // Whether this batch is currently being tracked
  createdAt: Date;
  updatedAt: Date;
  // F2 Fermentation properties
  f2StartDate?: Date; // When F2 fermentation started
  f2TargetDays?: number; // Target F2 fermentation days (typically 2-7)
  f2CurrentDay?: number; // Current F2 brewing day
  f2Flavorings?: F2Flavoring[]; // Added flavorings for F2
}

export interface F2Flavoring {
  id: string;
  name: string;
  type: 'fruit' | 'syrup' | 'herb' | 'spice' | 'juice' | 'other';
  amount: string; // e.g., "1 cup", "2 tbsp", "1/4 cup"
  notes?: string;
}

export interface BatchFormData {
  name: string;
  teaType: string;
  notes?: string;
  targetDays: number;
  // F2 options
  f2TargetDays?: number;
  f2Flavorings?: F2Flavoring[];
}

export type BatchStatus = Batch['status'];

export interface BatchStats {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  averageBrewingDays: number;
  longestRunningBatch: Batch | null;
}
