# Daily Reminder Notification System

## Overview

Lucido implements a smart daily reminder system to help users maintain their cognitive training streak. The notification prompt appears **after the user completes their first 10-minute session**, not on first app launch.

## Implementation Details

### Trigger Point

**Modal appears:** After completing the first-ever session (Day 1), on the recap screen
**Delay:** 1.5 seconds after recap screen loads (lets user see results first)

### User Flow

1. User completes their first 10-minute session
2. Recap screen shows with session results
3. After 1.5s, "Rappel quotidien" modal appears
4. User chooses:
   - **"Choisir l'heure"** → Request iOS/Android permission → Schedule daily notification at chosen time (default: 20:00)
   - **"Plus tard"** → Skip notification setup (won't ask again)

### Modal Content

- **Title:** "Rappel quotidien"
- **Body:** "À quelle heure voulez-vous votre rappel quotidien pour ne pas perdre votre série ?"
- **Time Picker:** Default time is 20:00 (8 PM local)
- **Buttons:** [Choisir l'heure] [Plus tard]

### Notification Behavior

#### When it fires:
- **Daily at chosen time** (e.g., 20:00)
- **Only if no session played yet today**

#### Smart cancellation:
- If user plays a session **before** the reminder time, that day's notification is cancelled
- Notification reschedules at midnight for the next day

#### Content:
```
Title: "Votre entraînement quotidien vous attend !"
Body: "Ne perdez pas votre série de X jours. Jouez votre session de 10 minutes maintenant."
```

### Settings Integration

Users can manage notifications from the Settings screen:

- **Toggle:** "Activer les rappels quotidiens" (enable/disable)
- **Time Display:** "Heure du rappel: Actuellement : 20:00"
- **"Modifier" button:** Opens time picker to change notification time
- Changes take effect immediately

## Technical Architecture

### Files Modified

#### 1. Storage Service (`src/services/storage.ts`)
```typescript
// Key to track if user has completed first session
HAS_COMPLETED_FIRST_SESSION: 'cv.onboarding.firstSessionComplete'

// Helper functions
getHasCompletedFirstSession(): boolean
setHasCompletedFirstSession(value: boolean): void
```

#### 2. Recap Screen (`app/recap/index.tsx`)
```typescript
// State for modal visibility
const [showReminderModal, setShowReminderModal] = useState(false);

// Check on mount if this is first session completion
useEffect(() => {
  if (!getHasCompletedFirstSession()) {
    setTimeout(() => setShowReminderModal(true), 1500);
  }
}, []);

// Handle user choosing a time
const handleReminderSetup = async (time: string) => {
  setHasCompletedFirstSession(true);
  const granted = await enableNotifications();
  if (granted) {
    await scheduleDailyReminder(time, streak);
  }
  setShowReminderModal(false);
};

// Handle user skipping
const handleReminderSkip = () => {
  setHasCompletedFirstSession(true);
  setShowReminderModal(false);
};

// Render modal
<ReminderTimeModal
  visible={showReminderModal}
  onConfirm={handleReminderSetup}
  onCancel={handleReminderSkip}
/>
```

#### 3. Home Screen (`app/index.tsx`)
**Removed:** All first-launch notification prompt code
**Kept:** `initializeNotifications()` to reschedule existing notifications on app launch

### Existing Components (Already Implemented)

#### Notification Service (`src/services/notifications.ts`)
Comprehensive notification management:

```typescript
// Request iOS/Android system permission
requestNotificationPermissions(): Promise<boolean>

// Schedule daily reminder with streak context
scheduleDailyReminder(time: string, streak: number): Promise<void>

// Cancel all scheduled notifications
cancelReminders(): Promise<void>

// Update notification time (reschedules)
updateReminderTime(newTime: string): Promise<void>

// Enable notifications (request permission + schedule)
enableNotifications(): Promise<boolean>

// Disable notifications (cancel all)
disableNotifications(): Promise<void>

// Initialize on app launch (reschedule if enabled)
initializeNotifications(): Promise<void>
```

**Smart Scheduling Logic:**
- Checks if session already played today before firing
- Cancels notification if user plays before reminder time
- Reschedules at midnight for next day
- Handles time zone changes and DST

#### Time Picker Modal Component (`src/components/ReminderTimeModal.tsx`)

Reusable modal with iOS/Android native time picker:

```typescript
interface Props {
  visible: boolean;
  onConfirm: (time: string) => void;  // Returns HH:MM format
  onCancel: () => void;
  initialTime?: string;  // Default: "20:00"
}
```

**Features:**
- Dark theme styling
- Safe area aware
- Platform-specific time picker (@react-native-community/datetimepicker)
- Validation and formatting

#### Settings Screen (`app/settings/index.tsx`)

Notification controls:

- **Toggle:** Enable/disable daily reminders
- **Time Display:** Shows current notification time
- **"Modifier" button:** Opens `ReminderTimeModal` to change time
- All changes persist to MMKV and update scheduled notifications

### Persistence (MMKV)

```typescript
// Storage keys
'cv.notifications.enabled'         // boolean
'cv.notifications.time'            // string (HH:MM format)
'cv.notifications.lastScheduledISO' // string (ISO 8601 date)
'cv.notifications.permission'      // 'granted' | 'denied' | 'undetermined'
'cv.onboarding.firstSessionComplete' // boolean
```

### Platform Configuration (`app.config.ts`)

iOS:
```typescript
NSUserNotificationsUsageDescription: "Recevez des rappels quotidiens pour maintenir votre série d'entraînement cognitif."
```

Android:
```typescript
android.permission.POST_NOTIFICATIONS
```

## User Experience

### First-Time User Journey

1. **Day 1, First Open:**
   - No notification prompt ✅
   - User sees home screen with "Jouer 10:00" button

2. **Day 1, After First Session:**
   - Recap screen shows results
   - 1.5s later: "Rappel quotidien" modal appears
   - User sets time (e.g., 20:00) → OS permission granted → Notification scheduled

3. **Day 2, 20:00:**
   - If no session played yet → Notification fires
   - User taps notification → App opens → Can play session

4. **Day 2, 19:00 (before reminder):**
   - If user plays session → Today's 20:00 notification auto-cancels
   - Notification reschedules for Day 3 at 20:00

5. **Ongoing:**
   - User can change time or disable in Settings anytime
   - Notifications respect user preferences
   - No spam: only fires if session not played yet

### Why This Approach?

**Problem with first-launch prompt:**
- Users haven't experienced the app yet
- No context for why reminders matter
- Low conversion rate
- Feels pushy

**Benefits of post-session prompt:**
- User has completed a session → understands value
- Streak is now 1 → reminders make sense to maintain it
- Higher opt-in rate
- Better user experience
- Respects user's time

## QA Checklist

### Fresh Install Flow
- [ ] Install app → Open → NO notification prompt appears
- [ ] Complete first 10-minute session → Recap screen loads
- [ ] After 1.5s → "Rappel quotidien" modal appears
- [ ] Tap "Choisir l'heure" → iOS permission prompt → Grant → Modal closes
- [ ] Notification scheduled for chosen time (verify in device settings)
- [ ] Modal does not reappear on future sessions

### Skip Flow
- [ ] First session → Tap "Plus tard" → Modal closes
- [ ] Modal never appears again

### Notification Delivery
- [ ] Day 2, chosen time → Notification fires (if no session played)
- [ ] Tap notification → App opens to home screen
- [ ] Play session before reminder time → Notification cancelled for today

### Settings Management
- [ ] Go to Settings → See "Activer les rappels quotidiens" toggle
- [ ] Toggle OFF → Notifications disabled → Toggle ON → Re-enable
- [ ] Tap "Modifier" → Time picker opens → Change time → Saves
- [ ] New time reflects immediately

### Edge Cases
- [ ] Time zone change → Notification reschedules correctly
- [ ] DST transition → Notification fires at correct local time
- [ ] Permission denied → User can still use app, no crashes
- [ ] Reinstall app → Notification preferences reset

## Metrics to Track (PostHog)

- `notification_prompt_shown` - Modal appeared after first session
- `notification_enabled` - User tapped "Choisir l'heure" and granted permission
- `notification_skipped` - User tapped "Plus tard"
- `notification_delivered` - Daily notification fired
- `notification_tapped` - User opened app from notification
- `notification_time_changed` - User changed notification time in Settings
- `notification_disabled` - User turned off notifications in Settings

## Future Enhancements

### V2 Considerations:
- [ ] A/B test different default times (19:00 vs 20:00 vs 21:00)
- [ ] Personalized notification content based on streak length
- [ ] Smart timing: suggest notification time based on user's past play patterns
- [ ] Multiple notification options (morning + evening)
- [ ] Weekly summary notifications
- [ ] Celebration notifications (streak milestones: 7, 30, 100 days)

### Advanced Features:
- [ ] Quiet hours (don't notify during sleep times)
- [ ] Notification categories (iOS 15+) for different priority levels
- [ ] Rich notifications with streak stats
- [ ] Action buttons in notification (Play Now / Remind Later)

## Dependencies

- **expo-notifications** (~0.29.0) - Local notification scheduling
- **@react-native-community/datetimepicker** (~8.2.0) - Native time picker
- **react-native-mmkv** (~3.1.0) - Fast persistent storage
- **react-native-safe-area-context** - Safe area handling for modal

## Permissions

### iOS
- Prompt appears when user taps "Choisir l'heure"
- Permission dialog: "Lucido Would Like to Send You Notifications"
- User can later manage in iOS Settings → Lucido → Notifications

### Android
- On Android 13+, permission prompt required (POST_NOTIFICATIONS)
- Prompt appears when user taps "Choisir l'heure"
- User can manage in Android Settings → Apps → Lucido → Notifications

## Notes

- All notification scheduling respects user's local time zone
- Notifications are **local** (not push from server)
- No network required for notification delivery
- Works offline
- Notification content is in French (app language)
- Streak number in notification updates dynamically based on current streak

---

**Last Updated:** 2025-10-01
**Implementation Status:** ✅ Complete
**Testing Status:** Pending iOS build completion
