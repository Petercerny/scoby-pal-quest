# 🫖 SCOBY Pal Quest - Brewing Batch System

## Overview

The brewing batch system allows you to track your kombucha fermentation journey with automatic day counting, progress tracking, and batch management.

## Features

### 🆕 Batch Creation
- Create new batches with custom names, tea types, and target brewing days
- Set notes and preferences for each batch
- Automatic start date tracking

### 📊 Day Counting & Progress
- **Automatic day counting**: The system automatically calculates how many days each batch has been brewing
- **Real-time updates**: Day counts update automatically at midnight
- **Progress visualization**: See brewing progress as a percentage towards your target days

### 🔄 Batch Status Management
- **Brewing**: Active fermentation phase
- **Ready**: Batch has reached target days and is ready for bottling
- **Bottled**: Batch has been bottled and stored
- **Archived**: Completed batches moved to archives

### 📱 Dashboard Integration
- View active batches on the main dashboard
- Quick status updates (mark as ready, bottled)
- Batch statistics and progress overview

## How It Works

### 1. Creating a New Batch
1. Click "New Batch" button on the dashboard or batches page
2. Fill in the batch details:
   - **Name**: Give your batch a memorable name
   - **Tea Type**: Select from common tea varieties
   - **Target Days**: Set your desired fermentation period (typically 7-14 days)
   - **Notes**: Add any special instructions or observations
3. Click "Start Brewing" to begin tracking

### 2. Daily Progress Tracking
- The system automatically counts days from the start date
- Each day at midnight, all active batches update their current day
- Progress bars show completion percentage towards target days

### 3. Batch Lifecycle
```
Start → Brewing → Ready → Bottled → Archived
  ↓         ↓        ↓        ↓         ↓
Day 1   Day 2-6   Day 7+   Bottled   Archived
```

### 4. Status Updates
- **Mark as Ready**: When a batch reaches target days, click "Ready to Bottle"
- **Mark as Bottled**: After bottling, update the status
- **Archive**: Move completed batches to archives for record keeping

## Technical Details

### Data Storage
- All batch data is stored locally in the browser's localStorage
- Data persists between sessions
- Demo batches are provided for testing

### Day Calculation
- Uses `date-fns` library for accurate date calculations
- Days are calculated from start date to current date
- Day 1 is the start date (not day 0)

### Automatic Updates
- Day counts update automatically at midnight
- Progress bars reflect real-time completion status
- Statistics update dynamically as batches change

## Sample Demo Data

The system comes with sample batches to demonstrate functionality:
- **Summer Black Tea**: Started 3 days ago, target: 7 days
- **Green Tea Experiment**: Started 1 day ago, target: 10 days  
- **Classic Black Batch**: Started 8 days ago, status: Ready

## Best Practices

### Naming Conventions
- Use descriptive names: "Summer Black Tea Batch" vs "Batch 1"
- Include tea type in the name for easy identification
- Add batch numbers for multiple batches of the same recipe

### Target Days
- **Black Tea**: 7-10 days (standard)
- **Green Tea**: 8-12 days (longer fermentation)
- **Herbal Blends**: 10-14 days (experimental)
- **Winter Brews**: 10-14 days (colder temperatures)

### Notes & Observations
- Record temperature conditions
- Note any unusual fermentation patterns
- Document flavor development over time
- Track SCOBY health and activity

## Troubleshooting

### Day Count Not Updating
- Check that your system time is correct
- Refresh the page to trigger manual updates
- Verify the start date is set correctly

### Batch Status Issues
- Ensure you're clicking the correct status update buttons
- Check that the batch has reached target days before marking as ready
- Use the archive function for completed batches

### Data Loss
- Data is stored locally - clearing browser data will remove batches
- Consider exporting important batch data periodically
- Demo batches will be recreated if no saved data exists

## Future Enhancements

- **Recipe Templates**: Save and reuse successful batch configurations
- **Temperature Logging**: Track fermentation temperature over time
- **Flavor Notes**: Detailed tasting and development notes
- **Batch Sharing**: Export and share batch recipes with other brewers
- **Cloud Sync**: Backup batches to cloud storage
- **Notifications**: Reminders for batch milestones and actions

---

Happy brewing! 🫖✨
