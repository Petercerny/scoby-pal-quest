# SCOBY Health System

The SCOBY Health System is a dynamic health management system that ties your SCOBY companion's health to your brewing activities, quest completion, and daily care.

## How It Works

### Health Calculation
- **Base Health**: Starts at 85/100
- **Maximum Health**: 100
- **Minimum Health**: 0

### Health Changes

#### Positive Health Gains
- **Batch Success**: +5 health when a batch reaches 'ready' or 'bottled' status
- **Quest Completion**: +3 health for completing daily quests
- **Daily Care**: +1 health for tending to active brewing batches daily

#### Negative Health Loss
- **Batch Overdue**: -5 health when batches go more than 2 days over target
- **Time Decay**: -2 health per day without any activity
- **Batch Failure**: -10 health for failed batches (if implemented)

### Health Status Levels
- **85-100**: Thriving ✨
- **60-84**: Healthy 🌱
- **40-59**: Needs Care ⚠️
- **20-39**: Warning 😰
- **0-19**: Critical 😷

### Health Trends
- **Improving**: Recent positive health changes > 2 points
- **Declining**: Recent negative health changes > 2 points
- **Stable**: Health changes within ±2 points

## Features

### Real-time Updates
- Health updates automatically when batches change status
- Daily health calculations based on batch progress
- Quest completion immediately affects health

### Visual Feedback
- Health ring shows current health percentage
- Color-coded health status (green, amber, red)
- Health trend indicators with icons
- Pulse animations when health changes significantly

### Health Tips
- Contextual advice based on current health level
- Suggestions for improving SCOBY health
- Warnings when health is critical

### Recent Activity Log
- Tracks all health changes with timestamps
- Shows descriptions of what caused health changes
- Displays health point gains/losses

## Usage

### Daily Care
1. Check your active batches
2. Complete daily quests
3. Monitor health trends
4. Address any health warnings

### Improving Health
- Complete quests regularly
- Don't let batches go overdue
- Maintain active brewing batches
- Check in daily for care bonuses

### Monitoring Health
- Watch the health ring for visual feedback
- Check health trends for improvement/decline
- Review recent activity for health changes
- Use health tips for guidance

## Technical Details

### Storage
- Health data is persisted in localStorage
- Health events are tracked with timestamps
- Batch performance history is maintained

### Calculations
- Health updates run automatically when batches change
- Time-based decay is calculated daily
- Quest rewards are applied immediately
- Health is clamped between 0-100

### Performance
- Health calculations are optimized with useCallback
- Updates only occur when necessary
- Animations are lightweight and smooth

## Testing

Use the "Reset Health" button to test the system:
- Resets health to initial 85 points
- Useful for testing health changes
- Shows toast notification on reset

## Future Enhancements

Potential improvements could include:
- Health-based batch success rates
- Seasonal health modifiers
- Health-based SCOBY appearance changes
- Health sharing between multiple SCOBYs
- Health-based quest difficulty scaling






