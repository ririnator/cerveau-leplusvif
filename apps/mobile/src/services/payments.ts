/**
 * Payments service - RevenueCat wrapper
 * Stub for V1, implement fully later
 */

const REVENUECAT_ENABLED = false;

export async function initPurchases(): Promise<void> {
  if (!REVENUECAT_ENABLED) return;
  // Purchases.configure({ apiKey })
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
