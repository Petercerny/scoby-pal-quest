import { useState, useEffect, useCallback, useRef } from 'react';
import { differenceInDays, startOfDay } from 'date-fns';
import { Batch } from '@/types/batch';

export interface HealthEvent {
  id: string;
  type: 'BATCH_SUCCESS' | 'BATCH_FAILURE' | 'QUEST_COMPLETE' | 'TIME_DECAY' | 'BATCH_OVERDUE' | 'DAILY_CARE';
  value: number; // Health change amount
  timestamp: Date;
  description: string;
}

export interface ScobyHealth {
  currentHealth: number;
  maxHealth: number;
  healthEvents: HealthEvent[];
  lastUpdated: Date;
}

const INITIAL_HEALTH = 85;
const MAX_HEALTH = 100;
const MIN_HEALTH = 0;

// Health change constants
const HEALTH_CHANGES = {
  BATCH_SUCCESS: 5,        // +5 health for successful batch completion
  BATCH_FAILURE: -10,      // -10 health for failed/overdue batches
  QUEST_COMPLETE: 3,       // +3 health for completing quests
  TIME_DECAY: -2,          // -2 health per day without activity
  BATCH_OVERDUE: -5,       // -5 health for batches that go significantly over target
  DAILY_CARE: 1,           // +1 health for daily batch tending
} as const;

