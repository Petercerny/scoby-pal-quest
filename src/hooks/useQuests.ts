import { useState, useEffect, useCallback, useRef } from 'react';
import { Quest, ScobyAvatar, QuestProgress, QuestStats, CosmeticUnlock } from '@/types/quest';
import { ALL_QUESTS } from '@/data/quests';
import { useBatches } from './useBatches';

const INITIAL_AVATAR: ScobyAvatar = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  evolutionStage: 'baby',
  cosmeticUnlocks: [],
  mood: 'neutral',
  lastInteraction: new Date(),
  streakDays: 0
} as ScobyAvatar;

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [avatar, setAvatar] = useState<ScobyAvatar>(INITIAL_AVATAR);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { batches } = useBatches();
  const prevBatchesRef = useRef<any[]>([]);
  const isInitializedRef = useRef(false);

  // Calculate XP required for next level
  const calculateXPToNextLevel = useCallback((level: number): number => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  }, []);

  // Calculate evolution stage based on level
  const calculateEvolutionStage = useCallback((level: number): 'baby' | 'growing' | 'mature' | 'elder' => {
    if (level <= 3) return 'baby';
    if (level <= 10) return 'growing';
    if (level <= 20) return 'mature';
    return 'elder';
  }, []);

  // Calculate mood based on activity
  const calculateMood = useCallback((streakDays: number): 'happy' | 'neutral' | 'sad' => {
    if (streakDays >= 7) return 'happy';
    if (streakDays >= 1) return 'neutral';
    return 'neutral'; // Start on neutral instead of sad
  }, []);

  // Load quest data from localStorage
  useEffect(() => {
    const savedQuests = localStorage.getItem('scoby-quests');
    const savedAvatar = localStorage.getItem('scoby-avatar');
    const savedProgress = localStorage.getItem('scoby-quest-progress');
    
    if (savedQuests) {
      try {
        const parsedQuests = JSON.parse(savedQuests).map((quest: any) => ({
          ...quest,
          completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined
        }));
        setQuests(parsedQuests);
      } catch (error) {
        console.error('Error loading quests:', error);
        setQuests(ALL_QUESTS);
      }
    } else {
      setQuests(ALL_QUESTS);
    }
    
    if (savedAvatar) {
      try {
        const parsedAvatar = {
          ...JSON.parse(savedAvatar),
          lastInteraction: new Date(JSON.parse(savedAvatar).lastInteraction)
        };
        setAvatar(parsedAvatar);
      } catch (error) {
        console.error('Error loading avatar:', error);
        setAvatar(INITIAL_AVATAR);
      }
    }
    
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress).map((progress: any) => ({
          ...progress,
          lastUpdated: new Date(progress.lastUpdated)
        }));
        setQuestProgress(parsedProgress);
      } catch (error) {
        console.error('Error loading quest progress:', error);
        setQuestProgress([]);
      }
    }
    
    isInitializedRef.current = true;
  }, []);

  // Save quest data to localStorage
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    try {
      localStorage.setItem('scoby-quests', JSON.stringify(quests));
      localStorage.setItem('scoby-avatar', JSON.stringify(avatar));
      localStorage.setItem('scoby-quest-progress', JSON.stringify(questProgress));
    } catch (error) {
      console.error('Error saving quest data:', error);
    }
  }, [quests, avatar, questProgress]);

  // Update avatar mood based on activity
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const newMood = calculateMood(avatar.streakDays);
    
    if (newMood !== avatar.mood) {
      setAvatar(prev => ({
        ...prev,
        mood: newMood
      }));
    }
  }, [avatar.streakDays, calculateMood, avatar.mood]);

  // Check quest progress based on batch data
  useEffect(() => {
    if (!isInitializedRef.current || batches.length === 0) return;
    
    const currentBatches = batches;
    const prevBatches = prevBatchesRef.current;
    
    // Only update if batches have changed
    if (JSON.stringify(currentBatches) === JSON.stringify(prevBatches)) return;
    
    prevBatchesRef.current = currentBatches;
    
    // Update quest progress based on batch changes
    updateQuestProgress();
  }, [batches]);

  // Update quest progress based on current batch data
  const updateQuestProgress = useCallback(() => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        const progress = calculateQuestProgress(quest);
        return {
          ...quest,
          progress: progress.percentage,
          requirements: quest.requirements.map(req => ({
            ...req,
            currentProgress: progress.requirements[req.id] || 0
          }))
        };
      })
    );
  }, [batches]);

  // Calculate quest progress
  const calculateQuestProgress = useCallback((quest: Quest) => {
    const requirements: Record<string, number> = {};
    let totalProgress = 0;
    let completedRequirements = 0;
    
    quest.requirements.forEach(req => {
      let currentProgress = 0;
      
      switch (req.type) {
        case 'batch_count':
          currentProgress = batches.length;
          break;
        case 'batch_status':
          currentProgress = batches.filter(batch => batch.status === req.value).length;
          break;
        case 'flavor_count':
          const uniqueFlavors = new Set();
          batches.forEach(batch => {
            batch.f2Flavorings?.forEach(flavor => {
              uniqueFlavors.add(flavor.name);
            });
          });
          currentProgress = uniqueFlavors.size;
          break;
        case 'streak_days':
          currentProgress = avatar.streakDays;
          break;
        case 'xp_threshold':
          currentProgress = avatar.xp;
          break;
        case 'custom':
          // Handle custom requirements based on quest ID
          currentProgress = calculateCustomRequirement(quest.id, req.value as string);
          break;
      }
      
      requirements[req.id] = Math.min(currentProgress, req.targetProgress);
      
      if (currentProgress >= req.targetProgress) {
        completedRequirements++;
      }
      
      totalProgress += Math.min(currentProgress, req.targetProgress);
    });
    
    const percentage = quest.requirements.length > 0 
      ? Math.round((totalProgress / quest.requirements.reduce((sum, req) => sum + req.targetProgress, 0)) * 100)
      : 0;
    
    return { requirements, percentage, completedRequirements };
  }, [batches, avatar]);

  // Calculate custom requirements
  const calculateCustomRequirement = useCallback((questId: string, value: string): number => {
    switch (questId) {
      case 'meet-scoby':
        return 1; // Always completed when quest is unlocked
      case 'fizz-master':
        // This would need to be tracked separately based on user feedback
        return 0;
      case 'tea-explorer':
        const teaTypes = new Set(batches.map(batch => batch.teaType));
        return teaTypes.size;
      case 'seasonal-brewer':
        // This would need seasonal tracking
        return 0;
      default:
        return 0;
    }
  }, [batches]);

  // Complete a quest
  const completeQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.isCompleted) return;
    
    // Award XP
    const newXP = avatar.xp + quest.xpReward;
    
    // Calculate new level
    let newLevel = avatar.level;
    let xpToNextLevel = avatar.xpToNextLevel;
    let remainingXP = newXP;
    
    while (remainingXP >= xpToNextLevel) {
      remainingXP -= xpToNextLevel;
      newLevel++;
      xpToNextLevel = calculateXPToNextLevel(newLevel);
    }
    
    // Calculate new evolution stage
    const newEvolutionStage = calculateEvolutionStage(newLevel);
    
    // Unlock cosmetic rewards
    const newCosmeticUnlocks: CosmeticUnlock[] = [...avatar.cosmeticUnlocks];
    quest.rewards.forEach(reward => {
      if (reward.type === 'cosmetic' && !newCosmeticUnlocks.find(c => c.id === reward.id)) {
        newCosmeticUnlocks.push({
          id: reward.id,
          name: reward.value as string,
          type: 'skin',
          unlockedAt: new Date(),
          questId: questId,
          rarity: 'common'
        });
      }
    });
    
    // Update avatar
    setAvatar(prev => ({
      ...prev,
      level: newLevel,
      xp: remainingXP,
      xpToNextLevel,
      evolutionStage: newEvolutionStage,
      cosmeticUnlocks: newCosmeticUnlocks,
      lastInteraction: new Date(),
      mood: calculateMood(prev.streakDays)
    }));
    
    // Mark quest as completed
    setQuests(prevQuests => 
      prevQuests.map(q => 
        q.id === questId 
          ? { ...q, isCompleted: true, completedAt: new Date() }
          : q
      )
    );
    
    // Unlock next tutorial quest
    if (quest.type === 'tutorial') {
      const nextQuest = quests.find(q => q.type === 'tutorial' && q.order === (quest.order || 0) + 1);
      if (nextQuest) {
        setQuests(prevQuests => 
          prevQuests.map(q => 
            q.id === nextQuest.id 
              ? { ...q, isUnlocked: true }
              : q
          )
        );
      }
    }
  }, [quests, avatar, calculateXPToNextLevel, calculateEvolutionStage, calculateMood]);

  // Get quest statistics
  const getQuestStats = useCallback((): QuestStats => {
    const totalQuests = quests.length;
    const completedQuests = quests.filter(q => q.isCompleted).length;
    const tutorialQuests = quests.filter(q => q.type === 'tutorial');
    const completedTutorialQuests = tutorialQuests.filter(q => q.isCompleted).length;
    const challengeQuests = quests.filter(q => q.type === 'challenge');
    const completedChallengeQuests = challengeQuests.filter(q => q.isCompleted).length;
    
    const totalXPEarned = quests
      .filter(q => q.isCompleted)
      .reduce((sum, q) => sum + q.xpReward, 0);
    
    
    const favoriteCategory = quests
      .filter(q => q.isCompleted)
      .reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const mostCompletedCategory = Object.entries(favoriteCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'brewing';
    
    return {
      totalQuests,
      completedQuests,
      tutorialProgress: tutorialQuests.length > 0 ? (completedTutorialQuests / tutorialQuests.length) * 100 : 0,
      challengesCompleted: completedChallengeQuests,
      totalXPEarned,
      currentStreak: avatar.streakDays,
      longestStreak: avatar.streakDays, // This would need to be tracked separately
      favoriteCategory: mostCompletedCategory
    } as QuestStats;
  }, [quests, avatar]);

  // Get quests by filter
  const getQuestsByFilter = useCallback((filter: {
    type?: 'tutorial' | 'challenge';
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    status?: 'available' | 'in_progress' | 'completed' | 'locked';
  }) => {
    return quests.filter(quest => {
      if (filter.type && quest.type !== filter.type) return false;
      if (filter.category && quest.category !== filter.category) return false;
      if (filter.difficulty && quest.difficulty !== filter.difficulty) return false;
      
      if (filter.status) {
        if (filter.status === 'available' && (!quest.isUnlocked || quest.isCompleted)) return false;
        if (filter.status === 'in_progress' && (!quest.isUnlocked || quest.isCompleted)) return false;
        if (filter.status === 'completed' && !quest.isCompleted) return false;
        if (filter.status === 'locked' && quest.isUnlocked) return false;
      }
      
      return true;
    });
  }, [quests]);

  return {
    quests,
    avatar,
    questProgress,
    isLoading,
    completeQuest,
    getQuestStats,
    getQuestsByFilter,
    updateQuestProgress
  };
};
