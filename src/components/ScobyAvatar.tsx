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
    const { evolutionStage, health, mood } = avatar;
    
    // Base colors for each evolution stage
    const stageColors = {
      baby: {
        healthy: 'bg-pink-200 border-pink-300',
        neutral: 'bg-pink-100 border-pink-200',
        sad: 'bg-gray-200 border-gray-300',
        critical: 'bg-gray-100 border-gray-200'
      },
      growing: {
        healthy: 'bg-amber-200 border-amber-300',
        neutral: 'bg-amber-100 border-amber-200',
        sad: 'bg-gray-200 border-gray-300',
        critical: 'bg-gray-100 border-gray-200'
      },
      mature: {
        healthy: 'bg-yellow-200 border-yellow-300',
        neutral: 'bg-yellow-100 border-yellow-200',
        sad: 'bg-gray-200 border-gray-300',
        critical: 'bg-gray-100 border-gray-200'
      },
      elder: {
        healthy: 'bg-gradient-to-br from-yellow-200 to-amber-300 border-yellow-400',
        neutral: 'bg-gradient-to-br from-yellow-100 to-amber-200 border-yellow-300',
        sad: 'bg-gray-200 border-gray-300',
        critical: 'bg-gray-100 border-gray-200'
      }
    };

    return stageColors[evolutionStage][mood];
  };

  const getHealthPercentage = () => {
    return (avatar.health / avatar.maxHealth) * 100;
  };

  const getEvolutionLevel = () => {
    if (avatar.level <= 3) return 'baby';
    if (avatar.level <= 10) return 'growing';
    if (avatar.level <= 20) return 'mature';
    return 'elder';
  };

  const getMoodEmoji = () => {
    const { mood, health } = avatar;
    const healthPercentage = getHealthPercentage();
    
    if (healthPercentage < 20) return '😰'; // Critical
    if (healthPercentage < 50) return '😢'; // Sad
    if (mood === 'happy') return '😊';
    return '😐'; // Neutral
  };

  const getAuraEffect = () => {
    const { evolutionStage, health, currentSkin } = avatar;
    const healthPercentage = getHealthPercentage();
    
    if (healthPercentage < 20) return null; // No aura when critical
    
    const auraClasses = [];
    
    // Health-based aura - gentle hover effect instead of rapid pulse
    if (healthPercentage > 80) {
      auraClasses.push('hover:scale-105 transition-transform duration-1000 ease-in-out');
    }
    
    // Evolution-based aura
    if (evolutionStage === 'elder' && healthPercentage > 60) {
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
    const healthPercentage = getHealthPercentage();
    
    // Only show features if health is above 30%
    if (healthPercentage < 30) return null;
    
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
            // Add some visual effects based on health and mood
            getHealthPercentage() > 70 ? 'brightness-110' : 
            getHealthPercentage() > 40 ? 'brightness-100' : 'brightness-75 opacity-80'
          )}
        />
        
        {/* Bubbles effect for healthy SCOBY - gentle floating instead of rapid pinging */}
        {getHealthPercentage() > 70 && (
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-white/50 rounded-full float-slow"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-white/60 rounded-full float-medium"></div>
            <div className="absolute bottom-3 left-4 w-1 h-1 bg-white/45 rounded-full float-slower"></div>
          </div>
        )}
        
        {/* Level indicator for elder SCOBY */}
        {avatar.evolutionStage === 'elder' && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {avatar.level}
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
          
          {/* Health Bar */}
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                'h-2 rounded-full transition-all duration-500',
                getHealthPercentage() > 70 ? 'bg-green-500' :
                getHealthPercentage() > 40 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${getHealthPercentage()}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600">
            {avatar.health} / {avatar.maxHealth} Health
          </div>
          
          {/* Mood */}
          <div className="text-sm">
            {getMoodEmoji()} {avatar.mood.charAt(0).toUpperCase() + avatar.mood.slice(1)}
          </div>
          
          {/* Streak */}
          {avatar.streakDays > 0 && (
            <div className="text-xs text-blue-600">
              🔥 {avatar.streakDays} day streak
            </div>
          )}
        </div>
      )}
    </div>
  );
};
