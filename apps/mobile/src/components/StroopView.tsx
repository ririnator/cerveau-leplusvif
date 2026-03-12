import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';
import type { Problem } from '@cerveau-vif/core-logic';

interface Props {
  problem: Problem;
  onSubmit: (answer: string) => void;
  level: number;
}

// Map French color names to hex colors (outside component to avoid re-creation)
const colorMap: Record<string, string> = {
  rouge: colors.rouge,
  bleu: colors.bleu,
  vert: colors.vert,
  jaune: colors.jaune,
};

export function StroopView({ problem, onSubmit, level }: Props) {
  const { word, inkColor } = problem.meta;

  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Niveau {level}</Text>
      </View>

      <Text style={styles.title}>Test de Stroop</Text>

      <View style={styles.wordContainer}>
        <Text style={[styles.word, { color: colorMap[inkColor] }]}>{word}</Text>
      </View>

      <Text style={styles.question}>{problem.prompt}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.yesButton]}
          onPress={() => onSubmit('oui')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>OUI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.noButton]}
          onPress={() => onSubmit('non')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>NON</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Appuyez rapidement selon la concordance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  levelBadge: {
    backgroundColor: colors.primary + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  levelText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  title: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  wordContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    borderWidth: 2,
    borderColor: colors.border,
  },
  word: {
    fontSize: typography.sizes.xxxl * 1.5,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  question: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  yesButton: {
    backgroundColor: colors.success + '30',
    borderColor: colors.success,
  },
  noButton: {
    backgroundColor: colors.error + '30',
    borderColor: colors.error,
  },
  buttonText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  hint: {
    marginTop: spacing.xxl,
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
