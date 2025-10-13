import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, BookOpen, Star, Zap, Clock, Target } from 'lucide-react';
import { ScobyAvatar } from './ScobyAvatar';
import { useQuests } from '@/hooks/useQuests';
import { Quest } from '@/types/quest';
import { cn } from '@/lib/utils';

export const QuestsPage: React.FC = () => {
  const { quests, avatar, completeQuest, getQuestStats, getQuestsByFilter } = useQuests();
  const [activeTab, setActiveTab] = useState('path');
  
  const stats = getQuestStats();
  const tutorialQuests = getQuestsByFilter({ type: 'tutorial' });
  const challengeQuests = getQuestsByFilter({ type: 'challenge' });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (quest: Quest) => {
    if (quest.isCompleted) return 'bg-green-100 text-green-800';
    if (quest.isUnlocked) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (quest: Quest) => {
    if (quest.isCompleted) return 'Completed';
    if (quest.isUnlocked) return 'Available';
    return 'Locked';
  };

  const QuestCard: React.FC<{ quest: Quest; showOrder?: boolean }> = ({ quest, showOrder = false }) => (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      quest.isCompleted ? 'opacity-75' : '',
      !quest.isUnlocked ? 'opacity-50' : ''
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {showOrder && quest.order && (
                <Badge variant="outline" className="text-xs">
                  {quest.order}
                </Badge>
              )}
              <Badge className={cn('text-xs', getDifficultyColor(quest.difficulty))}>
                {quest.difficulty}
              </Badge>
              <Badge className={cn('text-xs', getStatusColor(quest))}>
                {getStatusText(quest)}
              </Badge>
            </div>
            <CardTitle className="text-base">{quest.title}</CardTitle>
            <CardDescription className="text-sm">{quest.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3" />
              {quest.xpReward} XP
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{quest.progress}%</span>
          </div>
          <Progress value={quest.progress} className="h-1.5" />
        </div>
        
        {/* Requirements - Compact */}
        <div className="space-y-1 mb-3">
          {quest.requirements.map((req) => (
            <div key={req.id} className="flex items-center justify-between text-xs">
              <span className={cn(
                'flex items-center gap-1',
                req.currentProgress >= req.targetProgress ? 'text-green-600' : 'text-muted-foreground'
              )}>
                {req.currentProgress >= req.targetProgress ? (
                  <Target className="w-3 h-3 text-green-600" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                )}
                {req.description}
              </span>
              <span className="text-muted-foreground">
                {req.currentProgress} / {req.targetProgress}
              </span>
            </div>
          ))}
        </div>
        
        {/* Rewards - Compact */}
        {quest.rewards.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {quest.rewards.slice(0, 3).map((reward) => (
                <Badge key={reward.id} variant="secondary" className="text-xs">
                  {reward.description}
                </Badge>
              ))}
              {quest.rewards.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{quest.rewards.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Estimated Time */}
        {quest.estimatedTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Clock className="w-3 h-3" />
            {quest.estimatedTime}
          </div>
        )}
        
        {/* Complete Button */}
        {quest.isUnlocked && !quest.isCompleted && quest.progress >= 100 && (
          <Button 
            onClick={() => completeQuest(quest.id)}
            className="w-full"
            size="sm"
          >
            Complete Quest
          </Button>
        )}
        
        {quest.isCompleted && (
          <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-medium">
            <Trophy className="w-3 h-3" />
            Completed!
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with SCOBY Avatar */}
        <div className="pt-16 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Quest System</h1>
              <p className="text-muted-foreground">Grow your SCOBY through brewing adventures</p>
            </div>
            <ScobyAvatar avatar={avatar} size="md" showStats={false} />
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.completedQuests}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalXPEarned}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{avatar.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quest Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="path" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Path
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Challenges
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="path" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Tutorial Path</h2>
                <p className="text-muted-foreground mb-4">
                  Follow the guided journey to learn kombucha brewing
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.tutorialProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round(stats.tutorialProgress)}% Complete
                </p>
              </div>
              
              <div className="space-y-3">
                {tutorialQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} showOrder={true} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Challenges</h2>
                <p className="text-muted-foreground mb-4">
                  Complete ongoing challenges to unlock rewards and cosmetics
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {challengeQuests.filter(q => q.isCompleted).length} Completed
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {challengeQuests.filter(q => q.isUnlocked && !q.isCompleted).length} Available
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    {challengeQuests.filter(q => !q.isUnlocked).length} Locked
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {challengeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
