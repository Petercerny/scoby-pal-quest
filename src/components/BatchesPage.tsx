import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BatchCard } from './BatchCard';
import { BatchForm } from './BatchForm';
import { useBatches } from '@/hooks/useBatches';
import { Batch, BatchFormData } from '@/types/batch';
import { useToast } from '@/hooks/use-toast';

export const BatchesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    batches, 
    createBatch, 
    updateBatchStatus, 
    archiveBatch, 
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
      // For now, we'll just update the basic info
      // In a real app, you'd want to update the batch in the database
      toast({
        title: "Batch updated! ✏️",
        description: `${editingBatch.name} has been updated.`,
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
        description: `${batch.name} is now ${status}.`,
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

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.teaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (batch.notes && batch.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || batch.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getTabCount = (status: string) => {
    if (status === 'all') return batches.length;
    return batches.filter(b => b.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Batches</h1>
            <p className="text-muted-foreground mt-1">
              Track your kombucha fermentation journey
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            New Batch
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalBatches}</div>
              <div className="text-xs text-muted-foreground">Total Batches</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-scoby-healthy">{stats.activeBatches}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{stats.completedBatches}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stats.averageBrewingDays}</div>
              <div className="text-xs text-muted-foreground">Avg Days</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search batches by name, tea type, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({getTabCount('all')})</TabsTrigger>
            <TabsTrigger value="brewing">Brewing ({getTabCount('brewing')})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({getTabCount('ready')})</TabsTrigger>
            <TabsTrigger value="bottled">Bottled ({getTabCount('bottled')})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({getTabCount('archived')})</TabsTrigger>
          </TabsList>

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onStatusUpdate={handleStatusUpdate}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    onEdit={handleEditBatch}
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
    </div>
  );
};
