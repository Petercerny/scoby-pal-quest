import React from 'react';
import { ScobyAvatar as ScobyAvatarType } from '@/types/quest';
import { cn } from '@/lib/utils';
import scobyAvatarImage from '@/assets/scoby.ico';

interface ScobyAvatarProps {
  avatar: ScobyAvatarType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStats?: boolean;
  className?: string;
}

export const ScobyAvatar: React.FC<ScobyAvatarProps> = ({
  avatar,
  size = 'md',
  showStats = false,
  className
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16';
      case 'md': return 'w-24 h-24';
      case 'lg': return 'w-32 h-32';
      case 'xl': return 'w-48 h-48';
      default: return 'w-24 h-24';
    }
  };

  const getEvolutionStyles = () => {
    const { evolutionStage, mood } = avatar;
    
    // Base colors for each evolution stage
    const stageColors = {
      baby: {
        happy: 'bg-pink-200 border-pink-300',
        neutral: 'bg-pink-100 border-pink-200',
        sad: 'bg-gray-200 border-gray-300'
      },
      growing: {
        happy: 'bg-amber-200 border-amber-300',
        neutral: 'bg-amber-100 border-amber-200',
        sad: 'bg-gray-200 border-gray-300'
      },
      mature: {
        happy: 'bg-yellow-200 border-yellow-300',
        neutral: 'bg-yellow-100 border-yellow-200',
        sad: 'bg-gray-200 border-gray-300'
      },
      elder: {
        happy: 'bg-gradient-to-br from-yellow-200 to-amber-300 border-yellow-400',
        neutral: 'bg-gradient-to-br from-yellow-100 to-amber-200 border-yellow-300',
        sad: 'bg-gray-200 border-gray-300'
      }
    };

    return stageColors[evolutionStage][mood];
  };


  const getEvolutionLevel = () => {
    if (avatar.level <= 3) return 'baby';
    if (avatar.level <= 10) return 'growing';
    if (avatar.level <= 20) return 'mature';
    return 'elder';
  };

  const getMoodEmoji = () => {
    const { mood } = avatar;
    
    if (mood === 'sad') return '😢';
    if (mood === 'happy') return '😊';
    return '😐'; // Neutral
  };

  const getAuraEffect = () => {
    const { evolutionStage, currentSkin } = avatar;
    
    const auraClasses = [];
    
    // Evolution-based aura
    if (evolutionStage === 'elder') {
      auraClasses.push('shadow-lg shadow-yellow-400/50');
    }
    
    // Cosmetic aura effects - gentle floating instead of bouncing
    if (currentSkin === 'bubble_aura') {
      auraClasses.push('hover:translate-y-[-2px] transition-transform duration-2000 ease-in-out');
    }
    if (currentSkin === 'glowing_aura') {
      auraClasses.push('shadow-lg shadow-blue-400/50');
    }
    
    return auraClasses.join(' ');
  };

  const getScobyShape = () => {
    const { evolutionStage } = avatar;
    
    switch (evolutionStage) {
      case 'baby':
        return 'rounded-full'; // Small, round blob
      case 'growing':
        return 'rounded-2xl'; // Slightly more defined
      case 'mature':
        return 'rounded-3xl'; // More structured
      case 'elder':
        return 'rounded-3xl'; // Regal, structured
      default:
        return 'rounded-full';
    }
  };

  const getScobyFeatures = () => {
    const { evolutionStage, mood } = avatar;
    
    const features = [];
    
    // Eyes
    if (evolutionStage !== 'baby') {
      const eyeColor = mood === 'happy' ? 'text-blue-600' : 'text-gray-600';
      features.push(
        <div key="eyes" className="flex justify-center space-x-1 mb-1">
          <div className={cn('w-1 h-1 rounded-full', eyeColor)}></div>
          <div className={cn('w-1 h-1 rounded-full', eyeColor)}></div>
        </div>
      );
    }
    
    // Mouth
    if (evolutionStage === 'mature' || evolutionStage === 'elder') {
      const mouthShape = mood === 'happy' ? '😊' : mood === 'sad' ? '😢' : '😐';
      features.push(
        <div key="mouth" className="text-xs">
          {mouthShape}
        </div>
      );
    }
    
    return features;
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* SCOBY Avatar */}
      <div className={cn(
        'relative flex items-center justify-center transition-all duration-500',
        getSizeClasses()
      )}>
        {/* Avatar Image */}
        <img
          src={scobyAvatarImage}
          alt={`SCOBY Avatar - ${getEvolutionLevel()} Stage`}
          className={cn(
            'w-full h-full object-contain transition-all duration-500',
            getAuraEffect(),
            // Add some visual effects based on mood
            avatar.mood === 'happy' ? 'brightness-110' : 
            avatar.mood === 'neutral' ? 'brightness-100' : 'brightness-75 opacity-80'
          )}
        />
        
        {/* Mood-based visual effects */}
        {avatar.mood === 'happy' && (
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            {/* Happy bubbles */}
            <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-green-300/70 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-3 left-4 w-1 h-1 bg-green-500/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            {/* Happy glow */}
            <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse"></div>
          </div>
        )}
        
        {avatar.mood === 'sad' && (
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {/* Sad dimming effect */}
            <div className="absolute inset-0 rounded-full bg-gray-500/20"></div>
          </div>
        )}
        
        {/* Level indicator for elder SCOBY */}
        {avatar.evolutionStage === 'elder' && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {avatar.level}
          </div>
        )}
        
        {/* Mood indicator for all avatars */}
        {!showStats && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs">
            <div className={`w-3 h-3 rounded-full ${
              avatar.mood === 'happy' ? 'bg-green-500 animate-pulse' :
              avatar.mood === 'neutral' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`} />
          </div>
        )}
      </div>
      
      {/* Stats Display */}
      {showStats && (
        <div className="mt-4 space-y-2 text-center">
          <div className="text-sm font-medium">
            Level {avatar.level} {getEvolutionLevel().charAt(0).toUpperCase() + getEvolutionLevel().slice(1)} SCOBY
          </div>
          
          {/* XP Bar */}
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(avatar.xp % avatar.xpToNextLevel) / avatar.xpToNextLevel * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600">
            {avatar.xp % avatar.xpToNextLevel} / {avatar.xpToNextLevel} XP
          </div>
          
          {/* Mood with visual indicator */}
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {getMoodEmoji()} {avatar.mood.charAt(0).toUpperCase() + avatar.mood.slice(1)}
            </div>
            <div className={`w-2 h-2 rounded-full ${
              avatar.mood === 'happy' ? 'bg-green-500 animate-pulse' :
              avatar.mood === 'neutral' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`} />
          </div>
          
          {/* Streak with visual progress */}
          <div className="w-full">
            {avatar.streakDays > 0 ? (
              <div className="space-y-1">
                <div className="text-xs text-blue-600 text-center">
                  🔥 {avatar.streakDays} day streak
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      avatar.mood === 'happy' ? 'bg-green-500' :
                      avatar.mood === 'neutral' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min((avatar.streakDays / 7) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center">
                Start your streak!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
