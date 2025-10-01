import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, typography } from '../../src/theme';
import { getExpoConfig } from '../../src/config/expo-config';
import {
  getSoundEnabled,
  setSoundEnabled,
  getHapticsEnabled,
  setHapticsEnabled,
  getNotificationsEnabled,
  getReminderTime,
} from '../../src/services/storage';
import {
  enableNotifications,
  disableNotifications,
  updateReminderTime,
} from '../../src/services/notifications';
import { ReminderTimeModal } from '../../src/components/ReminderTimeModal';

export default function SettingsScreen() {
  const router = useRouter();
  const { MARKETING_NAME, VERSION } = getExpoConfig();
  const [sounds, setSounds] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [reminderTime, setLocalReminderTime] = useState('20:00');
  const [showTimeModal, setShowTimeModal] = useState(false);

  useEffect(() => {
    setSounds(getSoundEnabled());
    setHaptics(getHapticsEnabled());
    setNotifications(getNotificationsEnabled());
    setLocalReminderTime(getReminderTime());
  }, []);

  const handleSoundsChange = (value: boolean) => {
    setSounds(value);
    setSoundEnabled(value);
  };

  const handleHapticsChange = (value: boolean) => {
    setHaptics(value);
    setHapticsEnabled(value);
  };

  const handleNotificationsChange = async (value: boolean) => {
    if (value) {
      const granted = await enableNotifications();
      setNotifications(granted);
    } else {
      await disableNotifications();
      setNotifications(false);
    }
  };

  const handleTimeChange = async (newTime: string) => {
    setLocalReminderTime(newTime);
    await updateReminderTime(newTime);
    setShowTimeModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Paramètres</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.versionText}>
            {MARKETING_NAME} v{VERSION}
          </Text>
          <Text style={styles.description}>
            {MARKETING_NAME} est une application d'entraînement cognitif (10 minutes/jour) : vitesse de traitement, attention, mémoire de travail.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Activer les sons</Text>
              <Text style={styles.settingDescription}>Sons de feedback pendant les jeux</Text>
            </View>
            <Switch
              testID="toggle-sounds"
              accessibilityLabel="Activer les sons"
              value={sounds}
              onValueChange={handleSoundsChange}
              trackColor={{ false: '#3e3e3e', true: '#8ab4ff' }}
              thumbColor={sounds ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Activer les retours haptiques</Text>
              <Text style={styles.settingDescription}>Vibrations lors des interactions</Text>
            </View>
            <Switch
              testID="toggle-haptics"
              accessibilityLabel="Activer les retours haptiques"
              value={haptics}
              onValueChange={handleHapticsChange}
              trackColor={{ false: '#3e3e3e', true: '#8ab4ff' }}
              thumbColor={haptics ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rappels quotidiens</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Activer les rappels</Text>
              <Text style={styles.settingDescription}>
                Recevez un rappel quotidien pour maintenir votre série
              </Text>
            </View>
            <Switch
              testID="toggle-notifications"
              accessibilityLabel="Activer les rappels quotidiens"
              value={notifications}
              onValueChange={handleNotificationsChange}
              trackColor={{ false: '#3e3e3e', true: '#8ab4ff' }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          {notifications && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimeModal(true)}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Heure du rappel</Text>
                  <Text style={styles.settingDescription}>
                    Actuellement : {reminderTime}
                  </Text>
                </View>
                <Text style={styles.changeText}>Modifier</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <ReminderTimeModal
        visible={showTimeModal}
        onConfirm={handleTimeChange}
        onCancel={() => setShowTimeModal(false)}
        initialTime={reminderTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: typography.sizes.md,
    color: '#8ab4ff',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#262626',
  },
  versionText: {
    fontSize: typography.sizes.md,
    color: '#bbbbbb',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.md,
    color: '#dddddd',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: '#ffffff',
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.sizes.md,
    color: '#ffffff',
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    color: '#bbbbbb',
  },
  separator: {
    height: 1,
    backgroundColor: '#262626',
    marginVertical: spacing.sm,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  changeText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});
