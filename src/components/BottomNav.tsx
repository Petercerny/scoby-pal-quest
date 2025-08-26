import { Home, Beaker, Trophy, Settings, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNav = ({ activeTab = 'home', onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'batches', icon: Beaker, label: 'Batches' },
    { id: 'quests', icon: Trophy, label: 'Quests' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-soft z-50">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange?.(tab.id)}
              className={`
                flex flex-col items-center gap-1 h-14 px-2 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium leading-none">
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};