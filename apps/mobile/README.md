# Cerveau Vif - Mobile App

React Native mobile app built with Expo for daily cognitive training.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9
- iOS Simulator (Xcode on macOS) or Android Emulator (Android Studio)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or run directly on platform
npm run ios        # iOS Simulator
npm run android    # Android Emulator
```

## 📁 Project Structure

```
apps/mobile/
├── app/                    # expo-router screens
│   ├── index.tsx          # Home screen
│   ├── session/           # Session runner
│   ├── recap/             # Results
│   ├── paywall/           # Pro subscription
│   └── settings/          # Settings
├── src/
│   ├── components/        # Game views
│   ├── services/          # Storage, analytics, payments
│   ├── theme/             # Design system
│   ├── hooks/             # Custom hooks
│   └── config/            # App configuration
├── assets/                # Icons, splash screens
├── scripts/               # Build & asset generation
├── app.config.ts          # Expo configuration
└── .env.example           # Environment variables template
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostHog Analytics (optional)
POSTHOG_KEY=your_posthog_key
POSTHOG_HOST=https://eu.posthog.com

# RevenueCat Payments (optional)
REVENUECAT_APPLE=your_ios_key
REVENUECAT_ANDROID=your_android_key
```

**Note**: The app runs without these keys (stub mode). Services will log warnings but won't crash.

### App Identifiers

Configured in `app.config.ts`:

- **iOS Bundle ID**: `com.tonorg.cerveauvif`
- **Android Package**: `com.tonorg.cerveauvif`
- **Scheme**: `cerveauvif://`

**For simulator-only builds**, you can use test identifiers:
- iOS: `com.test.cerveauvif`
- Android: `com.test.cerveauvif`

Change in `app.config.ts`:
```typescript
ios: {
  bundleIdentifier: 'com.test.cerveauvif', // Change here
},
android: {
  package: 'com.test.cerveauvif', // Change here
},
```

### Assets

Assets are located in `assets/`:
- `icon.png` (1024x1024) - App icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon foreground
- `splash.png` (3000x3000) - Splash screen
- `favicon.png` (48x48) - Web favicon

**Regenerate placeholder assets**:
```bash
npm run generate-assets
```

See `assets/README.md` for asset requirements and design guidelines.

## 🏃 Development

### Run Development Server

```bash
# Start with cache cleared
npm start

# Or with platform selection
npm run ios
npm run android
npm run web
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📦 Building

### Development Build (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Preview Build

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### Production Build

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Local Native Build (Advanced)

```bash
# Generate native projects
npm run prebuild

# Run with native tooling
npx expo run:ios
npx expo run:android
```

## 🧪 Testing

### Unit Tests (Core Logic)

Game logic tests are in `../../packages/core-logic/tests/`:

```bash
cd ../../packages/core-logic
npm test
```

### Manual Testing Checklist

- [ ] App boots without .env file (shows warnings)
- [ ] App boots with .env configured (no warnings)
- [ ] Home screen displays correctly
- [ ] Session runs full 10-minute flow
- [ ] All 3 games work (Arithmetic, Sequences, Stroop)
- [ ] Recap shows correct statistics
- [ ] Streak tracking persists across restarts
- [ ] Free quota limits to 1 session/day
- [ ] Paywall appears after quota used
- [ ] Dark theme consistent throughout
- [ ] Icon and splash screen appear correctly

## 🔍 Validation Checklist

After configuration, verify:

### 1. Expo Config

```bash
# Show current config
npx expo config --type public

# Check for correct bundle IDs
npx expo config | grep -E "bundleIdentifier|package"
```

Expected output:
```json
"bundleIdentifier": "com.tonorg.cerveauvif",
"package": "com.tonorg.cerveauvif"
```

### 2. Assets

```bash
# Check assets exist
ls -lh assets/*.png

# Expected files:
# icon.png (1024x1024, ~50KB)
# adaptive-icon.png (1024x1024, ~20KB)
# splash.png (3000x3000, ~200KB)
# favicon.png (48x48, ~1KB)
```

### 3. Environment Variables

```bash
# Test without .env (should show warnings but not crash)
rm .env
npm run dev

# Test with .env (should show no warnings)
cp .env.example .env
# Add keys to .env
npm run dev
```

### 4. Dark Background

Launch app and verify:
- Splash screen background is `#0a0a0a` (very dark)
- All screens use dark theme
- No white flashes during transitions

## 📱 Platform-Specific Notes

### iOS

- Requires macOS with Xcode installed
- Test on Simulator: `npm run ios`
- Physical device: Use EAS or TestFlight
- Bundle ID must be unique (register in Apple Developer Portal for production)

### Android

- Can develop on any platform
- Test on Emulator: `npm run android`
- Physical device: Enable USB debugging or use EAS
- Package name must be unique (register in Google Play Console for production)

## 🔐 Security

- `.env` is gitignored - never commit API keys
- Use `.env.example` for documentation only
- For production, use EAS Secrets: `eas secret:create`

## 🐛 Troubleshooting

### Metro bundler won't start

```bash
npm start -- --clear
# or
npx expo start -c
```

### Dependencies not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Assets not updating

```bash
# Regenerate assets
npm run generate-assets

# Clear cache
npm start -- --clear
```

### Type errors

```bash
npm run type-check
```

### Build fails

```bash
# Clean and rebuild
rm -rf .expo ios android
npm run prebuild
```

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Main README](../../README.md) - Project overview

## 🎯 Next Steps

1. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add PostHog and RevenueCat keys (optional)

2. **Customize Assets**
   - Replace placeholder icons with branded designs
   - See `assets/README.md` for specifications

3. **Test Thoroughly**
   - Run through complete session flow
   - Test on both iOS and Android
   - Verify dark theme on all screens

4. **Prepare for Production**
   - Set up EAS project: `eas build:configure`
   - Add proper app icons and splash screens
   - Configure proper bundle identifiers
   - Set up CI/CD for automated builds

---

**Happy coding!** 🚀
