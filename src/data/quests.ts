import { Quest } from '@/types/quest';

// Tutorial Quests (Linear Progression)
export const TUTORIAL_QUESTS: Quest[] = [
  {
    id: 'meet-scoby',
    title: 'Meet Your SCOBY',
    description: 'Welcome to your kombucha brewing journey! Your SCOBY is excited to meet you.',
    type: 'tutorial',
    category: 'brewing',
    xpReward: 50,
    healthReward: 10,
    requirements: [
      {
        id: 'welcome',
        type: 'custom',
        value: 'welcome',
        description: 'Complete the welcome tutorial',
        currentProgress: 0,
        targetProgress: 1
      }
    ],
    rewards: [
      {
        id: 'welcome-xp',
        type: 'xp',
        value: 50,
        description: '50 XP',
        unlocked: false
      },
      {
        id: 'welcome-health',
        type: 'health',
        value: 10,
        description: '10 Health',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    order: 1,
    difficulty: 'easy',
    estimatedTime: '2 minutes',
    tags: ['tutorial', 'introduction']
  },
  {
    id: 'first-batch',
    title: 'Brew Your First Batch',
    description: 'Start your first kombucha batch and begin your brewing journey.',
    type: 'tutorial',
    category: 'brewing',
    xpReward: 100,
    healthReward: 20,
    requirements: [
      {
        id: 'create-batch',
        type: 'batch_count',
        value: 1,
        description: 'Create your first batch',
        currentProgress: 0,
        targetProgress: 1
      }
    ],
    rewards: [
      {
        id: 'first-batch-xp',
        type: 'xp',
        value: 100,
        description: '100 XP',
        unlocked: false
      },
      {
        id: 'first-batch-health',
        type: 'health',
        value: 20,
        description: '20 Health',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: false,
    progress: 0,
    order: 2,
    difficulty: 'easy',
    estimatedTime: '10 minutes',
    tags: ['tutorial', 'brewing', 'first-time']
  },
  {
    id: 'taste-test',
    title: 'Taste Test',
    description: 'Taste your first batch and learn about flavor profiles.',
    type: 'tutorial',
    category: 'brewing',
    xpReward: 75,
    healthReward: 15,
    requirements: [
      {
        id: 'taste-batch',
        type: 'batch_status',
        value: 'ready',
        description: 'Complete your first batch',
        currentProgress: 0,
        targetProgress: 1
      }
    ],
    rewards: [
      {
        id: 'taste-xp',
        type: 'xp',
        value: 75,
        description: '75 XP',
        unlocked: false
      },
      {
        id: 'taste-health',
        type: 'health',
        value: 15,
        description: '15 Health',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: false,
    progress: 0,
    order: 3,
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    tags: ['tutorial', 'tasting', 'learning']
  },
  {
    id: 'f2-experiment',
    title: 'F2 Experimentation',
    description: 'Try your first second fermentation with flavorings.',
    type: 'tutorial',
    category: 'fermentation',
    xpReward: 125,
    healthReward: 25,
    requirements: [
      {
        id: 'f2-batch',
        type: 'batch_status',
        value: 'f2_ready',
        description: 'Complete your first F2 batch',
        currentProgress: 0,
        targetProgress: 1
      }
    ],
    rewards: [
      {
        id: 'f2-xp',
        type: 'xp',
        value: 125,
        description: '125 XP',
        unlocked: false
      },
      {
        id: 'f2-health',
        type: 'health',
        value: 25,
        description: '25 Health',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: false,
    progress: 0,
    order: 4,
    difficulty: 'medium',
    estimatedTime: '15 minutes',
    tags: ['tutorial', 'fermentation', 'flavoring']
  }
];

// Challenge Quests (Non-linear, Ongoing)
export const CHALLENGE_QUESTS: Quest[] = [
  {
    id: 'flavor-alchemist',
    title: 'Flavor Alchemist',
    description: 'Experiment with 5 different flavor combinations in your F2 batches.',
    type: 'challenge',
    category: 'flavoring',
    xpReward: 200,
    healthReward: 30,
    requirements: [
      {
        id: 'five-flavors',
        type: 'flavor_count',
        value: 5,
        description: 'Try 5 different flavor combinations',
        currentProgress: 0,
        targetProgress: 5
      }
    ],
    rewards: [
      {
        id: 'alchemist-xp',
        type: 'xp',
        value: 200,
        description: '200 XP',
        unlocked: false
      },
      {
        id: 'alchemist-health',
        type: 'health',
        value: 30,
        description: '30 Health',
        unlocked: false
      },
      {
        id: 'alchemist-title',
        type: 'title',
        value: 'Flavor Alchemist',
        description: 'Unlock the "Flavor Alchemist" title',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    difficulty: 'medium',
    estimatedTime: '2-4 weeks',
    tags: ['challenge', 'flavoring', 'experimentation']
  },
  {
    id: 'fizz-master',
    title: 'Fizz Master',
    description: 'Achieve perfect carbonation in 3 consecutive batches.',
    type: 'challenge',
    category: 'fermentation',
    xpReward: 300,
    healthReward: 40,
    requirements: [
      {
        id: 'perfect-carbonation',
        type: 'custom',
        value: 'perfect_carbonation',
        description: 'Achieve perfect carbonation 3 times in a row',
        currentProgress: 0,
        targetProgress: 3
      }
    ],
    rewards: [
      {
        id: 'fizz-xp',
        type: 'xp',
        value: 300,
        description: '300 XP',
        unlocked: false
      },
      {
        id: 'fizz-health',
        type: 'health',
        value: 40,
        description: '40 Health',
        unlocked: false
      },
      {
        id: 'fizz-cosmetic',
        type: 'cosmetic',
        value: 'bubble_aura',
        description: 'Unlock bubble aura effect',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    difficulty: 'hard',
    estimatedTime: '3-6 weeks',
    tags: ['challenge', 'fermentation', 'carbonation']
  },
  {
    id: 'brew-streak',
    title: 'Brew Streak',
    description: 'Maintain a brewing streak by starting a new batch every month for 6 months.',
    type: 'challenge',
    category: 'brewing',
    xpReward: 500,
    healthReward: 50,
    requirements: [
      {
        id: 'monthly-streak',
        type: 'streak_days',
        value: 180,
        description: 'Brew once per month for 6 months',
        currentProgress: 0,
        targetProgress: 180
      }
    ],
    rewards: [
      {
        id: 'streak-xp',
        type: 'xp',
        value: 500,
        description: '500 XP',
        unlocked: false
      },
      {
        id: 'streak-health',
        type: 'health',
        value: 50,
        description: '50 Health',
        unlocked: false
      },
      {
        id: 'streak-cosmetic',
        type: 'cosmetic',
        value: 'golden_skin',
        description: 'Unlock golden SCOBY skin',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    difficulty: 'hard',
    estimatedTime: '6 months',
    tags: ['challenge', 'consistency', 'long-term']
  },
  {
    id: 'tea-explorer',
    title: 'Tea Explorer',
    description: 'Try brewing with 3 different types of tea.',
    type: 'challenge',
    category: 'experimentation',
    xpReward: 150,
    healthReward: 25,
    requirements: [
      {
        id: 'three-teas',
        type: 'custom',
        value: 'three_tea_types',
        description: 'Use 3 different tea types',
        currentProgress: 0,
        targetProgress: 3
      }
    ],
    rewards: [
      {
        id: 'explorer-xp',
        type: 'xp',
        value: 150,
        description: '150 XP',
        unlocked: false
      },
      {
        id: 'explorer-health',
        type: 'health',
        value: 25,
        description: '25 Health',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    difficulty: 'easy',
    estimatedTime: '2-3 weeks',
    tags: ['challenge', 'experimentation', 'tea']
  },
  {
    id: 'health-monitor',
    title: 'Health Monitor',
    description: 'Keep your SCOBY healthy for 30 consecutive days.',
    type: 'challenge',
    category: 'health',
    xpReward: 250,
    healthReward: 35,
    requirements: [
      {
        id: 'healthy-streak',
        type: 'streak_days',
        value: 30,
        description: 'Maintain high health for 30 days',
        currentProgress: 0,
        targetProgress: 30
      }
    ],
    rewards: [
      {
        id: 'health-xp',
        type: 'xp',
        value: 250,
        description: '250 XP',
        unlocked: false
      },
      {
        id: 'health-health',
        type: 'health',
        value: 35,
        description: '35 Health',
        unlocked: false
      },
      {
        id: 'health-cosmetic',
        type: 'cosmetic',
        value: 'glowing_aura',
        description: 'Unlock glowing aura effect',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    difficulty: 'medium',
    estimatedTime: '1 month',
    tags: ['challenge', 'health', 'consistency']
  },
  {
    id: 'seasonal-brewer',
    title: 'Seasonal Brewer',
    description: 'Brew a batch for each season of the year.',
    type: 'challenge',
    category: 'seasonal',
    xpReward: 400,
    healthReward: 45,
    requirements: [
      {
        id: 'four-seasons',
        type: 'custom',
        value: 'four_seasons',
        description: 'Brew in all 4 seasons',
        currentProgress: 0,
        targetProgress: 4
      }
    ],
    rewards: [
      {
        id: 'seasonal-xp',
        type: 'xp',
        value: 400,
        description: '400 XP',
        unlocked: false
      },
      {
        id: 'seasonal-health',
        type: 'health',
        value: 45,
        description: '45 Health',
        unlocked: false
      },
      {
        id: 'seasonal-cosmetic',
        type: 'cosmetic',
        value: 'seasonal_skins',
        description: 'Unlock seasonal SCOBY skins',
        unlocked: false
      }
    ],
    isCompleted: false,
    isUnlocked: true,
    progress: 0,
    difficulty: 'hard',
    estimatedTime: '1 year',
    tags: ['challenge', 'seasonal', 'long-term']
  }
];

export const ALL_QUESTS = [...TUTORIAL_QUESTS, ...CHALLENGE_QUESTS];
