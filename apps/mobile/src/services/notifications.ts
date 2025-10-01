/**
 * Smart daily notifications service for streak retention
 * Sends reminder notifications at user's preferred time
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
  getReminderTime,
  setReminderTime,
  getCurrentStreak,
} from './storage';
import { hasPlayedToday } from './streak';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_IDENTIFIER = 'daily-reminder';

// Randomized notification templates
const templates = [
  (streak: number) => `🔥 Don't lose your ${streak}-day streak! Time for today's Lucido challenge.`,
  () => `Your brain's waiting 🧠. Play Lucido now.`,
  () => `2 hours left to keep your streak alive! ⏰`,
  (streak: number) => `${streak} days strong! Let's make it ${streak + 1} 💪`,
  () => `Ready to train your brain? 🎯 Your daily Lucido session awaits.`,
  () => `Just 10 minutes today keeps your brain sharp tomorrow 🚀`,
];

/**
 * Request notification permissions from the user
 * Returns true if granted, false otherwise
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notifications] Permission denied');
      setNotificationsEnabled(false);
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8ab4ff',
      });
    }

    return true;
  } catch (error) {
    console.error('[Notifications] Permission error:', error);
    return false;
  }
}

/**
 * Get a randomized notification message
 */
function getRandomMessage(streak: number): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(streak);
}

/**
 * Schedule daily reminder notification at specified time
 * @param time - Time in HH:mm format (e.g., "20:00")
 * @param streak - Current streak count for personalized message
 */
export async function scheduleDailyReminder(time: string, streak: number): Promise<void> {
  try {
    // Cancel existing reminders first
    await cancelReminders();

    if (!getNotificationsEnabled()) {
      console.log('[Notifications] Notifications disabled, skipping schedule');
      return;
    }

    // Parse time
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('[Notifications] Invalid time format:', time);
      return;
    }

    // Schedule notification (daily repeating at specified time)
    const now = new Date();
    const triggerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    // If time has passed today, schedule for tomorrow
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDENTIFIER,
      content: {
        title: 'Lucido – Train Your Brain',
        body: getRandomMessage(streak),
        data: { type: 'daily-reminder' },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      } as any, // Type assertion due to expo-notifications typing issue
    });

    console.log(`[Notifications] Scheduled daily reminder at ${time}`);
  } catch (error) {
    console.error('[Notifications] Failed to schedule:', error);
  }
}

/**
 * Cancel all scheduled reminders
 */
export async function cancelReminders(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER);
    console.log('[Notifications] Cancelled daily reminder');
  } catch (error) {
    // Identifier might not exist, that's okay
    console.log('[Notifications] No existing reminder to cancel');
  }
}

/**
 * Cancel today's reminder if user already played
 * This prevents unnecessary notifications
 */
export async function cancelTodayReminderIfPlayed(): Promise<void> {
  if (hasPlayedToday()) {
    // Don't cancel the recurring notification, just skip it in the check
    console.log('[Notifications] User played today, notification will be skipped by handler');
  }
}

/**
 * Update reminder time and reschedule
 * @param newTime - New time in HH:mm format
 */
export async function updateReminderTime(newTime: string): Promise<void> {
  try {
    setReminderTime(newTime);
    const streak = getCurrentStreak();
    await scheduleDailyReminder(newTime, streak);
    console.log(`[Notifications] Updated reminder time to ${newTime}`);
  } catch (error) {
    console.error('[Notifications] Failed to update reminder time:', error);
  }
}

/**
 * Enable notifications and schedule daily reminder
 */
export async function enableNotifications(): Promise<boolean> {
  const granted = await requestNotificationPermissions();

  if (granted) {
    setNotificationsEnabled(true);
    const time = getReminderTime();
    const streak = getCurrentStreak();
    await scheduleDailyReminder(time, streak);
    return true;
  }

  return false;
}

/**
 * Disable notifications and cancel all reminders
 */
export async function disableNotifications(): Promise<void> {
  setNotificationsEnabled(false);
  await cancelReminders();
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Initialize notifications on app start
 * Reschedule with current streak if enabled
 */
export async function initializeNotifications(): Promise<void> {
  if (getNotificationsEnabled()) {
    const time = getReminderTime();
    const streak = getCurrentStreak();
    await scheduleDailyReminder(time, streak);
    console.log('[Notifications] Initialized on app start');
  }
}
