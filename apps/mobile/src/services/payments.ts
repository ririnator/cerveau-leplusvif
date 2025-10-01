/**
 * Payments service - RevenueCat wrapper
 * Stub for V1, implement fully later
 */

import { Platform } from 'react-native';
import { getExpoConfig } from '../config/expo-config';

let REVENUECAT_ENABLED = false;
let hasWarned = false;

export async function initPurchases(): Promise<void> {
  const config = getExpoConfig();
  const apiKey = Platform.OS === 'ios' ? config.REVENUECAT_APPLE : config.REVENUECAT_ANDROID;

  if (!apiKey) {
    if (!hasWarned) {
      console.warn(
        `[Payments] RevenueCat ${Platform.OS.toUpperCase()} key not configured - running in stub mode`
      );
      hasWarned = true;
    }
    return;
  }

  REVENUECAT_ENABLED = true;
  // TODO: Integrate RevenueCat SDK when ready
  // import Purchases from 'react-native-purchases';
  // await Purchases.configure({ apiKey });
  console.log('[Payments] RevenueCat initialized (stub mode)');
}

export async function purchasePro(): Promise<boolean> {
  if (!REVENUECAT_ENABLED) {
    console.log('[Payments] Purchase stub - not implemented');
    return false;
  }
  // const { customerInfo } = await Purchases.purchasePackage(package)
  // return customerInfo.entitlements.active['pro'] != null
  return false;
}

export async function restorePurchases(): Promise<boolean> {
  if (!REVENUECAT_ENABLED) {
    console.log('[Payments] Restore stub - not implemented');
    return false;
  }
  // const customerInfo = await Purchases.restorePurchases()
  // return customerInfo.entitlements.active['pro'] != null
  return false;
}

export async function checkProStatus(): Promise<boolean> {
  if (!REVENUECAT_ENABLED) {
    return false;
  }
  // const customerInfo = await Purchases.getCustomerInfo()
  // return customerInfo.entitlements.active['pro'] != null
  return false;
}
