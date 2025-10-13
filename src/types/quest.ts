export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'challenge';
  category: string;
  xpReward: number;
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  isCompleted: boolean;
  isUnlocked: boolean;
  completedAt?: Date;
  progress: number; // 0-100
  order?: number; // For tutorial quests
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime?: string; // e.g., "5 minutes", "1 week"
  tags: string[];
}

export interface QuestRequirement {
  id: string;
  type: 'batch_count' | 'batch_status' | 'flavor_count' | 'streak_days' | 'xp_threshold' | 'custom';
  value: number | string;
  description: string;
  currentProgress: number;
  targetProgress: number;
}

export interface QuestReward {
  id: string;
  type: 'xp' | 'cosmetic' | 'title' | 'achievement';
  value: number | string;
  description: string;
  unlocked: boolean;
}

export interface ScobyAvatar {
  level: number;
  xp: number;
  xpToNextLevel: number;
  evolutionStage: 'baby' | 'growing' | 'mature' | 'elder';
  cosmeticUnlocks: CosmeticUnlock[];
  currentSkin?: string;
  aura?: string;
  mood: 'happy' | 'neutral' | 'sad';
  lastInteraction: Date;
  streakDays: number;
}

export interface CosmeticUnlock {
  id: string;
  name: string;
  type: 'skin' | 'aura' | 'accessory' | 'animation';
  unlockedAt: Date;
  questId?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface QuestProgress {
  questId: string;
  completedRequirements: string[];
  progress: number;
  lastUpdated: Date;
}

export interface QuestStats {
  totalQuests: number;
  completedQuests: number;
  tutorialProgress: number;
  challengesCompleted: number;
  totalXPEarned: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
}

export type QuestCategory = 
  | 'brewing' 
  | 'flavoring' 
  | 'fermentation' 
  | 'health' 
  | 'experimentation' 
  | 'community' 
  | 'seasonal';

export interface QuestFilter {
  type?: 'tutorial' | 'challenge';
  category?: QuestCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'available' | 'in_progress' | 'completed' | 'locked';
  tags?: string[];
}
