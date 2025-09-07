import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Bell, 
  Clock, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Palette, 
  Globe, 
  Thermometer,
  Target,
  Shield,
  Info
} from 'lucide-react';
import { useScobyHealth } from '@/hooks/useScobyHealth';
import { useBatches } from '@/hooks/useBatches';
import { useSettings } from '@/hooks/useSettings';
import { toast } from '@/hooks/use-toast';

export const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { resetHealth } = useScobyHealth();
  const { batches, deleteBatch } = useBatches();

  const exportData = () => {
    const data = {
      settings,
      batches: localStorage.getItem('scoby-batches'),
      health: localStorage.getItem('scoby-health'),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoby-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported successfully",
      description: "Your SCOBY data has been downloaded.",
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) {
          // Update settings through the hook
          Object.keys(data.settings).forEach(category => {
            Object.keys(data.settings[category]).forEach(key => {
              updateSetting(category as any, key as any, data.settings[category][key]);
            });
          });
        }
        if (data.batches) {
          localStorage.setItem('scoby-batches', data.batches);
        }
        if (data.health) {
          localStorage.setItem('scoby-health', data.health);
        }
        
        toast({
          title: "Data imported successfully",
          description: "Your SCOBY data has been restored.",
        });
        
        // Reload the page to apply changes
        window.location.reload();
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    // Reset health
    resetHealth();
    
    // Clear batches
    batches.forEach(batch => deleteBatch(batch.id));
    
    // Reset settings
    resetSettings();
    
    // Clear localStorage
    localStorage.removeItem('scoby-batches');
    localStorage.removeItem('scoby-health');
    localStorage.removeItem('scoby-settings');
    
    toast({
      title: "Data reset successfully",
      description: "All data has been cleared and reset to defaults.",
    });
    
    // Reload the page
    window.location.reload();
  };

  const createBackup = () => {
    const backupData = {
      settings,
      batches: localStorage.getItem('scoby-batches'),
      health: localStorage.getItem('scoby-health'),
      backupDate: new Date().toISOString(),
    };
    
    localStorage.setItem('scoby-backup', JSON.stringify(backupData));
    updateSetting('data', 'lastBackup', new Date().toISOString());
    
    toast({
      title: "Backup created",
      description: "Your data has been backed up locally.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="pt-4">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your SCOBY brewing experience
          </p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your batch reminders and health alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="batch-reminders">Batch Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when batches are ready
                </p>
              </div>
              <Switch
                id="batch-reminders"
                checked={settings.notifications.batchReminders}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'batchReminders', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="health-alerts">Health Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when SCOBY health is low
                </p>
              </div>
              <Switch
                id="health-alerts"
                checked={settings.notifications.healthAlerts}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'healthAlerts', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-reminders">Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Daily check-in reminders
                </p>
              </div>
              <Switch
                id="daily-reminders"
                checked={settings.notifications.dailyReminders}
                onCheckedChange={(checked) => 
                  updateSetting('notifications', 'dailyReminders', checked)
                }
              />
            </div>

            {settings.notifications.dailyReminders && (
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={settings.notifications.reminderTime}
                  onChange={(e) => 
                    updateSetting('notifications', 'reminderTime', e.target.value)
                  }
                  className="w-32"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brewing Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Brewing Preferences
            </CardTitle>
            <CardDescription>
              Default settings for new batches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-days">Default Target Days</Label>
              <Input
                id="default-days"
                type="number"
                min="3"
                max="21"
                value={settings.brewing.defaultTargetDays}
                onChange={(e) => 
                  updateSetting('brewing', 'defaultTargetDays', parseInt(e.target.value))
                }
                className="w-24"
              />
              <p className="text-sm text-muted-foreground">
                Default fermentation period for new batches
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-tea">Default Tea Type</Label>
              <Select
                value={settings.brewing.defaultTeaType}
                onValueChange={(value) => 
                  updateSetting('brewing', 'defaultTeaType', value)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black Tea">Black Tea</SelectItem>
                  <SelectItem value="Green Tea">Green Tea</SelectItem>
                  <SelectItem value="White Tea">White Tea</SelectItem>
                  <SelectItem value="Oolong Tea">Oolong Tea</SelectItem>
                  <SelectItem value="Herbal Tea">Herbal Tea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature-unit">Temperature Unit</Label>
              <Select
                value={settings.brewing.temperatureUnit}
                onValueChange={(value: 'celsius' | 'fahrenheit') => 
                  updateSetting('brewing', 'temperatureUnit', value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">°C</SelectItem>
                  <SelectItem value="fahrenheit">°F</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-archive">Auto-archive Completed</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically archive completed batches
                </p>
              </div>
              <Switch
                id="auto-archive"
                checked={settings.brewing.autoArchiveCompleted}
                onCheckedChange={(checked) => 
                  updateSetting('brewing', 'autoArchiveCompleted', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              App Preferences
            </CardTitle>
            <CardDescription>
              Customize the app appearance and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.app.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => 
                  updateSetting('app', 'theme', value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Backup, export, and manage your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-backup">Auto Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup your data
                </p>
              </div>
              <Switch
                id="auto-backup"
                checked={settings.data.autoBackup}
                onCheckedChange={(checked) => 
                  updateSetting('data', 'autoBackup', checked)
                }
              />
            </div>

            {settings.data.autoBackup && (
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select
                  value={settings.data.backupFrequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    updateSetting('data', 'backupFrequency', value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {settings.data.lastBackup && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Last backup: {new Date(settings.data.lastBackup).toLocaleDateString()}
                </Badge>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all your data as a JSON file
                  </p>
                </div>
                <Button onClick={exportData} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Import Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Restore data from a backup file
                  </p>
                </div>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                    id="import-file"
                  />
                  <Button asChild variant="outline" size="sm">
                    <label htmlFor="import-file" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </label>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Create Backup</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a local backup of your data
                  </p>
                </div>
                <Button onClick={createBackup} variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Backup
                </Button>
              </div>
            </div>

            <Separator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your batches, health data, and settings. 
                    This action cannot be undone. Make sure you have exported your data first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Reset All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Batches</span>
              <span className="text-sm font-medium">{batches.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Batches</span>
              <span className="text-sm font-medium">
                {batches.filter(b => b.isActive && b.status === 'brewing').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

