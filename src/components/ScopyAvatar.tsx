import { useState, useEffect } from "react";
import scobyImage from "@/assets/scoby-avatar.png";

interface ScopyAvatarProps {
  health: number; // 0-100
  mood: 'happy' | 'neutral' | 'concerned' | 'worried' | 'sick';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ScopyAvatar = ({ 
  health, 
  mood, 
  size = 'md', 
  animated = true 
}: ScopyAvatarProps) => {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    if (animated) {
      setIsFloating(true);
    }
  }, [animated]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'happy':
        return 'drop-shadow-lg shadow-scoby-healthy';
      case 'neutral':
        return 'drop-shadow-md shadow-primary';
      case 'concerned':
        return 'drop-shadow-md shadow-scoby-warning';
      case 'worried':
        return 'drop-shadow-md shadow-scoby-warning';
      case 'sick':
        return 'drop-shadow-md shadow-scoby-danger';
      default:
        return 'drop-shadow-md shadow-primary';
    }
  };

  const getHealthGlow = () => {
    if (health > 80) return 'shadow-scoby-healthy/30';
    if (health > 60) return 'shadow-primary/20';
    if (health > 40) return 'shadow-scoby-warning/25';
    return 'shadow-scoby-danger/25';
  };

  // Calculate opacity based on health - higher health = more visible image
  const getHealthOpacity = () => {
    // At 100% health: opacity = 1.0 (fully visible)
    // At 0% health: opacity = 0.3 (very faded)
    return 0.3 + (health / 100) * 0.7;
  };

  // Calculate image scale based on health - higher health = larger image
  const getHealthScale = () => {
    // At 100% health: scale = 1.0 (full size)
    // At 0% health: scale = 0.7 (smaller)
    return 0.7 + (health / 100) * 0.3;
  };

  return (
    <div className="relative">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${getMoodColor()} 
          ${getHealthGlow()}
          ${isFloating ? 'animate-float' : ''}
          relative rounded-full p-2 transition-all duration-10
        `}
        style={{ 
          filter: `brightness(${0.8 + (health / 500)}) saturate(${0.7 + (health / 300)})` 
        }}
      >
        <img 
          src={scobyImage} 
          alt="Your SCOBY companion" 
          className="w-full h-full object-contain rounded-full transition-all duration-500"
          style={{
            opacity: getHealthOpacity(),
            transform: `scale(${getHealthScale()})`,
          }}
        />
        
        {/* Health indicator ring - now shows the opposite of what it used to */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent">
          <div 
            className="absolute inset-0 rounded-full border-2 border-scoby-healthy transition-all duration-700"
            style={{
              background: `conic-gradient(
                hsl(var(--scoby-healthy)) 0deg, 
                hsl(var(--scoby-healthy)) ${(100 - health) * 3.6}deg, 
                transparent ${(100 - health) * 3.6}deg, 
                transparent 360deg
              )`
            }}
          />
        </div>

        {/* Mood indicators */}
        {mood === 'happy' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-scoby-healthy rounded-full flex items-center justify-center text-xs">
            ✨
          </div>
        )}
        
        {mood === 'concerned' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-scoby-warning rounded-full flex items-center justify-center text-xs">
            ⚠️
          </div>
        )}
        
        {mood === 'worried' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-scoby-warning rounded-full flex items-center justify-center text-xs">
            😰
          </div>
        )}
        
        {mood === 'sick' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-scoby-danger rounded-full flex items-center justify-center text-xs">
            😷
          </div>
        )}
      </div>
    </div>
  );
};