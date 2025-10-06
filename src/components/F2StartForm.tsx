import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2, FlaskConical } from 'lucide-react';
import { Batch, F2Flavoring } from '@/types/batch';

interface F2StartFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (f2TargetDays: number, f2Flavorings: F2Flavoring[]) => void;
  batch: Batch;
}

const FLAVORING_TYPES = [
  'fruit',
  'syrup',
  'herb',
  'spice',
  'juice',
  'other'
];

export const F2StartForm = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  batch
}: F2StartFormProps) => {
  const [f2TargetDays, setF2TargetDays] = useState(3);
  const [f2Flavorings, setF2Flavorings] = useState<F2Flavoring[]>([]);

  useEffect(() => {
    if (batch.f2TargetDays) {
      setF2TargetDays(batch.f2TargetDays);
    }
    if (batch.f2Flavorings) {
      setF2Flavorings(batch.f2Flavorings);
    }
  }, [batch]);

  const addFlavoring = () => {
    const newFlavoring: F2Flavoring = {
      id: `flavoring-${Date.now()}`,
      name: '',
      type: 'fruit',
      amount: '',
      notes: '',
    };
    setF2Flavorings(prev => [...prev, newFlavoring]);
  };

  const updateFlavoring = (id: string, field: keyof F2Flavoring, value: string) => {
    setF2Flavorings(prev =>
      prev.map(flavoring =>
        flavoring.id === id ? { ...flavoring, [field]: value } : flavoring
      )
    );
  };

  const removeFlavoring = (id: string) => {
    setF2Flavorings(prev => prev.filter(flavoring => flavoring.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(f2TargetDays, f2Flavorings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }}
    >
      <Card 
        className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FlaskConical className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <CardTitle className="text-lg truncate">Start F2 Fermentation</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto flex-1">
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium truncate">{batch.name}</div>
            <div className="text-xs text-muted-foreground">
              F1 Complete - Ready for secondary fermentation
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="f2TargetDays">F2 Target Days *</Label>
              <Input
                id="f2TargetDays"
                type="number"
                min="1"
                max="14"
                value={f2TargetDays}
                onChange={(e) => setF2TargetDays(parseInt(e.target.value) || 3)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Typical F2 fermentation is 2-7 days. Shorter for carbonation, longer for flavor development.
              </p>
            </div>

            {/* F2 Flavorings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>F2 Flavorings</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFlavoring}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Flavoring
                </Button>
              </div>

              {f2Flavorings.map((flavoring, index) => (
                <div key={flavoring.id} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Flavoring {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFlavoring(flavoring.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="e.g., Fresh Strawberries"
                        value={flavoring.name}
                        onChange={(e) => updateFlavoring(flavoring.id, 'name', e.target.value)}
                        className="min-w-0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={flavoring.type}
                        onValueChange={(value) => updateFlavoring(flavoring.id, 'type', value)}
                      >
                        <SelectTrigger className="min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FLAVORING_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Amount</Label>
                      <Input
                        placeholder="e.g., 1 cup, 2 tbsp"
                        value={flavoring.amount}
                        onChange={(e) => updateFlavoring(flavoring.id, 'amount', e.target.value)}
                        className="min-w-0"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Notes (Optional)</Label>
                      <Input
                        placeholder="e.g., Diced, Grated"
                        value={flavoring.notes || ''}
                        onChange={(e) => updateFlavoring(flavoring.id, 'notes', e.target.value)}
                        className="min-w-0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {f2Flavorings.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No flavorings added yet. You can add fruits, herbs, syrups, or other flavorings.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 order-2 sm:order-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 order-1 sm:order-2">
                <FlaskConical className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Start F2 Fermentation</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

