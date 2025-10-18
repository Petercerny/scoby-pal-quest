import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  FlaskConical, 
  Plus, 
  Eye, 
  Clock, 
  Sparkles,
  ArrowRight,
  Calendar,
  Droplets
} from "lucide-react";
import { Batch } from "@/types/batch";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { F2StartForm } from "./F2StartForm";

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  batchId?: string;
  batchName?: string;
  onClick: () => void;
}

interface SmartSuggestionsPanelProps {
  batches: Batch[];
  onUpdateBatchStatus: (batchId: string, status: Batch['status']) => void;
  onStartF2Fermentation: (batchId: string, f2TargetDays: number, f2Flavorings: any[]) => void;
  onCreateBatch: () => void;
}


export const SmartSuggestionsPanel = ({ 
  batches, 
  onUpdateBatchStatus, 
  onStartF2Fermentation,
  onCreateBatch 
}: SmartSuggestionsPanelProps) => {
  const [showF2Form, setShowF2Form] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  
  // Generate smart suggestions based on batch states
  const generateSuggestions = (): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    const activeBatches = batches.filter(b => b.isActive);
    
    // Check for batches ready to bottle (F1 complete)
    const f1ReadyBatches = activeBatches.filter(batch => 
      batch.status === 'brewing' && batch.currentDay >= batch.targetDays
    );
    
    f1ReadyBatches.forEach(batch => {
      suggestions.push({
        id: `bottle-f1-${batch.id}`,
        title: "Bottle F1 Batch",
        description: `${batch.name} is ready for bottling!`,
        action: "Mark as Ready",
        icon: <FlaskConical className="w-4 h-4" />,
        priority: 'high',
        batchId: batch.id,
        batchName: batch.name,
        onClick: () => onUpdateBatchStatus(batch.id, 'ready')
      });
    });
    
    // Check for F2 batches ready to bottle
    const f2ReadyBatches = activeBatches.filter(batch => 
      batch.status === 'f2_brewing' && 
      batch.f2CurrentDay && 
      batch.f2TargetDays && 
      batch.f2CurrentDay >= batch.f2TargetDays
    );
    
    f2ReadyBatches.forEach(batch => {
      suggestions.push({
        id: `bottle-f2-${batch.id}`,
        title: "Bottle F2 Batch",
        description: `${batch.name} F2 fermentation is complete!`,
        action: "Mark F2 as Ready",
        icon: <FlaskConical className="w-4 h-4" />,
        priority: 'high',
        batchId: batch.id,
        batchName: batch.name,
        onClick: () => onUpdateBatchStatus(batch.id, 'f2_ready')
      });
    });
    
    // Check for ready batches that need F2 fermentation
    const readyForF2Batches = activeBatches.filter(batch => 
      batch.status === 'ready' && !batch.f2StartDate
    );
    
    readyForF2Batches.forEach(batch => {
      suggestions.push({
        id: `start-f2-${batch.id}`,
        title: "Start F2 Fermentation",
        description: `${batch.name} is ready for second fermentation`,
        action: "Start F2",
        icon: <Droplets className="w-4 h-4" />,
        priority: 'medium',
        batchId: batch.id,
        batchName: batch.name,
        onClick: () => onStartF2Fermentation(batch.id, 3, []) // Default 3 days, empty flavorings
      });
    });
    
    // Check for batches that need taste testing (approaching target days)
    const tasteTestBatches = activeBatches.filter(batch => 
      batch.status === 'brewing' && 
      batch.currentDay >= batch.targetDays - 1 && 
      batch.currentDay < batch.targetDays
    );
    
    tasteTestBatches.forEach(batch => {
      suggestions.push({
        id: `taste-test-${batch.id}`,
        title: "Taste Test",
        description: `${batch.name} is almost ready - time to taste test!`,
        action: "Test Now",
        icon: <Eye className="w-4 h-4" />,
        priority: 'medium',
        batchId: batch.id,
        batchName: batch.name,
        onClick: () => {
          // For now, just mark as ready. In a real app, this might open a taste test modal
          onUpdateBatchStatus(batch.id, 'ready');
        }
      });
    });
    
    // Check for planned batches starting today
    const startingTodayBatches = activeBatches.filter(batch => {
      if (batch.status !== 'planned') return false;
      const today = new Date();
      const startDate = new Date(batch.startDate);
      return startDate.toDateString() === today.toDateString();
    });
    
    startingTodayBatches.forEach(batch => {
      suggestions.push({
        id: `start-brewing-${batch.id}`,
        title: "Start Brewing",
        description: `${batch.name} is scheduled to start today!`,
        action: "Begin Brewing",
        icon: <Calendar className="w-4 h-4" />,
        priority: 'medium',
        batchId: batch.id,
        batchName: batch.name,
        onClick: () => onUpdateBatchStatus(batch.id, 'brewing')
      });
    });
    
    // If no active batches, suggest creating one
    if (activeBatches.length === 0) {
      suggestions.push({
        id: 'create-batch',
        title: "Start Your First Batch",
        description: "Begin your kombucha brewing journey!",
        action: "Create Batch",
        icon: <Plus className="w-4 h-4" />,
        priority: 'high',
        onClick: onCreateBatch
      });
    }
    
    // If only planned batches exist, suggest creating more
    const onlyPlannedBatches = activeBatches.length > 0 && 
      activeBatches.every(batch => batch.status === 'planned');
    
    if (onlyPlannedBatches) {
      suggestions.push({
        id: 'create-active-batch',
        title: "Start Active Brewing",
        description: "Create a batch to start brewing today!",
        action: "Create Batch",
        icon: <Plus className="w-4 h-4" />,
        priority: 'medium',
        onClick: onCreateBatch
      });
    }
    
    // Sort by priority and return top 3
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  };
  
  const suggestions = generateSuggestions();
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <>
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          Do This Next
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Smart suggestions based on your batch progress
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const batch = suggestion.batchId ? batches.find(b => b.id === suggestion.batchId) : null;
          const isF2Suggestion = suggestion.id.startsWith('start-f2-');
          
          return (
            <div 
              key={suggestion.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-full shrink-0 ${
                  suggestion.priority === 'high' 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : suggestion.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {suggestion.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{suggestion.title}</div>
                  <div className="text-xs text-muted-foreground break-words">
                    {suggestion.description}
                  </div>
                  {suggestion.batchName && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {suggestion.batchName}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-end sm:justify-start">
                {isF2Suggestion && batch ? (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedBatch(batch);
                      setShowF2Form(true);
                    }}
                    className="text-xs h-8 px-2 sm:px-3 w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">{suggestion.action}</span>
                    <span className="sm:hidden">
                      {suggestion.action.length > 12 
                        ? suggestion.action.split(' ')[0] 
                        : suggestion.action
                      }
                    </span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={suggestion.onClick}
                    className="text-xs h-8 px-2 sm:px-3 w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">{suggestion.action}</span>
                    <span className="sm:hidden">
                      {suggestion.action.length > 12 
                        ? suggestion.action.split(' ')[0] 
                        : suggestion.action
                      }
                    </span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {suggestions.length > 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            💡 Suggestions update based on your batch progress
          </div>
        )}
      </CardContent>
    </Card>
    
    {/* F2 Start Form Modal */}
    {selectedBatch && (
      <F2StartForm
        isOpen={showF2Form}
        onClose={() => {
          setShowF2Form(false);
          setSelectedBatch(null);
        }}
        onSubmit={(f2TargetDays, f2Flavorings) => {
          onStartF2Fermentation(selectedBatch.id, f2TargetDays, f2Flavorings);
          setShowF2Form(false);
          setSelectedBatch(null);
        }}
        batch={selectedBatch}
      />
    )}
    </>
  );
};
