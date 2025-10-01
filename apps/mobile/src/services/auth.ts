/**
 * Auth service - Supabase stub for Phase 3
 */

export async function signIn(email: string, password: string): Promise<boolean> {
  console.log('[Auth] Sign in stub - not implemented');
  return false;
}

export async function signUp(email: string, password: string): Promise<boolean> {
  console.log('[Auth] Sign up stub - not implemented');
  return false;
}

export async function signOut(): Promise<void> {
  console.log('[Auth] Sign out stub - not implemented');
}

export async function getCurrentUser(): Promise<any | null> {
  return null;
}
