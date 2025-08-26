import { format } from 'date-fns';
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
  Edit3
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
  onDelete: (batchId: string) => void;
  onEdit?: (batch: Batch) => void;
}

export const BatchCard = ({ 
  batch, 
  onStatusUpdate, 
  onArchive, 
  onDelete,
  onEdit 
}: BatchCardProps) => {
  const getStatusColor = (status: Batch['status']) => {
    switch (status) {
      case 'brewing': return 'bg-primary text-primary-foreground';
      case 'ready': return 'bg-scoby-healthy text-white';
      case 'bottled': return 'bg-secondary text-secondary-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Batch['status']) => {
    switch (status) {
      case 'brewing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'bottled': return <Wine className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = () => {
    if (batch.status !== 'brewing') return 100;
    return Math.min((batch.currentDay / batch.targetDays) * 100, 100);
  };

  const getDaysText = () => {
    if (batch.status === 'brewing') {
      return `Day ${batch.currentDay} of ${batch.targetDays}`;
    }
    return `Brewed for ${batch.currentDay} days`;
  };

  const getNextAction = () => {
    if (batch.status === 'brewing' && batch.currentDay >= batch.targetDays) {
      return (
        <Button 
          size="sm" 
          className="w-full mt-2"
          onClick={() => onStatusUpdate(batch.id, 'ready')}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Ready to Bottle
        </Button>
      );
    }
    if (batch.status === 'ready') {
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
                <span className="ml-1 capitalize">{batch.status}</span>
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
              {onEdit && (
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
            <span>Started: {format(batch.startDate, 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getDaysText()}
            </span>
          </div>
          
          {batch.status === 'brewing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
          
          {batch.notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
              {batch.notes}
            </p>
          )}
          
          {getNextAction()}
        </div>
      </CardContent>
    </Card>
  );
};
