import { Check, Clock, Star, Thermometer, Camera, FlaskConical } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Quest } from "./Dashboard";

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
}

export const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (quest.icon) {
      case 'temperature':
        return <Thermometer className={iconClass} />;
      case 'photo':
        return <Camera className={iconClass} />;
      case 'taste':
        return <FlaskConical className={iconClass} />;
      case 'puzzle':
        return <Star className={iconClass} />;
      case 'run':
        return <Clock className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const getTypeColor = () => {
    switch (quest.type) {
      case 'CARE':
        return 'text-scoby-healthy';
      case 'PUZZLE':
        return 'text-primary';
      case 'RUN':
        return 'text-secondary-accent';
      default:
        return 'text-primary';
    }
  };

  const handleComplete = () => {
    if (quest.status === 'PENDING') {
      onComplete(quest.id);
    }
  };

  return (
    <Card className={`
      relative transition-all duration-300 hover:shadow-soft
      ${quest.status === 'DONE' ? 'bg-gradient-to-r from-scoby-healthy/5 to-transparent border-scoby-healthy/20' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`
              p-2 rounded-lg transition-colors duration-200
              ${quest.status === 'DONE' 
                ? 'bg-scoby-healthy/10 text-scoby-healthy' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {quest.status === 'DONE' ? (
                <Check className="w-5 h-5" />
              ) : (
                getIcon()
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`
                font-medium text-sm leading-tight mb-1
                ${quest.status === 'DONE' ? 'text-foreground/70 line-through' : 'text-foreground'}
              `}>
                {quest.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {quest.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-medium ${getTypeColor()}`}>
                  +{quest.rewardXP} XP
                </span>
                {quest.timeEstimate && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{quest.timeEstimate}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {quest.status === 'PENDING' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleComplete}
              className="ml-2 text-xs px-3 py-1 h-auto border-primary/20 hover:bg-primary hover:text-primary-foreground"
            >
              Do It
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};