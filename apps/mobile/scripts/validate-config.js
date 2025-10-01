#!/usr/bin/env node

/**
 * Validate Cerveau Vif mobile app configuration
 * Checks assets, config, and environment setup
 */

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const requiredAssets = ['icon.png', 'adaptive-icon.png', 'splash.png', 'favicon.png'];

let hasErrors = false;
let hasWarnings = false;

console.log('🔍 Validating Cerveau Vif Configuration\n');

// Check 1: Assets exist
console.log('📁 Checking assets...');
requiredAssets.forEach((asset) => {
  const assetPath = path.join(assetsDir, asset);
  if (fs.existsSync(assetPath)) {
    const stats = fs.statSync(assetPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ ${asset} (${sizeKB}KB)`);
  } else {
    console.log(`   ❌ ${asset} MISSING`);
    hasErrors = true;
  }
});
console.log('');

// Check 2: app.config.ts exists
console.log('⚙️  Checking configuration...');
const configPath = path.join(__dirname, '..', 'app.config.ts');
if (fs.existsSync(configPath)) {
  console.log('   ✅ app.config.ts exists');

  const configContent = fs.readFileSync(configPath, 'utf8');

  // Check bundle identifiers
  if (configContent.includes('com.tonorg.cerveauvif')) {
    console.log('   ✅ Bundle identifiers configured');
  } else {
    console.log('   ⚠️  Bundle identifiers may need updating');
    hasWarnings = true;
  }

  // Check runtime version
  if (configContent.includes('runtimeVersion')) {
    console.log('   ✅ Runtime version policy set');
  } else {
    console.log('   ⚠️  Runtime version policy not configured');
    hasWarnings = true;
  }
} else {
  console.log('   ❌ app.config.ts MISSING');
  hasErrors = true;
}
console.log('');

// Check 3: Environment variables
console.log('🔐 Checking environment...');
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envExamplePath)) {
  console.log('   ✅ .env.example exists (template)');
} else {
  console.log('   ❌ .env.example MISSING');
  hasErrors = true;
}

if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists');

  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasPostHog = envContent.includes('POSTHOG_KEY=') && !envContent.match(/POSTHOG_KEY=\s*$/m);
  const hasRevenueCat =
    (envContent.includes('REVENUECAT_APPLE=') && !envContent.match(/REVENUECAT_APPLE=\s*$/m)) ||
    (envContent.includes('REVENUECAT_ANDROID=') && !envContent.match(/REVENUECAT_ANDROID=\s*$/m));

  if (hasPostHog) {
    console.log('   ✅ PostHog key configured');
  } else {
    console.log('   ⚠️  PostHog key not set (app will run in no-op mode)');
    hasWarnings = true;
  }

  if (hasRevenueCat) {
    console.log('   ✅ RevenueCat key(s) configured');
  } else {
    console.log('   ⚠️  RevenueCat keys not set (payments will be stubbed)');
    hasWarnings = true;
  }
} else {
  console.log('   ⚠️  .env file not found (app will use stubs)');
  console.log('      Copy .env.example to .env and configure keys');
  hasWarnings = true;
}
console.log('');

// Check 4: Dependencies
console.log('📦 Checking dependencies...');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  const requiredDeps = ['expo', 'expo-router', 'expo-constants', 'react-native-mmkv'];

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep} installed`);
    } else {
      console.log(`   ❌ ${dep} MISSING`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ❌ package.json MISSING');
  hasErrors = true;
}
console.log('');

// Check 5: TypeScript
console.log('📝 Checking TypeScript...');
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  console.log('   ✅ tsconfig.json exists');
} else {
  console.log('   ❌ tsconfig.json MISSING');
  hasErrors = true;
}
console.log('');

// Summary
console.log('═'.repeat(50));
if (hasErrors) {
  console.log('❌ VALIDATION FAILED - Fix errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  VALIDATION PASSED WITH WARNINGS');
  console.log('   App will run but some features may be limited');
  console.log('   Review warnings above');
} else {
  console.log('✅ VALIDATION PASSED - All checks OK!');
}
console.log('═'.repeat(50));
console.log('');

if (!hasErrors) {
  console.log('🚀 Ready to run:');
  console.log('   npm run ios        # iOS Simulator');
  console.log('   npm run android    # Android Emulator');
  console.log('   npm start          # Development server');
  console.log('');
}
