import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { colors, spacing, typography } from '../src/theme';
import {
  getCurrentStreak,
  getBestStreak,
  getLastSession,
  canPlayToday,
  isPro,
} from '../src/services/storage';
import type { SessionResult } from '@cerveau-vif/core-logic';

export default function HomeScreen() {
  const router = useRouter();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastSession, setLastSession] = useState<SessionResult | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCurrentStreak(getCurrentStreak());
    setBestStreak(getBestStreak());
    setLastSession(getLastSession<SessionResult>());
    setCanPlay(canPlayToday());
    setIsProUser(isPro());
  };

  const handlePlaySession = () => {
    if (!canPlay && !isProUser) {
      router.push('/paywall');
      return;
    }
    router.push('/session');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cerveau Vif</Text>
          <Text style={styles.subtitle}>10 minutes d'entraînement quotidien</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Série</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Actuelle</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Text style={styles.streakValue}>{bestStreak}</Text>
              <Text style={styles.streakLabel}>Record</Text>
            </View>
          </View>
        </View>

        {/* Last Session Card */}
        {lastSession && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dernière session</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{lastSession.totalScore}</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(lastSession.accuracy * 100)}%
                </Text>
                <Text style={styles.statLabel}>Précision</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.floor(lastSession.durationSec / 60)}m
                </Text>
                <Text style={styles.statLabel}>Durée</Text>
              </View>
            </View>
          </View>
        )}

        {/* Pro Badge */}
        {isProUser && (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>✨ PRO</Text>
          </View>
        )}

        {/* Quota Warning */}
        {!canPlay && !isProUser && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              Session gratuite utilisée aujourd'hui. Passez à Pro pour jouer illimité !
            </Text>
          </View>
        )}

        {/* Play Button */}
        <TouchableOpacity
          style={[styles.playButton, !canPlay && !isProUser && styles.playButtonDisabled]}
          onPress={handlePlaySession}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>
            {canPlay || isProUser ? 'Jouer 10:00' : 'Débloquer Pro'}
          </Text>
        </TouchableOpacity>

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Astuce du jour</Text>
          <Text style={styles.tipText}>
            La régularité est clé ! Jouer chaque jour améliore vos capacités cognitives
            mesurées dans l'app : vitesse de traitement, attention et mémoire de travail.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  streakValue: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  streakLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  proBadge: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  proBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  warningCard: {
    backgroundColor: colors.warning + '20',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningText: {
    fontSize: typography.sizes.md,
    color: colors.warning,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  playButtonDisabled: {
    backgroundColor: colors.warning,
  },
  playButtonText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  tipCard: {
    backgroundColor: colors.surface + '80',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  tipTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