export const useScobyHealth = () => {
  const [health, setHealth] = useState<ScobyHealth>({
    currentHealth: INITIAL_HEALTH,
    maxHealth: MAX_HEALTH,
    healthEvents: [],
    lastUpdated: new Date(),
  });

  // Use ref to track previous health state to avoid unnecessary saves
  const prevHealthRef = useRef<ScobyHealth | null>(null);
  const isInitializedRef = useRef(false);

  // Load health from localStorage on mount
  useEffect(() => {
    const savedHealth = localStorage.getItem('scoby-health');
    if (savedHealth) {
      try {
        const parsedHealth = JSON.parse(savedHealth);
        const loadedHealth = {
          ...parsedHealth,
          lastUpdated: new Date(parsedHealth.lastUpdated),
          healthEvents: parsedHealth.healthEvents.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp),
          })),
        };
        setHealth(loadedHealth);
        prevHealthRef.current = loadedHealth;
      } catch (error) {
        console.error('Error loading health data:', error);
      }
    }
    isInitializedRef.current = true;
  }, []);

  // Save health to localStorage only when there are meaningful changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const prevHealth = prevHealthRef.current;
    if (!prevHealth) {
      prevHealthRef.current = health;
      return;
    }

    // Only save if there are meaningful changes
    const hasHealthChange = prevHealth.currentHealth !== health.currentHealth;
    const hasNewEvents = health.healthEvents.length > prevHealth.healthEvents.length;
    const hasTimeChange = prevHealth.lastUpdated.getTime() !== health.lastUpdated.getTime();

    if (hasHealthChange || hasNewEvents || hasTimeChange) {
      try {
        localStorage.setItem('scoby-health', JSON.stringify(health));
        prevHealthRef.current = health;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded. Clearing old health events...');
          // Clear old health events to free up space
          const recentEvents = health.healthEvents.slice(-50); // Keep only last 50 events
          const trimmedHealth = {
            ...health,
            healthEvents: recentEvents,
          };
          try {
            localStorage.setItem('scoby-health', JSON.stringify(trimmedHealth));
            setHealth(trimmedHealth);
            prevHealthRef.current = trimmedHealth;
          } catch (retryError) {
            console.error('Failed to save even after trimming events:', retryError);
            // Clear all health events as last resort
            const minimalHealth = {
              ...health,
              healthEvents: [],
            };
            localStorage.setItem('scoby-health', JSON.stringify(minimalHealth));
            setHealth(minimalHealth);
            prevHealthRef.current = minimalHealth;
          }
        } else {
          console.error('Error saving health data:', error);
        }
      }
    }
  }, [health]);

  // Calculate health based on batch performance
  const calculateBatchHealth = useCallback((batches: Batch[]): { healthChange: number; events: HealthEvent[] } => {
    let healthChange = 0;
    const events: HealthEvent[] = [];
    const today = startOfDay(new Date());

    batches.forEach(batch => {
      if (batch.status === 'ready' || batch.status === 'bottled') {
        // Check if we already have a success event for this batch
        const existingSuccessEvent = health.healthEvents.find(
          event => event.id === `batch-success-${batch.id}`
        );
        
        if (!existingSuccessEvent) {
          // Successful batch completion
          const successEvent: HealthEvent = {
            id: `batch-success-${batch.id}`,
            type: 'BATCH_SUCCESS',
            value: HEALTH_CHANGES.BATCH_SUCCESS,
            timestamp: new Date(),
            description: `Successfully completed ${batch.name}`,
          };
          events.push(successEvent);
          healthChange += HEALTH_CHANGES.BATCH_SUCCESS;
        }
      } else if (batch.status === 'brewing') {
        // Check for overdue batches (more than 2 days over target)
        if (batch.currentDay > batch.targetDays + 2) {
          // Check if we already have an overdue event for this batch today
          const existingOverdueEvent = health.healthEvents.find(
            event => event.id === `batch-overdue-${batch.id}` &&
            startOfDay(event.timestamp).getTime() === today.getTime()
          );
          
          if (!existingOverdueEvent) {
            const overdueEvent: HealthEvent = {
              id: `batch-overdue-${batch.id}`,
              type: 'BATCH_OVERDUE',
              value: HEALTH_CHANGES.BATCH_OVERDUE,
              timestamp: new Date(),
              description: `${batch.name} is overdue by ${batch.currentDay - batch.targetDays} days`,
            };
            events.push(overdueEvent);
            healthChange += HEALTH_CHANGES.BATCH_OVERDUE;
          }
        }
        
        // Daily care bonus for active batches - only once per day
        const lastCareEvent = health.healthEvents.find(
          event => event.description.includes(batch.name) && 
          event.type === 'DAILY_CARE' &&
          startOfDay(event.timestamp).getTime() === today.getTime()
        );
        
        if (!lastCareEvent) {
          const careEvent: HealthEvent = {
            id: `daily-care-${batch.id}-${today.getTime()}`,
            type: 'DAILY_CARE',
            value: HEALTH_CHANGES.DAILY_CARE,
            timestamp: new Date(),
            description: `Daily care for ${batch.name}`,
          };
          events.push(careEvent);
          healthChange += HEALTH_CHANGES.DAILY_CARE;
        }
      }
    });

    return { healthChange, events };
  }, [health.healthEvents]);

  // Calculate time-based decay
  const calculateTimeDecay = useCallback((): number => {
    const daysSinceLastActivity = differenceInDays(
      new Date(),
      health.lastUpdated
    );
    
    if (daysSinceLastActivity >= 1) {
      return daysSinceLastActivity * HEALTH_CHANGES.TIME_DECAY;
    }
    
    return 0;
  }, [health.lastUpdated]);

  // Update health based on batches
  const updateHealthFromBatches = useCallback((batches: Batch[]) => {
    const { healthChange, events } = calculateBatchHealth(batches);
    const timeDecay = calculateTimeDecay();
    
    let totalHealthChange = healthChange + timeDecay;
    
    // Add time decay event if applicable - only once per day
    if (timeDecay < 0) {
      const today = startOfDay(new Date());
      const existingDecayEvent = health.healthEvents.find(
        event => event.type === 'TIME_DECAY' &&
        startOfDay(event.timestamp).getTime() === today.getTime()
      );
      
      if (!existingDecayEvent) {
        const decayEvent: HealthEvent = {
          id: `time-decay-${today.getTime()}`,
          type: 'TIME_DECAY',
          value: timeDecay,
          timestamp: new Date(),
          description: `Health decay due to inactivity`,
        };
        events.push(decayEvent);
      }
    }

    // Only update if there are actual changes
    if (totalHealthChange !== 0 || events.length > 0) {
      const newHealth = Math.max(
        MIN_HEALTH,
        Math.min(MAX_HEALTH, health.currentHealth + totalHealthChange)
      );

      setHealth(prev => ({
        ...prev,
        currentHealth: newHealth,
        healthEvents: [...prev.healthEvents, ...events],
        lastUpdated: new Date(),
      }));
    }

    return { healthChange: totalHealthChange, events };
  }, [health.currentHealth, health.lastUpdated, calculateBatchHealth, calculateTimeDecay]);

  // Add health for quest completion
  const addQuestHealth = useCallback((questTitle: string) => {
    const questEvent: HealthEvent = {
      id: `quest-${Date.now()}`,
      type: 'QUEST_COMPLETE',
      value: HEALTH_CHANGES.QUEST_COMPLETE,
      timestamp: new Date(),
      description: `Completed quest: ${questTitle}`,
    };

    const newHealth = Math.min(
      MAX_HEALTH,
      health.currentHealth + HEALTH_CHANGES.QUEST_COMPLETE
    );

    setHealth(prev => ({
      ...prev,
      currentHealth: newHealth,
      healthEvents: [...prev.healthEvents, questEvent],
      lastUpdated: new Date(),
    }));

    return HEALTH_CHANGES.QUEST_COMPLETE;
  }, [health.currentHealth]);

  // Reset health to initial value
  const resetHealth = useCallback(() => {
    setHealth({
      currentHealth: INITIAL_HEALTH,
      maxHealth: MAX_HEALTH,
      healthEvents: [],
      lastUpdated: new Date(),
    });
  }, []);

  // Get health status
  const getHealthStatus = useCallback(() => {
    if (health.currentHealth >= 80) return 'Thriving';
    if (health.currentHealth >= 60) return 'Healthy';
    if (health.currentHealth >= 40) return 'Needs Care';
    if (health.currentHealth >= 20) return 'Warning';
    return 'Critical';
  }, [health.currentHealth]);

  // Get health mood for avatar
  const getHealthMood = useCallback(() => {
    if (health.currentHealth >= 80) return 'happy';
    if (health.currentHealth >= 60) return 'neutral';
    if (health.currentHealth >= 40) return 'concerned';
    if (health.currentHealth >= 20) return 'worried';
    return 'sick';
  }, [health.currentHealth]);

  // Get recent health events (last 7 days)
  const getRecentHealthEvents = useCallback(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return health.healthEvents.filter(event => 
      event.timestamp > sevenDaysAgo
    );
  }, [health.healthEvents]);

  // Get health trend (positive, negative, or stable)
  const getHealthTrend = useCallback(() => {
    const recentEvents = getRecentHealthEvents();
    const totalChange = recentEvents.reduce((sum, event) => sum + event.value, 0);
    
    if (totalChange > 2) return 'improving';
    if (totalChange < -2) return 'declining';
    return 'stable';
  }, [getRecentHealthEvents]);

  return {
    health,
    updateHealthFromBatches,
    addQuestHealth,
    resetHealth,
    getHealthStatus,
    getHealthMood,
    getRecentHealthEvents,
    getHealthTrend,
  };
};













