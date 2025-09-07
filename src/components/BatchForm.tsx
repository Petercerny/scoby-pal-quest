import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Batch, BatchFormData } from '@/types/batch';
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name,
        teaType: batch.teaType,
        notes: batch.notes || '',
        targetDays: batch.targetDays,
      });
    } else {
      // Only set defaults when opening a new batch form (not editing)
      const defaults = getBrewingDefaults();
      setFormData({
        name: '',
        teaType: defaults.defaultTeaType,
        notes: '',
        targetDays: defaults.defaultTargetDays,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
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
