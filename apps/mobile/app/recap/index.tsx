import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { colors, spacing, typography } from '../../src/theme';
import { getLastSession, canPlayToday, isPro, getCurrentStreak } from '../../src/services/storage';
import { trackPaywallView } from '../../src/services/analytics';
import type { SessionResult } from '@cerveau-vif/core-logic';

export default function RecapScreen() {
  const router = useRouter();
  const [session, setSession] = useState<SessionResult | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const lastSession = getLastSession<SessionResult>();
    setSession(lastSession);
    setCanPlay(canPlayToday());
    setIsProUser(isPro());
    setStreak(getCurrentStreak());
  };

  const handlePlayAgain = () => {
    if (!canPlay && !isProUser) {
      trackPaywallView('recap');
      router.push('/paywall');
      return;
    }
    router.replace('/session');
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  const getGameName = (type: string) => {
    switch (type) {
      case 'arithmetic':
        return 'Calcul Mental';
      case 'sequences':
        return 'Suites Logiques';
      case 'stroop':
        return 'Test de Stroop';
      default:
        return type;
    }
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Bravo ! 🎉</Text>
          <Text style={styles.subtitle}>Session terminée</Text>
        </View>

        {/* Overall Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Résultats globaux</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statTile}>
              <Text style={styles.statValue}>{session.totalScore}</Text>
              <Text style={styles.statLabel}>Score Total</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statValue}>{Math.round(session.accuracy * 100)}%</Text>
              <Text style={styles.statLabel}>Précision</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statValue}>{Math.floor(session.durationSec / 60)}m</Text>
              <Text style={styles.statLabel}>Durée</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Série</Text>
            </View>
          </View>
        </View>

        {/* Per-Game Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails par jeu</Text>
          {session.games.map((game, index) => (
            <View key={index} style={styles.gameRow}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{getGameName(game.type)}</Text>
                <View style={styles.gameStats}>
                  <Text style={styles.gameStatText}>
                    Score: {game.score} • Précision: {Math.round(game.accuracy * 100)}%
                  </Text>
                  <Text style={styles.gameStatText}>
                    Niveaux: {game.levelCurve[0]} → {game.levelCurve[game.levelCurve.length - 1]}
                  </Text>
                  <Text style={styles.gameStatText}>
                    Temps moyen: {Math.round(game.avgResponseMs / 1000)}s
                  </Text>
                </View>
              </View>
              {/* Mini sparkline visualization */}
              <View style={styles.sparkline}>
                {game.levelCurve.slice(0, 10).map((level, i) => (
                  <View
                    key={i}
                    style={[
                      styles.sparklineBar,
                      { height: (level / 10) * 40 },
                    ]}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Analyse</Text>
          <Text style={styles.insightText}>
            {session.accuracy > 0.8
              ? 'Excellente précision ! Vous êtes sur la bonne voie.'
              : session.accuracy > 0.6
              ? 'Bonne performance. Continuez à vous entraîner régulièrement.'
              : 'Bon début ! La régularité est la clé de la progression.'}
          </Text>
          <Text style={styles.insightText}>
            Votre série actuelle : {streak} jour{streak > 1 ? 's' : ''}. Revenez demain pour
            continuer !
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {(canPlay || isProUser) ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handlePlayAgain}>
              <Text style={styles.primaryButtonText}>Rejouer 10:00</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.proButton} onPress={handlePlayAgain}>
              <Text style={styles.primaryButtonText}>
                ✨ Débloquer Pro illimité
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
            <Text style={styles.secondaryButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statTile: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  gameRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  gameStats: {
    gap: spacing.xs / 2,
  },
  gameStatText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginLeft: spacing.md,
  },
  sparklineBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    minHeight: 4,
  },
  insightCard: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  insightTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  insightText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  proButton: {
    backgroundColor: colors.warning,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
});
