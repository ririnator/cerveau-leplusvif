import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { colors, spacing, typography } from '../theme';
import type { Problem } from '@cerveau-vif/core-logic';

interface Props {
  problem: Problem;
  onSubmit: (answer: string) => void;
  level: number;
}

export function ArithmeticView({ problem, onSubmit, level }: Props) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  const handleNumberPress = (num: string) => {
    setAnswer(prev => prev + num);
  };

  const handleClear = () => {
    setAnswer('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Niveau {level}</Text>
      </View>

      <Text style={styles.prompt}>{problem.prompt}</Text>

      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        keyboardType="numeric"
        placeholder="Votre réponse"
        placeholderTextColor={colors.textTertiary}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        autoFocus
      />

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
          <TouchableOpacity
            key={num}
            style={styles.keypadButton}
            onPress={() => handleNumberPress(num.toString())}
          >
            <Text style={styles.keypadButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.keypadButton} onPress={handleClear}>
          <Text style={styles.keypadButtonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.keypadButton, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.keypadButtonText}>✓</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Entrée = valider</Text>
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
    marginBottom: spacing.xl,
  },
  levelText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  prompt: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  input: {
    fontSize: typography.sizes.xxl,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    width: 200,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    gap: spacing.sm,
  },
  keypadButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  keypadButtonText: {
    fontSize: typography.sizes.xl,
    color: colors.text,
    fontWeight: typography.weights.semibold,
  },
  hint: {
    marginTop: spacing.lg,
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
  },
});
