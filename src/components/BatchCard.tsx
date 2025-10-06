import { format, differenceInDays, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  Wine, 
  Archive,
  ArchiveRestore,
  Edit3,
  Sparkles,
  FlaskConical,
  Calendar
} from 'lucide-react';
import { Batch } from '@/types/batch';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BatchCardProps {
  batch: Batch;
  onStatusUpdate: (batchId: string, status: Batch['status']) => void;
  onArchive: (batchId: string) => void;
  onUnarchive?: (batchId: string) => void;
  onDelete: (batchId: string) => void;
  onEdit?: (batch: Batch) => void;
  onStartF2?: (batch: Batch) => void;
}

export const BatchCard = ({ 
  batch, 
  onStatusUpdate, 
  onArchive, 
  onUnarchive,
  onDelete,
  onEdit,
  onStartF2
}: BatchCardProps) => {
  // Calculate current day dynamically
  const getCurrentDay = (startDate: Date): number => {
    const today = startOfDay(new Date());
    const start = startOfDay(startDate);
    const days = differenceInDays(today, start);
    return Math.max(0, days + 1); // +1 because day 1 is the start date
  };

  // Calculate current F2 day dynamically
  const getF2CurrentDay = (f2StartDate: Date): number => {
    const today = startOfDay(new Date());
    const start = startOfDay(f2StartDate);
    const days = differenceInDays(today, start);
    return Math.max(0, days + 1); // +1 because day 1 is the start date
  };

  // Get the actual current day for this batch
  const currentDay = getCurrentDay(batch.startDate);
  const f2CurrentDay = batch.f2StartDate ? getF2CurrentDay(batch.f2StartDate) : undefined;
  const getStatusColor = (status: Batch['status']) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';      case 'brewing': return 'bg-primary text-primary-foreground';
      case 'ready': return 'bg-scoby-healthy text-white';
      case 'f2_brewing': return 'bg-purple-600 hover:bg-purple-500 text-white';
      case 'f2_ready': return 'bg-purple-500 hover:bg-purple-400 text-white';
      case 'bottled': return 'bg-secondary text-secondary-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Batch['status']) => {
    switch (status) {
      case 'planned': return <Calendar className="w-4 h-4" />;
      case 'brewing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'f2_brewing': return <FlaskConical className="w-4 h-4" />;
      case 'f2_ready': return <Sparkles className="w-4 h-4" />;
      case 'bottled': return <Wine className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusDisplayText = (status: Batch['status']) => {
    switch (status) {
      case 'planned': return 'Planned';
      case 'brewing': return 'Brewing';
      case 'ready': return 'Ready';
      case 'f2_brewing': return 'F2 Brewing';
      case 'f2_ready': return 'F2 Ready';
      case 'bottled': return 'Bottled';
      case 'archived': return 'Archived';
      default: return status;
    }
  };

  const getProgressPercentage = () => {
    if (batch.status === 'planned') {
      return 0; // Planned batches always show 0% progress
    }
    if (batch.status === 'brewing') {
      // If the batch hasn't started yet (future start date), show 0% progress
      const today = new Date();
      const startDate = new Date(batch.startDate);
      if (today < startDate) {
        return 0;
      }
      return Math.min((currentDay / batch.targetDays) * 100, 100);
    }
    if (batch.status === 'f2_brewing' && f2CurrentDay && batch.f2TargetDays) {
      // If F2 hasn't started yet (future start date), show 0% progress
      const today = new Date();
      const f2StartDate = batch.f2StartDate ? new Date(batch.f2StartDate) : null;
      if (f2StartDate && today < f2StartDate) {
        return 0;
      }
      return Math.min((f2CurrentDay / batch.f2TargetDays) * 100, 100);
    }
    return 100;
  };

  const getDaysText = () => {
    if (batch.status === 'planned') {
      const today = new Date();
      const startDate = new Date(batch.startDate);
      const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}`;
    }
    if (batch.status === 'brewing') {
      const today = new Date();
      const startDate = new Date(batch.startDate);
      if (today < startDate) {
        const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return `Starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}`;
      }
      return `F1 Day ${currentDay} of ${batch.targetDays}`;
    }
    if (batch.status === 'f2_brewing' && f2CurrentDay && batch.f2TargetDays) {
      const today = new Date();
      const f2StartDate = batch.f2StartDate ? new Date(batch.f2StartDate) : null;
      if (f2StartDate && today < f2StartDate) {
        const daysUntilStart = Math.ceil((f2StartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return `F2 starts in ${daysUntilStart} day${daysUntilStart === 1 ? '' : 's'}`;
      }
      return `F2 Day ${f2CurrentDay} of ${batch.f2TargetDays}`;
    }
    if (batch.status === 'ready') {
      return `F1 Complete (${currentDay} days)`;
    }
    if (batch.status === 'f2_ready') {
      return `F2 Complete (${f2CurrentDay} days)`;
    }
    return `Brewed for ${currentDay} days`;
  };

  const getNextAction = () => {
    if (batch.status === 'brewing' && currentDay >= batch.targetDays) {
      return (
        <Button 
          size="sm" 
          className="w-full mt-2"
          onClick={() => onStatusUpdate(batch.id, 'ready')}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          F1 Complete - Ready for F2
        </Button>
      );
    }
    if (batch.status === 'ready') {
      return (
        <div className="space-y-2 mt-2">
          {onStartF2 && (
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => onStartF2(batch)}
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Start F2 Fermentation
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            className="w-full"
            onClick={() => onStatusUpdate(batch.id, 'bottled')}
          >
            <Wine className="w-4 h-4 mr-2" />
            Skip F2 - Bottle Now
          </Button>
        </div>
      );
    }
    if (batch.status === 'f2_brewing' && f2CurrentDay && batch.f2TargetDays && f2CurrentDay >= batch.f2TargetDays) {
      return (
        <Button 
          size="sm" 
          className="w-full mt-2"
          onClick={() => onStatusUpdate(batch.id, 'f2_ready')}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          F2 Complete - Ready to Bottle
        </Button>
      );
    }
    if (batch.status === 'f2_ready') {
      return (
        <Button 
          size="sm" 
          variant="outline"
          className="w-full mt-2"
          onClick={() => onStatusUpdate(batch.id, 'bottled')}
        >
          <Wine className="w-4 h-4 mr-2" />
          Mark as Bottled
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{batch.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {batch.teaType}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(batch.status)}`}>
                {getStatusIcon(batch.status)}
                <span className="ml-1">{getStatusDisplayText(batch.status)}</span>
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && batch.status !== 'archived' && (
                <DropdownMenuItem onClick={() => onEdit(batch)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Batch
                </DropdownMenuItem>
              )}
              {batch.status !== 'archived' && (
                <DropdownMenuItem onClick={() => onArchive(batch.id)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              )}
              {batch.status === 'archived' && onUnarchive && (
                <DropdownMenuItem onClick={() => onUnarchive(batch.id)}>
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Unarchive
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(batch.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {batch.status === 'planned' || (batch.status === 'brewing' && new Date() < new Date(batch.startDate))
                ? `Planned for: ${format(batch.startDate, 'MMM d, yyyy')}`
                : `Started: ${format(batch.startDate, 'MMM d, yyyy')}`
              }
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getDaysText()}
            </span>
          </div>
          
          {(batch.status === 'planned' || batch.status === 'brewing' || batch.status === 'f2_brewing') && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {batch.status === 'planned' ? 'Planned Progress' : 
                   batch.status === 'brewing' ? 'F1 Progress' : 'F2 Progress'}
                </span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
          
          {/* Tea and Sugar Information */}
          {(batch.teaAmount || batch.sugarAmount) && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Ingredients:</div>
              <div className="flex flex-wrap gap-2">
                {batch.teaAmount && (
                  <Badge variant="outline" className="text-xs">
                    Tea: {batch.teaAmount} {batch.teaAmountType}
                  </Badge>
                )}
                {batch.sugarAmount && (
                  <Badge variant="outline" className="text-xs">
                    Sugar: {batch.sugarAmount} {batch.sugarAmountType}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {batch.notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
              {batch.notes}
            </p>
          )}

          {batch.f2Flavorings && batch.f2Flavorings.length > 0 && (
            (() => {
              const validFlavorings = batch.f2Flavorings.filter(
                flavoring => flavoring.name && flavoring.name.trim() !== ''
              );
              
              if (validFlavorings.length === 0) return null;
              
              return (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">F2 Flavorings:</div>
                  <div className="flex flex-wrap gap-1">
                    {validFlavorings.map((flavoring) => (
                      <Badge key={flavoring.id} variant="secondary" className="text-xs">
                        {flavoring.name}{flavoring.amount && flavoring.amount.trim() !== '' ? ` (${flavoring.amount})` : ''}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })()
          )}
          
          {getNextAction()}
        </div>
      </CardContent>
    </Card>
  );
};
