import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';
import { Batch, BatchFormData, F2Flavoring } from '@/types/batch';
import { useSettings } from '@/hooks/useSettings';

interface BatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: BatchFormData) => void;
  batch?: Batch; // For editing existing batches
  title?: string;
}

const TEA_TYPES = [
  'Black Tea',
  'Green Tea',
  'Oolong Tea',
  'White Tea',
  'Herbal Tea',
  'Rooibos',
  'Custom Blend'
];

const FLAVORING_TYPES = [
  'fruit',
  'syrup',
  'herb',
  'spice',
  'juice',
  'other'
];

export const BatchForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  batch, 
  title = 'New Batch' 
}: BatchFormProps) => {
  const { getBrewingDefaults } = useSettings();
  
  const [formData, setFormData] = useState<BatchFormData>({
    name: '',
    teaType: 'Black Tea',
    notes: '',
    targetDays: 7,
    f2TargetDays: 3,
    f2Flavorings: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name,
        teaType: batch.teaType,
        notes: batch.notes || '',
        targetDays: batch.targetDays,
        f2TargetDays: batch.f2TargetDays || 3,
        f2Flavorings: batch.f2Flavorings || [],
      });
    } else {
      // Only set defaults when opening a new batch form (not editing)
      const defaults = getBrewingDefaults();
      setFormData({
        name: '',
        teaType: defaults.defaultTeaType,
        notes: '',
        targetDays: defaults.defaultTargetDays,
        f2TargetDays: 3,
        f2Flavorings: [],
      });
    }
    setErrors({});
  }, [batch, isOpen, getBrewingDefaults]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Batch name is required';
    }

    if (formData.targetDays < 1 || formData.targetDays > 30) {
      newErrors.targetDays = 'Target days must be between 1 and 30';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof BatchFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addFlavoring = () => {
    const newFlavoring: F2Flavoring = {
      id: `flavoring-${Date.now()}`,
      name: '',
      type: 'fruit',
      amount: '',
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      f2Flavorings: [...(prev.f2Flavorings || []), newFlavoring]
    }));
  };

  const updateFlavoring = (id: string, field: keyof F2Flavoring, value: string) => {
    setFormData(prev => ({
      ...prev,
      f2Flavorings: prev.f2Flavorings?.map(flavoring =>
        flavoring.id === id ? { ...flavoring, [field]: value } : flavoring
      ) || []
    }));
  };

  const removeFlavoring = (id: string) => {
    setFormData(prev => ({
      ...prev,
      f2Flavorings: prev.f2Flavorings?.filter(flavoring => flavoring.id !== id) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Batch Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Summer Black Tea Batch"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teaType">Tea Type</Label>
              <Select
                value={formData.teaType}
                onValueChange={(value) => handleInputChange('teaType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tea type" />
                </SelectTrigger>
                <SelectContent>
                  {TEA_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDays">Target Brewing Days *</Label>
              <Input
                id="targetDays"
                type="number"
                min="1"
                max="30"
                value={formData.targetDays}
                onChange={(e) => handleInputChange('targetDays', parseInt(e.target.value) || 0)}
                className={errors.targetDays ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Typical kombucha ferments for 7-14 days
              </p>
              {errors.targetDays && (
                <p className="text-sm text-destructive">{errors.targetDays}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any special notes about this batch..."
                rows={3}
              />
            </div>

            {/* F2 Fermentation Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">F2 Fermentation (Optional)</h3>
                <Badge variant="secondary" className="text-xs">Secondary Fermentation</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Add flavorings like fruits, herbs, or syrups for a second fermentation phase.
              </p>

              <div className="space-y-2">
                <Label htmlFor="f2TargetDays">F2 Target Days</Label>
                <Input
                  id="f2TargetDays"
                  type="number"
                  min="1"
                  max="14"
                  value={formData.f2TargetDays || 3}
                  onChange={(e) => handleInputChange('f2TargetDays', parseInt(e.target.value) || 3)}
                />
                <p className="text-xs text-muted-foreground">
                  Typical F2 fermentation is 2-7 days
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

                {formData.f2Flavorings?.map((flavoring, index) => (
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

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="e.g., Fresh Strawberries"
                          value={flavoring.name}
                          onChange={(e) => updateFlavoring(flavoring.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={flavoring.type}
                          onValueChange={(value) => updateFlavoring(flavoring.id, 'type', value)}
                        >
                          <SelectTrigger>
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

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Amount</Label>
                        <Input
                          placeholder="e.g., 1 cup, 2 tbsp"
                          value={flavoring.amount}
                          onChange={(e) => updateFlavoring(flavoring.id, 'amount', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Notes (Optional)</Label>
                        <Input
                          placeholder="e.g., Diced, Grated"
                          value={flavoring.notes || ''}
                          onChange={(e) => updateFlavoring(flavoring.id, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!formData.f2Flavorings || formData.f2Flavorings.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No flavorings added yet. Click "Add Flavoring" to get started.
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {batch ? 'Update Batch' : 'Start Brewing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
