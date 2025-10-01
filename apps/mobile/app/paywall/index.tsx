import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors, spacing, typography } from '../../src/theme';
import { purchasePro, restorePurchases } from '../../src/services/payments';
import { setIsPro } from '../../src/services/storage';
import { trackPurchase } from '../../src/services/analytics';

export default function PaywallScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const success = await purchasePro();
      if (success) {
        setIsPro(true);
        trackPurchase('pro_monthly', 4.99);
        Alert.alert('Succès', 'Vous êtes maintenant Pro ! Profitez de sessions illimitées.', [
          { text: 'Continuer', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Erreur', 'Échec de l\'achat. Veuillez réessayer.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        setIsPro(true);
        Alert.alert('Succès', 'Vos achats ont été restaurés.', [
          { text: 'Continuer', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Info', 'Aucun achat à restaurer.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la restauration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.badge}>✨ PRO</Text>
          <Text style={styles.title}>Cerveau Vif Pro</Text>
          <Text style={styles.subtitle}>Entraînez-vous sans limites</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Feature icon="🎯" title="Sessions illimitées" description="Jouez autant que vous voulez, tous les jours" />
          <Feature icon="📊" title="Statistiques avancées" description="Suivez vos progrès sur 30-90 jours" />
          <Feature icon="🎮" title="Nouveaux jeux" description="Accès anticipé aux nouvelles activités" />
          <Feature icon="🔥" title="Pas de pub" description="Expérience sans interruption" />
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingTitle}>Abonnement mensuel</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>4,99 €</Text>
            <Text style={styles.priceUnit}>/mois</Text>
          </View>
          <Text style={styles.pricingSubtext}>
            Annulable à tout moment • Renouvellement automatique
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handlePurchase}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Traitement...' : 'Commencer l\'essai gratuit'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={loading}>
          <Text style={styles.restoreButtonText}>Restaurer mes achats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Peut-être plus tard</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legal}>
          L'abonnement se renouvelle automatiquement sauf annulation 24h avant la fin de la période.
          Gérez votre abonnement dans les réglages de votre compte.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
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
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  badge: {
    fontSize: typography.sizes.xl,
    marginBottom: spacing.sm,
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
  featuresCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: typography.sizes.xxl,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  pricingCard: {
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pricingTitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: typography.sizes.xxxl * 1.5,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  priceUnit: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  pricingSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  restoreButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  closeButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  legal: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.md,
  },
});
