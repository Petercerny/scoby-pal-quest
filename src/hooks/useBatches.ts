import { useState, useEffect, useCallback, useRef } from 'react';
import { differenceInDays, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { Batch, BatchFormData, BatchStats, F2Flavoring } from '@/types/batch';

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
  {
    name: 'Strawberry Ginger Fizz',
    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    status: 'f2_brewing',
    teaType: 'Black Tea',
    notes: 'F1 completed, now adding strawberry and ginger for F2',
    targetDays: 7,
    f2StartDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    f2TargetDays: 3,
    f2CurrentDay: 2,
    f2Flavorings: [
      { id: '1', name: 'Fresh Strawberries', type: 'fruit', amount: '1 cup', notes: 'Diced' },
      { id: '2', name: 'Fresh Ginger', type: 'spice', amount: '2 tbsp', notes: 'Grated' }
    ],
    isActive: true,
  },
];

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use ref to track previous batches state to avoid unnecessary saves
  const prevBatchesRef = useRef<Batch[] | null>(null);
  const isInitializedRef = useRef(false);

  // Calculate current brewing day for a batch
  const calculateCurrentDay = useCallback((startDate: Date): number => {
    const today = startOfDay(new Date());
    const start = startOfDay(startDate);
    const days = differenceInDays(today, start);
    return Math.max(0, days + 1); // +1 because day 1 is the start date
  }, []);

  // Calculate current F2 brewing day for a batch
  const calculateF2CurrentDay = useCallback((f2StartDate: Date): number => {
    const today = startOfDay(new Date());
    const start = startOfDay(f2StartDate);
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
          f2StartDate: batch.f2StartDate ? new Date(batch.f2StartDate) : undefined,
          createdAt: new Date(batch.createdAt),
          updatedAt: new Date(batch.updatedAt),
        }));
        setBatches(parsedBatches);
        prevBatchesRef.current = parsedBatches;
      } catch (error) {
        console.error('Error loading batches:', error);
      }
    } else {
      // Initialize with demo batches if no saved batches exist
      const demoBatches: Batch[] = DEMO_BATCHES.map((demo, index) => ({
        ...demo,
        id: `demo-batch-${index}`,
        currentDay: calculateCurrentDay(demo.startDate),
        f2CurrentDay: demo.f2StartDate ? calculateF2CurrentDay(demo.f2StartDate) : undefined,
        createdAt: demo.startDate,
        updatedAt: new Date(),
      }));
      setBatches(demoBatches);
      prevBatchesRef.current = demoBatches;
    }
    isInitializedRef.current = true;
  }, [calculateCurrentDay]);

  // Save batches to localStorage only when there are meaningful changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const prevBatches = prevBatchesRef.current;
    if (!prevBatches) {
      prevBatchesRef.current = batches;
      return;
    }

    // Only save if there are meaningful changes
    const hasLengthChange = prevBatches.length !== batches.length;
    const hasContentChange = batches.some((batch, index) => {
      const prevBatch = prevBatches[index];
      if (!prevBatch) return true;
      return (
        batch.currentDay !== prevBatch.currentDay ||
        batch.status !== prevBatch.status ||
        batch.updatedAt.getTime() !== prevBatch.updatedAt.getTime() ||
        batch.f2CurrentDay !== prevBatch.f2CurrentDay
      );
    });

    if (hasLengthChange || hasContentChange) {
      try {
        localStorage.setItem('scoby-batches', JSON.stringify(batches));
        prevBatchesRef.current = batches;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded. Clearing old batches...');
          // Keep only active batches and recent archived ones
          const recentBatches = batches.filter(batch => 
            batch.isActive || 
            (batch.status === 'archived' && 
             differenceInDays(new Date(), batch.updatedAt) <= 30)
          );
          try {
            localStorage.setItem('scoby-batches', JSON.stringify(recentBatches));
            setBatches(recentBatches);
            prevBatchesRef.current = recentBatches;
          } catch (retryError) {
            console.error('Failed to save even after trimming batches:', retryError);
            // Keep only active batches as last resort
            const activeBatches = batches.filter(batch => batch.isActive);
            localStorage.setItem('scoby-batches', JSON.stringify(activeBatches));
            setBatches(activeBatches);
            prevBatchesRef.current = activeBatches;
          }
        } else {
          console.error('Error saving batches data:', error);
        }
      }
    }
  }, [batches]);



  // Update all batches' current days
  const updateBatchDays = useCallback(() => {
    setBatches(prevBatches => 
      prevBatches.map(batch => ({
        ...batch,
        currentDay: calculateCurrentDay(batch.startDate),
        f2CurrentDay: batch.f2StartDate ? calculateF2CurrentDay(batch.f2StartDate) : undefined,
        updatedAt: new Date(),
      }))
    );
  }, [calculateCurrentDay, calculateF2CurrentDay]);

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
      f2TargetDays: formData.f2TargetDays,
      f2Flavorings: formData.f2Flavorings || [],
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

  // Start F2 fermentation
  const startF2Fermentation = useCallback((batchId: string, f2TargetDays: number, f2Flavorings: F2Flavoring[]) => {
    const now = new Date();
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { 
              ...batch, 
              status: 'f2_brewing',
              f2StartDate: now,
              f2TargetDays,
              f2Flavorings,
              f2CurrentDay: 1,
              updatedAt: now 
            }
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
    startF2Fermentation,
    archiveBatch,
    deleteBatch,
    getBatchStats,
    getActiveBatches,
    getBatchesByStatus,
    updateBatchDays,
  };
};
