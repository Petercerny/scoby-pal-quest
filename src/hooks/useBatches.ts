import { useState, useEffect, useCallback } from 'react';
import { differenceInDays, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { Batch, BatchFormData, BatchStats } from '@/types/batch';

// Sample demo batches for testing
const DEMO_BATCHES: Omit<Batch, 'id' | 'currentDay' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Summer Black Tea',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'brewing',
    teaType: 'Black Tea',
    notes: 'Using organic black tea leaves with a hint of bergamot',
    targetDays: 7,
    isActive: true,
  },
  {
    name: 'Green Tea Experiment',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'brewing',
    teaType: 'Green Tea',
    notes: 'First time trying green tea kombucha',
    targetDays: 10,
    isActive: true,
  },
  {
    name: 'Classic Black Batch',
    startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    status: 'ready',
    teaType: 'Black Tea',
    notes: 'Perfect balance of sweet and tart',
    targetDays: 7,
    isActive: true,
  },
];

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate current brewing day for a batch
  const calculateCurrentDay = useCallback((startDate: Date): number => {
    const today = startOfDay(new Date());
    const start = startOfDay(startDate);
    const days = differenceInDays(today, start);
    return Math.max(0, days + 1); // +1 because day 1 is the start date
  }, []);

  // Load batches from localStorage on mount
  useEffect(() => {
    const savedBatches = localStorage.getItem('scoby-batches');
    if (savedBatches) {
      try {
        const parsedBatches = JSON.parse(savedBatches).map((batch: any) => ({
          ...batch,
          startDate: new Date(batch.startDate),
          createdAt: new Date(batch.createdAt),
          updatedAt: new Date(batch.updatedAt),
        }));
        setBatches(parsedBatches);
      } catch (error) {
        console.error('Error loading batches:', error);
      }
    } else {
      // Initialize with demo batches if no saved batches exist
      const demoBatches: Batch[] = DEMO_BATCHES.map((demo, index) => ({
        ...demo,
        id: `demo-batch-${index}`,
        currentDay: calculateCurrentDay(demo.startDate),
        createdAt: demo.startDate,
        updatedAt: new Date(),
      }));
      setBatches(demoBatches);
    }
  }, [calculateCurrentDay]);

  // Save batches to localStorage whenever batches change
  useEffect(() => {
    localStorage.setItem('scoby-batches', JSON.stringify(batches));
  }, [batches]);



  // Update all batches' current days
  const updateBatchDays = useCallback(() => {
    setBatches(prevBatches => 
      prevBatches.map(batch => ({
        ...batch,
        currentDay: calculateCurrentDay(batch.startDate),
        updatedAt: new Date(),
      }))
    );
  }, [calculateCurrentDay]);

  // Update batch days every day at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = startOfDay(addDays(now, 1));
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      updateBatchDays();
      // Then update every 24 hours
      const dailyTimer = setInterval(updateBatchDays, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyTimer);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [updateBatchDays]);

  // Create a new batch
  const createBatch = useCallback((formData: BatchFormData): Batch => {
    const now = new Date();
    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      name: formData.name,
      startDate: now,
      status: 'brewing',
      teaType: formData.teaType,
      notes: formData.notes,
      targetDays: formData.targetDays,
      currentDay: 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    setBatches(prev => [...prev, newBatch]);
    return newBatch;
  }, []);

  // Update batch status
  const updateBatchStatus = useCallback((batchId: string, status: Batch['status']) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status, updatedAt: new Date() }
          : batch
      )
    );
  }, []);

  // Update batch details (name, tea type, notes, target days)
  const updateBatch = useCallback((batchId: string, updates: Partial<BatchFormData>) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { 
              ...batch, 
              ...updates, 
              updatedAt: new Date() 
            }
          : batch
      )
    );
  }, []);

  // Archive a batch
  const archiveBatch = useCallback((batchId: string) => {
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'archived', isActive: false, updatedAt: new Date() }
          : batch
      )
    );
  }, []);

  // Delete a batch
  const deleteBatch = useCallback((batchId: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== batchId));
  }, []);

  // Get batch statistics
  const getBatchStats = useCallback((): BatchStats => {
    const totalBatches = batches.length;
    const activeBatches = batches.filter(b => b.isActive && b.status === 'brewing').length;
    const completedBatches = batches.filter(b => ['ready', 'bottled'].includes(b.status)).length;
    
    const brewingBatches = batches.filter(b => b.status === 'brewing');
    const averageBrewingDays = brewingBatches.length > 0 
      ? brewingBatches.reduce((sum, b) => sum + b.currentDay, 0) / brewingBatches.length
      : 0;

    // Calculate longest running batch
    let longestRunningBatch = null;
    let maxBrewingDays = 0;
    
    for (const batch of batches) {
      if (batch.isActive && batch.status === 'brewing') {
        if (batch.currentDay > maxBrewingDays) {
          maxBrewingDays = batch.currentDay;
          longestRunningBatch = batch;
        }
      }
    }

    return {
      totalBatches,
      activeBatches,
      completedBatches,
      averageBrewingDays: Math.round(averageBrewingDays * 10) / 10,
      longestRunningBatch,
    };
  }, [batches]);

  // Get active brewing batches
  const getActiveBatches = useCallback(() => {
    return batches.filter(batch => batch.isActive && batch.status === 'brewing');
  }, [batches]);

  // Get batches by status
  const getBatchesByStatus = useCallback((status: Batch['status']) => {
    return batches.filter(batch => batch.status === status);
  }, [batches]);

  return {
    batches,
    isLoading,
    createBatch,
    updateBatch,
    updateBatchStatus,
    archiveBatch,
    deleteBatch,
    getBatchStats,
    getActiveBatches,
    getBatchesByStatus,
    updateBatchDays,
  };
};
