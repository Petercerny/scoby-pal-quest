import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BatchCard } from './BatchCard';
import { BatchForm } from './BatchForm';
import { F2StartForm } from './F2StartForm';
import { useBatches } from '@/hooks/useBatches';
import { Batch, BatchFormData } from '@/types/batch';
import { useToast } from '@/hooks/use-toast';

export const BatchesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | undefined>();
  const [showF2Form, setShowF2Form] = useState(false);
  const [f2Batch, setF2Batch] = useState<Batch | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Helper function to format status for display
  const getStatusDisplayText = (status: Batch['status']) => {
    switch (status) {
      case 'brewing': return 'Brewing';
      case 'ready': return 'Ready';
      case 'f2_brewing': return 'F2 Brewing';
      case 'f2_ready': return 'F2 Ready';
      case 'bottled': return 'Bottled';
      case 'archived': return 'Archived';
      default: return status;
    }
  };
  
  const { 
    batches, 
    createBatch, 
    updateBatch,
    updateBatchStatus,
    startF2Fermentation, 
    archiveBatch, 
    unarchiveBatch,
    deleteBatch,
    getBatchStats 
  } = useBatches();
  
  const { toast } = useToast();
  const stats = getBatchStats();

  const handleCreateBatch = (formData: BatchFormData) => {
    const newBatch = createBatch(formData);
    toast({
      title: "Batch started! 🫖",
      description: `${newBatch.name} is now brewing. Check back daily to track progress!`,
    });
  };

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleUpdateBatch = (formData: BatchFormData) => {
    if (editingBatch) {
      // Update the batch with the new form data
      updateBatch(editingBatch.id, formData);
      toast({
        title: "Batch updated! ✏️",
        description: `${formData.name} has been updated.`,
      });
      setEditingBatch(undefined);
    }
  };

  const handleStatusUpdate = (batchId: string, status: Batch['status']) => {
    updateBatchStatus(batchId, status);
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      toast({
        title: "Status updated! 🔄",
        description: `${batch.name} is now ${getStatusDisplayText(status)}.`,
      });
    }
  };

  const handleArchive = (batchId: string) => {
    archiveBatch(batchId);
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      toast({
        title: "Batch archived! 📁",
        description: `${batch.name} has been moved to archives.`,
      });
    }
  };

  const handleUnarchive = (batchId: string) => {
    unarchiveBatch(batchId);
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      toast({
        title: "Batch restored! 🔄",
        description: `${batch.name} has been restored from archives.`,
      });
    }
  };

  const handleDelete = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch && confirm(`Are you sure you want to delete "${batch.name}"? This action cannot be undone.`)) {
      deleteBatch(batchId);
      toast({
        title: "Batch deleted! 🗑️",
        description: `${batch.name} has been permanently removed.`,
      });
    }
  };

  const handleStartF2 = (batch: Batch) => {
    setF2Batch(batch);
    setShowF2Form(true);
  };

  const handleF2Start = (f2TargetDays: number, f2Flavorings: any[]) => {
    if (f2Batch) {
      startF2Fermentation(f2Batch.id, f2TargetDays, f2Flavorings);
      toast({
        title: "F2 Fermentation started! 🧪",
        description: `${f2Batch.name} is now in secondary fermentation with ${f2Flavorings.length} flavoring(s).`,
      });
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.teaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (batch.notes && batch.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesTab = false;
    if (activeTab === 'all') {
      matchesTab = batch.status !== 'archived'; // Exclude archived batches from "All" tab
    } else if (activeTab === 'ready') {
      matchesTab = batch.status === 'ready' || batch.status === 'f2_ready';
    } else {
      matchesTab = batch.status === activeTab;
    }
    
    return matchesSearch && matchesTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return batches.filter(b => b.status !== 'archived').length;
    return batches.filter(b => b.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your Batches</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track your kombucha fermentation journey
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="shrink-0 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="truncate">New Batch</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalBatches}</div>
              <div className="text-xs text-muted-foreground">Total Batches</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-scoby-healthy">{stats.activeBatches}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-secondary">{stats.completedBatches}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-accent">{stats.averageBrewingDays}</div>
              <div className="text-xs text-muted-foreground">Avg Days</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 min-w-max">
              <TabsTrigger value="all" className="text-xs px-2 py-2">
                All ({getTabCount('all')})
              </TabsTrigger>
              <TabsTrigger value="brewing" className="text-xs px-2 py-2">
                F1 ({getTabCount('brewing')})
              </TabsTrigger>
              <TabsTrigger value="f2_brewing" className="text-xs px-2 py-2">
                F2 ({getTabCount('f2_brewing')})
              </TabsTrigger>
              <TabsTrigger value="ready" className="text-xs px-2 py-2">
                Ready ({getTabCount('ready') + getTabCount('f2_ready')})
              </TabsTrigger>
              <TabsTrigger value="bottled" className="text-xs px-2 py-2">
                Bottled ({getTabCount('bottled')})
              </TabsTrigger>
              <TabsTrigger value="archived" className="text-xs px-2 py-2">
                Archived ({getTabCount('archived')})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {filteredBatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchTerm ? 'No batches match your search.' : 'No batches found.'}
                </div>
                {!searchTerm && activeTab === 'all' && (
                  <Button onClick={() => setShowForm(true)} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Your First Batch
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onStatusUpdate={handleStatusUpdate}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    onDelete={handleDelete}
                    onEdit={handleEditBatch}
                    onStartF2={handleStartF2}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Batch Form Modal */}
      <BatchForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBatch(undefined);
        }}
        onSubmit={editingBatch ? handleUpdateBatch : handleCreateBatch}
        batch={editingBatch}
        title={editingBatch ? 'Edit Batch' : 'New Batch'}
      />

      {/* F2 Start Form Modal */}
      {f2Batch && (
        <F2StartForm
          isOpen={showF2Form}
          onClose={() => {
            setShowF2Form(false);
            setF2Batch(undefined);
          }}
          onSubmit={handleF2Start}
          batch={f2Batch}
        />
      )}
    </div>
  );
};
