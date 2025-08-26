import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Target, 
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  Minus
} from "lucide-react";
import { HealthRing } from "./HealthRing";
import { ScopyAvatar } from "./ScopyAvatar";
import { MiniPuzzle } from "./MiniPuzzle";
import { QuestCard } from "./QuestCard";
import { BatchForm } from "./BatchForm";
import { useToast } from "@/hooks/use-toast";
import { useBatches } from "@/hooks/useBatches";
import { useScobyHealth } from "@/hooks/useScobyHealth";
import { Batch, BatchFormData } from "@/types/batch";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'CARE' | 'PUZZLE';
  status: 'PENDING' | 'DONE';
  rewardXP: number;
  icon: 'temperature' | 'photo' | 'puzzle';
  timeEstimate?: string;
}

const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'Check Temperature',
    description: 'Record your batch temperature',
    type: 'CARE' as const,
    status: 'PENDING' as const,
    rewardXP: 10,
    icon: 'temperature' as const,
    timeEstimate: '30 sec'
  },
  {
    id: '2',
    title: 'Take Photo',
    description: 'Capture your SCOBY progress',
    type: 'CARE' as const,
    status: 'PENDING' as const,
    rewardXP: 15,
    icon: 'photo' as const,
    timeEstimate: '1 min'
  },
  {
    id: '3',
    title: 'Logic Puzzle',
    description: 'Solve today\'s brain teaser',
    type: 'PUZZLE' as const,
    status: 'PENDING' as const,
    rewardXP: 25,
    icon: 'puzzle' as const,
    timeEstimate: '2 min'
  }
];

