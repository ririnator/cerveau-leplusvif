import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { colors, spacing, typography } from '../../src/theme';
import { useSessionRunner } from '../../src/hooks/useSessionRunner';
import { ArithmeticView } from '../../src/components/ArithmeticView';
import { SequencesView } from '../../src/components/SequencesView';
import { StroopView } from '../../src/components/StroopView';
import {
  setLastSession,
  updateStreakOnSessionComplete,
  incrementQuotaUsed,
} from '../../src/services/storage';

export default function SessionScreen() {
  const router = useRouter();
  const {
    currentGame,
    gameIndex,
    totalGames,
    isSessionActive,
    sessionResult,
    feedback,
    submitAnswer,
    getTimeRemaining,
    getGameTimeRemaining,
  } = useSessionRunner();

  const [displayTime, setDisplayTime] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(getTimeRemaining());
      setGameTime(getGameTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessionResult) {
      // Session ended - save results and navigate to recap
      setLastSession(sessionResult);
      updateStreakOnSessionComplete();
      incrementQuotaUsed();

      setTimeout(() => {
        router.replace('/recap');
      }, 1000);
    }
  }, [sessionResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!currentGame) {
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
      {/* Header with timer and progress */}
      <View style={styles.header}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Session</Text>
          <Text style={styles.timer}>{formatTime(displayTime)}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.gameTitle}>{getGameName(currentGame.type)}</Text>
          <View style={styles.progressBar}>
            {Array.from({ length: totalGames }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressSegment,
                  i < gameIndex && styles.progressSegmentComplete,
                  i === gameIndex && styles.progressSegmentActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            Jeu {gameIndex + 1}/{totalGames} • {formatTime(gameTime)}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.score}>{currentGame.state.score}</Text>
        </View>
      </View>

      {/* Feedback overlay */}
      {feedback.show && (
        <View style={styles.feedbackOverlay}>
          <Text style={[styles.feedbackText, feedback.correct && styles.feedbackCorrect]}>
            {feedback.correct ? '✓ Correct' : '✗ Incorrect'}
          </Text>
        </View>
      )}

      {/* Game view */}
      <View style={styles.gameContainer}>
        {currentGame.type === 'arithmetic' && (
          <ArithmeticView
            problem={currentGame.problem}
            onSubmit={submitAnswer}
            level={currentGame.state.level}
          />
        )}
        {currentGame.type === 'sequences' && (
          <SequencesView
            problem={currentGame.problem}
            onSubmit={submitAnswer}
            level={currentGame.state.level}
          />
        )}
        {currentGame.type === 'stroop' && (
          <StroopView
            problem={currentGame.problem}
            onSubmit={submitAnswer}
            level={currentGame.state.level}
          />
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timerContainer: {
    alignItems: 'center',
    width: 70,
  },
  timerLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  timer: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  gameTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressBar: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  progressSegment: {
    width: 40,
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
  },
  progressSegmentComplete: {
    backgroundColor: colors.success,
  },
  progressSegmentActive: {
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  scoreContainer: {
    alignItems: 'center',
    width: 70,
  },
  scoreLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  score: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  gameContainer: {
    flex: 1,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  feedbackText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.error,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.error,
  },
  feedbackCorrect: {
    color: colors.success,
    borderColor: colors.success,
  },
});
