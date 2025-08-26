import { useEffect, useState } from "react";

interface HealthRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  label?: string;
}

export const HealthRing = ({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  animated = true, 
  label = "SCOBY Health" 
}: HealthRingProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  // Add pulse animation when health changes significantly
  const [shouldPulse, setShouldPulse] = useState(false);
  
  useEffect(() => {
    if (Math.abs(value - animatedValue) >= 5) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value, animatedValue]);

  const getHealthColor = () => {
    if (value >= 80) return 'stroke-scoby-healthy';
    if (value >= 60) return 'stroke-primary';
    if (value >= 40) return 'stroke-scoby-warning';
    return 'stroke-scoby-danger';
  };

  const getHealthText = () => {
    if (value >= 80) return 'Thriving';
    if (value >= 60) return 'Healthy';
    if (value >= 40) return 'Needs Care';
    return 'Critical';
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${shouldPulse ? 'health-pulse' : ''}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getHealthColor()} transition-all duration-1000 ease-out`}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <div className="text-xl font-bold text-foreground leading-none">
          {Math.round(animatedValue)}%
        </div>
        <div className="text-[10px] text-muted-foreground font-medium leading-tight mt-0.5">
          {getHealthText()}
        </div>
        {label && (
          <div className="text-[9px] text-muted-foreground mt-1 leading-tight max-w-[calc(100%-8px)]">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};