export const Dashboard = () => {
  const [quests, setQuests] = useState(mockQuests);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [showNewBatchForm, setShowNewBatchForm] = useState(false);
  const [pinnedBatchId, setPinnedBatchId] = useState<string | null>(null);
  
  // Load pinned batch from localStorage on mount
  useEffect(() => {
    const savedPinnedBatch = localStorage.getItem('scoby-pinned-batch');
    if (savedPinnedBatch) {
      setPinnedBatchId(savedPinnedBatch);
    }
  }, []);
  
  // Save pinned batch to localStorage whenever it changes
  useEffect(() => {
    if (pinnedBatchId) {
      localStorage.setItem('scoby-pinned-batch', pinnedBatchId);
    } else {
      localStorage.removeItem('scoby-pinned-batch');
    }
  }, [pinnedBatchId]);
  
  const { toast } = useToast();
  const { 
    batches, 
    createBatch, 
    getBatchStats, 
    getActiveBatches,
    updateBatchStatus 
  } = useBatches();
  
  const {
    health,
    updateHealthFromBatches,
    addQuestHealth,
    resetHealth,
    getHealthStatus,
    getHealthMood,
    getRecentHealthEvents,
    getHealthTrend
  } = useScobyHealth();

  const stats = getBatchStats();
  const activeBatches = getActiveBatches();
  
  // Get featured batch (pinned or oldest)
  const getFeaturedBatch = () => {
    if (pinnedBatchId) {
      const pinned = activeBatches.find(batch => batch.id === pinnedBatchId);
      if (pinned) return pinned;
    }
    return activeBatches[0] || null;
  };
  
  const featuredBatch = getFeaturedBatch();

  // Update health whenever batches change
  useEffect(() => {
    if (batches.length > 0) {
      const { healthChange, events } = updateHealthFromBatches(batches);
      
      // Show health change notification if significant
      if (Math.abs(healthChange) >= 3) {
        const isPositive = healthChange > 0;
        toast({
          title: isPositive ? "SCOBY Health Improved! 🌱" : "SCOBY Health Affected ⚠️",
          description: isPositive 
            ? `Your SCOBY gained ${healthChange} health points!`
            : `Your SCOBY lost ${Math.abs(healthChange)} health points. Check your batches!`,
        });
      }
    }
  }, [batches, updateHealthFromBatches, toast]);

  // Calculate user level and XP based on batches
  const calculateUserStats = () => {
    const totalXP = batches.reduce((sum, batch) => {
      let xp = 0;
      if (batch.status === 'brewing') xp += batch.currentDay * 2; // 2 XP per brewing day
      if (batch.status === 'ready') xp += 50; // Bonus for ready batches
      if (batch.status === 'bottled') xp += 100; // Bonus for bottled batches
      return sum + xp;
    }, 0);
    
    const level = Math.floor(totalXP / 100) + 1;
    const xpToNextLevel = 100 - (totalXP % 100);
    
    return { level, xp: totalXP, xpToNextLevel };
  };

  const userStats = calculateUserStats();

  const handleQuestComplete = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    
    if (quest?.type === 'PUZZLE') {
      setShowPuzzle(true);
      return;
    }
    
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, status: 'DONE' as const }
        : quest
    ));
    
    // Award XP and health
    const completedQuest = quests.find(q => q.id === questId);
    if (completedQuest && completedQuest.status === 'PENDING') {
      const healthGain = addQuestHealth(completedQuest.title);
      toast({
        title: "Quest completed! 🎉",
        description: `You earned ${completedQuest.rewardXP} XP and ${healthGain} health points!`,
      });
    }
  };

  const handlePuzzleComplete = () => {
    // Complete the puzzle quest
    setQuests(prev => prev.map(quest => 
      quest.type === 'PUZZLE' 
        ? { ...quest, status: 'DONE' as const }
        : quest
    ));
    
    // Award XP and health
    const puzzleQuest = quests.find(q => q.type === 'PUZZLE');
    if (puzzleQuest) {
      const healthGain = addQuestHealth(puzzleQuest.title);
      toast({
        title: "Puzzle solved! 🧩",
        description: `You earned ${puzzleQuest.rewardXP} XP and ${healthGain} health points!`,
      });
    }
  };

  const handleCreateBatch = (formData: BatchFormData) => {
    const newBatch = createBatch(formData);
    toast({
      title: "Batch started! 🫖",
      description: `${newBatch.name} is now brewing. Check back daily to track progress!`,
    });
  };

  const getScobyMood = () => {
    return getHealthMood();
  };

  const completedQuests = quests.filter(q => q.status === 'DONE').length;
  const totalQuests = quests.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌅';
    if (hour < 17) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}
            </h1>
            <p className="text-sm text-muted-foreground">
              {stats.longestRunningBatch ? (
                <>
                  {stats.longestRunningBatch.name}: {stats.longestRunningBatch.currentDay}/{stats.longestRunningBatch.targetDays} days
                </>
              ) : (
                "No active batches brewing"
              )}
            </p>
          </div>
          
          <Button onClick={() => setShowNewBatchForm(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">New Batch</span>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - SCOBY Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Batch Progress */}
            <Card>
              <CardHeader className="flex items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  Featured Batch
                  {!pinnedBatchId && (
                    <span className="text-xs text-muted-foreground font-normal">(Auto)</span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {activeBatches.length > 1 && (
                    <select
                      value={pinnedBatchId || ''}
                      onChange={(e) => {
                        const batchId = e.target.value;
                        if (batchId) {
                          setPinnedBatchId(batchId);
                          const selectedBatch = activeBatches.find(b => b.id === batchId);
                          if (selectedBatch) {
                            toast({
                              title: "Batch Selected",
                              description: `${selectedBatch.name} is now featured`,
                            });
                          }
                        } else {
                          setPinnedBatchId(null);
                          toast({
                            title: "Auto-Selection Enabled",
                            description: "Oldest batch will be featured automatically",
                          });
                        }
                      }}
                      className="text-xs border rounded px-2 py-1 bg-background"
                    >
                      <option value="">🔄 Auto</option>
                      {activeBatches.map(batch => (
                        <option key={batch.id} value={batch.id}>
                          {pinnedBatchId === batch.id ? '📌 ' : ''}{batch.name}
                        </option>
                      ))}
                    </select>
                  )}

                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                {featuredBatch ? (
                  <>
                    {/* Batch Progress Ring */}
                    <div className="relative inline-flex items-center justify-center">
                      <svg width={180} height={180} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx={90}
                          cy={90}
                          r={40}
                          stroke="hsl(var(--muted))"
                          strokeWidth={10}
                          fill="transparent"
                          className="opacity-20"
                        />
                        
                        {/* Progress circle */}
                        <circle
                          cx={90}
                          cy={90}
                          r={40}
                          stroke="currentColor"
                          strokeWidth={10}
                          fill="transparent"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - ((featuredBatch.currentDay / featuredBatch.targetDays) * 251.2)}
                          strokeLinecap="round"
                          className="stroke-primary transition-all duration-1000 ease-out"
                        />
                      </svg>
                      
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                        <div className="text-2xl font-bold text-foreground leading-none">
                          {Math.round((featuredBatch.currentDay / featuredBatch.targetDays) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground font-medium leading-tight mt-1">
                          Day {featuredBatch.currentDay}/{featuredBatch.targetDays}
                        </div>
                      </div>
                    </div>
                    
                    {/* Batch Info */}
                    <div className="w-full text-center space-y-2">
                      <div className="font-medium text-sm">{featuredBatch.name}</div>
                      <div className="text-xs text-muted-foreground">{featuredBatch.teaType}</div>
                      
                      {/* Start Date */}
                      <div className="text-xs text-muted-foreground">
                        Started {format(featuredBatch.startDate, 'MMM d')}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(featuredBatch.currentDay / featuredBatch.targetDays) * 100}%` }}
                        />
                      </div>
                      
                      {/* Status */}
                      {featuredBatch.currentDay >= featuredBatch.targetDays ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 text-sm text-scoby-healthy">
                            <CheckCircle className="w-4 h-4" />
                            Ready to bottle!
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => updateBatchStatus(featuredBatch.id, 'ready')}
                            className="text-xs w-full"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark as Ready
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          {featuredBatch.targetDays - featuredBatch.currentDay} days remaining
                        </div>
                      )}
                      
                      {/* Notes */}
                      {featuredBatch.notes && (
                        <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded max-h-16 overflow-y-auto">
                          {featuredBatch.notes}
                        </div>
                      )}
                      
                      {/* Pin Status */}
                      {pinnedBatchId === featuredBatch.id && (
                        <div className="text-xs text-primary font-medium flex items-center justify-center gap-1">
                          📌 Pinned Batch
                        </div>
                      )}
                      
                      {/* Health Impact */}
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        <div className="flex items-center justify-center gap-1">
                          <span>Health Impact:</span>
                          {featuredBatch.currentDay >= featuredBatch.targetDays ? (
                            <span className="text-scoby-healthy">+5 points when bottled</span>
                          ) : featuredBatch.currentDay > featuredBatch.targetDays + 2 ? (
                            <span className="text-scoby-danger">-5 points (overdue)</span>
                          ) : (
                            <span className="text-primary">+1 point daily care</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <div className="text-4xl text-muted-foreground">🫖</div>
                    <div className="text-sm text-muted-foreground">No active batches</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowNewBatchForm(true)}
                    >
                      Start Your First Batch
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SCOBY Avatar & Health */}
            <Card>
              <CardContent className="p-6 text-center">
                <ScopyAvatar 
                  health={health.currentHealth} 
                  mood={getScobyMood()} 
                  size="lg" 
                  animated={true} 
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Your SCOBY companion is {getHealthStatus().toLowerCase()}
                </p>
                
                {/* Health Status */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium">
                      {health.currentHealth}/{health.maxHealth} Health
                    </span>
                  </div>
                  
                  {/* Health Trend */}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    {getHealthTrend() === 'improving' && (
                      <>
                        <TrendingUpIcon className="w-4 h-4 text-scoby-healthy" />
                        <span className="text-scoby-healthy">Improving</span>
                      </>
                    )}
                    {getHealthTrend() === 'declining' && (
                      <>
                        <TrendingDown className="w-4 h-4 text-scoby-danger" />
                        <span className="text-scoby-danger">Needs Attention</span>
                      </>
                    )}
                    {getHealthTrend() === 'stable' && (
                      <>
                        <Minus className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Stable</span>
                      </>
                    )}
                  </div>
                  
                  {/* Health Tips */}
                  <div className="text-xs p-2 bg-muted/30 rounded">
                    {health.currentHealth >= 80 && (
                      <span className="text-scoby-healthy">Keep up the great work! Your SCOBY is thriving.</span>
                    )}
                    {health.currentHealth >= 60 && health.currentHealth < 80 && (
                      <span className="text-primary">Complete quests and tend to batches to improve health.</span>
                    )}
                    {health.currentHealth >= 40 && health.currentHealth < 60 && (
                      <span className="text-scoby-warning">Your SCOBY needs attention. Check for overdue batches.</span>
                    )}
                    {health.currentHealth < 40 && (
                      <span className="text-scoby-danger">Critical health! Complete quests and fix batch issues immediately.</span>
                    )}
                  </div>
                  
                  {/* Recent Health Events */}
                  {getRecentHealthEvents().length > 0 && (
                    <div className="space-y-1 max-h-16 overflow-y-auto">
                      {getRecentHealthEvents().slice(0, 2).map((event) => (
                        <div key={event.id} className="flex items-center justify-between text-xs p-1 bg-muted/30 rounded">
                          <span className="truncate flex-1 text-left">{event.description}</span>
                          <span className={`font-medium ml-2 ${
                            event.value > 0 ? 'text-scoby-healthy' : 'text-scoby-danger'
                          }`}>
                            {event.value > 0 ? '+' : ''}{event.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      resetHealth();
                      toast({
                        title: "Health Reset",
                        description: "SCOBY health has been reset to initial value",
                      });
                    }}
                    className="text-xs"
                  >
                    Reset Health
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quests and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Quests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Daily Quests
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete quests to earn XP and care for your SCOBY
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={() => handleQuestComplete(quest.id)}
                  />
                ))}
                <div className="pt-2">
                  <Progress value={(completedQuests / totalQuests) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedQuests} of {totalQuests} quests completed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Active Batches */}
            {activeBatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Active Batches
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Currently brewing batches
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeBatches.slice(0, 3).map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{batch.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Day {batch.currentDay} of {batch.targetDays} • {batch.teaType}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(batch.currentDay / batch.targetDays) * 100} 
                          className="w-20 h-2" 
                        />
                        {batch.currentDay >= batch.targetDays && (
                          <Button 
                            size="sm" 
                            onClick={() => updateBatchStatus(batch.id, 'ready')}
                            className="text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {activeBatches.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{activeBatches.length - 3} more batches
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">{stats.totalBatches}</div>
                  <div className="text-xs text-muted-foreground">Total Batches</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-scoby-healthy">
                    {stats.longestRunningBatch ? (
                      `${stats.longestRunningBatch.currentDay}/${stats.longestRunningBatch.targetDays}`
                    ) : (
                      "0/0"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Longest Batch</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-secondary-accent">{userStats.level}</div>
                  <div className="text-xs text-muted-foreground">Brew Level</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className={`text-2xl font-bold ${
                    health.currentHealth >= 80 ? 'text-scoby-healthy' :
                    health.currentHealth >= 60 ? 'text-primary' :
                    health.currentHealth >= 40 ? 'text-scoby-warning' :
                    'text-scoby-danger'
                  }`}>
                    {health.currentHealth}%
                  </div>
                  <div className="text-xs text-muted-foreground">SCOBY Health</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mini Puzzle Modal */}
        <MiniPuzzle
          isOpen={showPuzzle}
          onClose={() => setShowPuzzle(false)}
          onComplete={handlePuzzleComplete}
          difficulty="easy"
        />

        {/* Batch Form Modal */}
        <BatchForm
          isOpen={showNewBatchForm}
          onClose={() => setShowNewBatchForm(false)}
          onSubmit={handleCreateBatch}
          title="New Batch"
        />
      </div>
    </div>
  );
};