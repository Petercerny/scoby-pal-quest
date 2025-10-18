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
        className="w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FlaskConical className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <CardTitle className="text-lg truncate">Start F2 Fermentation</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto flex-1">
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium truncate">{batch.name}</div>
            <div className="text-xs text-muted-foreground">
              F1 Complete - Ready for F2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                Typical F2 fermentation is 2-7 days.
              </p>
            </div>

            {/* F2 Flavorings */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">F2 Flavorings</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFlavoring}
                  className="text-xs h-7 px-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>

              {f2Flavorings.map((flavoring, index) => (
                <div key={flavoring.id} className="p-2 sm:p-3 border rounded-lg space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium">Flavoring {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFlavoring(flavoring.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="e.g., Strawberries"
                        value={flavoring.name}
                        onChange={(e) => updateFlavoring(flavoring.id, 'name', e.target.value)}
                        className="min-w-0 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={flavoring.type}
                        onValueChange={(value) => updateFlavoring(flavoring.id, 'type', value)}
                      >
                        <SelectTrigger className="min-w-0 text-sm">
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
                        placeholder="e.g., 1 cup"
                        value={flavoring.amount}
                        onChange={(e) => updateFlavoring(flavoring.id, 'amount', e.target.value)}
                        className="min-w-0 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Notes (Optional)</Label>
                      <Input
                        placeholder="e.g., Diced"
                        value={flavoring.notes || ''}
                        onChange={(e) => updateFlavoring(flavoring.id, 'notes', e.target.value)}
                        className="min-w-0 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {f2Flavorings.length === 0 && (
                <div className="text-center py-2 sm:py-4 text-muted-foreground text-xs sm:text-sm">
                  No flavorings added yet. Add fruits, herbs, syrups, or other flavorings.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1 sm:pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 order-2 sm:order-1 h-9 sm:h-10">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 order-1 sm:order-2 h-9 sm:h-10">
                <FlaskConical className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate text-sm sm:text-base">Start F2 Fermentation</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

