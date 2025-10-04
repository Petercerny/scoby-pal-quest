import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Plus, Trash2, Calendar as CalendarIcon, ToggleLeft, ToggleRight, ChevronDown, ChevronRight } from 'lucide-react';
import { format, addDays, differenceInDays, startOfDay } from 'date-fns';
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
  
  const [formData, setFormData] = useState<BatchFormData>(() => {
    const baseDate = startOfDay(new Date());
    return {
      name: '',
      teaType: 'Black Tea',
      notes: '',
      targetDays: 7,
      useDateRange: false,
      startDate: baseDate,
      endDate: addDays(baseDate, 7),
      f2TargetDays: 3,
      f2Flavorings: [],
      teaAmount: '',
      teaAmountType: 'bags',
      sugarAmount: '',
      sugarAmountType: 'cups',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTeaSugarDetails, setShowTeaSugarDetails] = useState(false);

  useEffect(() => {
    if (batch) {
      setFormData({
        name: batch.name,
        teaType: batch.teaType,
        notes: batch.notes || '',
        targetDays: batch.targetDays,
        useDateRange: false, // Default to days mode for existing batches
        startDate: batch.startDate,
        endDate: addDays(batch.startDate, batch.targetDays),
        f2TargetDays: batch.f2TargetDays || 3,
        f2Flavorings: batch.f2Flavorings || [],
        teaAmount: batch.teaAmount || '',
        teaAmountType: batch.teaAmountType || 'bags',
        sugarAmount: batch.sugarAmount || '',
        sugarAmountType: batch.sugarAmountType || 'cups',
      });
    } else {
      // Only set defaults when opening a new batch form (not editing)
      const defaults = getBrewingDefaults();
      const baseDate = startOfDay(new Date());
      setFormData({
        name: '',
        teaType: defaults.defaultTeaType,
        notes: '',
        targetDays: defaults.defaultTargetDays,
        useDateRange: false,
        startDate: baseDate,
        endDate: addDays(baseDate, defaults.defaultTargetDays),
        f2TargetDays: 3,
        f2Flavorings: [],
        teaAmount: '',
        teaAmountType: 'bags',
        sugarAmount: '',
        sugarAmountType: 'cups',
      });
    }
    setErrors({});
  }, [batch, isOpen, getBrewingDefaults]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Batch name is required';
    }

    if (formData.useDateRange) {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      }
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
      if (formData.startDate && formData.endDate) {
        const daysDiff = differenceInDays(formData.endDate, formData.startDate);
        if (daysDiff < 1 || daysDiff > 30) {
          newErrors.endDate = 'Brewing period must be between 1 and 30 days';
        }
      }
    } else {
      if (formData.targetDays < 1 || formData.targetDays > 30) {
        newErrors.targetDays = 'Target days must be between 1 and 30';
      }
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

  const handleInputChange = (field: keyof BatchFormData, value: string | number | boolean | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleInputMode = () => {
    const newUseDateRange = !formData.useDateRange;
    setFormData(prev => {
      if (newUseDateRange) {
        // Switching to date range mode - calculate dates from targetDays
        const baseDate = startOfDay(new Date());
        const endDate = addDays(baseDate, prev.targetDays);
        return { ...prev, useDateRange: true, startDate: baseDate, endDate };
      } else {
        // Switching to days mode - calculate targetDays from date range
        const targetDays = prev.startDate && prev.endDate 
          ? differenceInDays(prev.endDate, prev.startDate) 
          : 7;
        return { ...prev, useDateRange: false, targetDays };
      }
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (!date) return;
    
    setFormData(prev => {
      // Normalize the date to start of day to avoid timezone issues
      const normalizedDate = startOfDay(date);
      const newData = { ...prev, [field]: normalizedDate };
      
      // If changing start date, update end date to maintain target days
      if (field === 'startDate' && prev.endDate) {
        const daysDiff = differenceInDays(prev.endDate, prev.startDate);
        newData.endDate = addDays(normalizedDate, daysDiff);
      }
      
      // If changing end date, update target days
      if (field === 'endDate' && prev.startDate) {
        newData.targetDays = differenceInDays(normalizedDate, prev.startDate);
      }
      
      return newData;
    });
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-md max-h-[95vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
          <CardTitle className="text-lg truncate pr-2">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto flex-1">
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

            {/* Tea and Sugar Details Section */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTeaSugarDetails(!showTeaSugarDetails)}
                className="w-full justify-start"
              >
                <span className="flex items-center gap-2">
                  {showTeaSugarDetails ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Tea & Sugar Details (Optional)
                </span>
              </Button>

              {showTeaSugarDetails && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teaAmount">Tea Amount</Label>
                      <div className="flex gap-2">
                        <Input
                          id="teaAmount"
                          value={formData.teaAmount || ''}
                          onChange={(e) => handleInputChange('teaAmount', e.target.value)}
                          placeholder="e.g., 4"
                          className="flex-1 min-w-0"
                        />
                        <Select
                          value={formData.teaAmountType || 'bags'}
                          onValueChange={(value) => handleInputChange('teaAmountType', value)}
                        >
                          <SelectTrigger className="w-20 sm:w-24 flex-shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bags">bags</SelectItem>
                            <SelectItem value="grams">g</SelectItem>
                            <SelectItem value="tbsp">tbsp</SelectItem>
                            <SelectItem value="cups">cups</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sugarAmount">Sugar Amount</Label>
                      <div className="flex gap-2">
                        <Input
                          id="sugarAmount"
                          value={formData.sugarAmount || ''}
                          onChange={(e) => handleInputChange('sugarAmount', e.target.value)}
                          placeholder="e.g., 1"
                          className="flex-1 min-w-0"
                        />
                        <Select
                          value={formData.sugarAmountType || 'cups'}
                          onValueChange={(value) => handleInputChange('sugarAmountType', value)}
                        >
                          <SelectTrigger className="w-20 sm:w-24 flex-shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cups">cups</SelectItem>
                            <SelectItem value="grams">g</SelectItem>
                            <SelectItem value="tbsp">tbsp</SelectItem>
                            <SelectItem value="tsp">tsp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Typical kombucha uses 4-8 tea bags or 8-16g loose tea per gallon, and 1 cup sugar per gallon.
                  </p>
                </div>
              )}
            </div>

            {/* Brewing Duration Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Brewing Duration *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleInputMode}
                  className="flex items-center gap-2"
                >
                  {formData.useDateRange ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Date Range
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Days Count
                    </>
                  )}
                </Button>
              </div>

              {formData.useDateRange ? (
                // Date Range Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!formData.startDate ? 'text-muted-foreground' : ''} ${errors.startDate ? 'border-destructive' : ''}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {formData.startDate ? format(formData.startDate, 'MMM d, yyyy') : 'Pick start date'}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => handleDateChange('startDate', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.startDate && (
                        <p className="text-sm text-destructive">{errors.startDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!formData.endDate ? 'text-muted-foreground' : ''} ${errors.endDate ? 'border-destructive' : ''}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {formData.endDate ? format(formData.endDate, 'MMM d, yyyy') : 'Pick end date'}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => handleDateChange('endDate', date)}
                            disabled={(date) => formData.startDate ? date <= formData.startDate : false}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.endDate && (
                        <p className="text-sm text-destructive">{errors.endDate}</p>
                      )}
                    </div>
                  </div>
                  
                  {formData.startDate && formData.endDate && (
                    <div className="p-3 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>{differenceInDays(formData.endDate, formData.startDate)} days</strong> of brewing
                        {formData.startDate && (
                          <span className="block mt-1">
                            From {format(formData.startDate, 'MMM d, yyyy')} to {format(formData.endDate, 'MMM d, yyyy')}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Days Count Mode
                <div className="space-y-2">
                  <Input
                    id="targetDays"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.targetDays}
                    onChange={(e) => handleInputChange('targetDays', parseInt(e.target.value) || 0)}
                    className={errors.targetDays ? 'border-destructive' : ''}
                    placeholder="Enter number of days"
                  />
                  <p className="text-xs text-muted-foreground">
                    Typical kombucha ferments for 7-14 days
                  </p>
                  {errors.targetDays && (
                    <p className="text-sm text-destructive">{errors.targetDays}</p>
                  )}
                </div>
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

                {(!formData.f2Flavorings || formData.f2Flavorings.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No flavorings added yet. Click "Add Flavoring" to get started.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 order-2 sm:order-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 order-1 sm:order-2">
                {batch ? 'Update Batch' : 'Start Brewing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
