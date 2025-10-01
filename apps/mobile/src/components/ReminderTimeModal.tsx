/**
 * Modal for setting daily reminder time
 * Shows on first launch or when user wants to change time
 */

import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useState } from 'react';
import { colors, spacing, typography } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  visible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  initialTime?: string;
}

export function ReminderTimeModal({ visible, onConfirm, onCancel, initialTime = '20:00' }: Props) {
  const [hours, minutes] = initialTime.split(':').map(Number);
  const [selectedTime, setSelectedTime] = useState(new Date(2000, 0, 1, hours, minutes));

  const handleConfirm = () => {
    const timeString = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
    onConfirm(timeString);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Rappel quotidien</Text>
          <Text style={styles.description}>
            À quelle heure voulez-vous recevoir votre rappel quotidien ?
          </Text>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              textColor="#ffffff"
              themeVariant="dark"
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Plus tard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#262626',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: '#ffffff',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.md,
    color: '#bbbbbb',
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#262626',
  },
  cancelText: {
    fontSize: typography.sizes.md,
    color: '#bbbbbb',
    fontWeight: typography.weights.semibold,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmText: {
    fontSize: typography.sizes.md,
    color: '#ffffff',
    fontWeight: typography.weights.bold,
  },
});
