# Quick Start Guide

## Prerequisites
- Node.js >= 18
- npm >= 9
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Xcode) or Android Studio

## Installation

1. **Install all dependencies:**
```bash
npm install
```

2. **Run tests to verify setup:**
```bash
cd packages/core-logic
npm test
```

Expected: ✅ 32 tests passing

## Running the App

### iOS Simulator (macOS only)
```bash
cd apps/mobile
npm install
npm run ios
```

### Android Emulator
```bash
cd apps/mobile
npm install
npm run android
```

### Web (for quick testing)
```bash
cd apps/mobile
npm run web
```

## Development Workflow

1. **Make changes to core logic:**
   - Edit files in `packages/core-logic/src/`
   - Run tests: `cd packages/core-logic && npm test`

2. **Make changes to mobile UI:**
   - Edit files in `apps/mobile/app/` or `apps/mobile/src/`
   - Hot reload will update automatically

3. **Run full build:**
```bash
npm run build
```

## Key Files to Start With

- **Home Screen:** `apps/mobile/app/index.tsx`
- **Session Runner:** `apps/mobile/app/session/index.tsx`
- **Game Engines:** `packages/core-logic/src/*.ts`
- **Storage:** `apps/mobile/src/services/storage.ts`

## Troubleshooting

### Metro bundler won't start
```bash
cd apps/mobile
npx expo start --clear
```

### Dependencies not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tests failing
```bash
cd packages/core-logic
rm -rf node_modules
npm install
npm test
```

## Next Steps

1. Add actual icon/splash assets to `apps/mobile/assets/`
2. Configure PostHog API key for analytics
3. Set up RevenueCat for payments
4. Test on physical devices
5. Set up EAS for app store builds

## Useful Commands

```bash
# Root level (uses Turbo)
npm run dev          # Start all dev servers
npm run build        # Build all packages
npm test             # Run all tests
npm run type-check   # TypeScript check
npm run clean        # Clean all build artifacts

# Core logic package
cd packages/core-logic
npm test             # Run unit tests
npm run test:watch   # Watch mode

# Mobile app
cd apps/mobile
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser
```

## Architecture Overview

```
Cerveau Vif/
├── apps/mobile/              # React Native Expo app
│   ├── app/                 # expo-router screens
│   └── src/                 # Components, services, hooks
│
├── packages/core-logic/      # Pure TypeScript game engines
│   ├── src/                 # Game logic
│   └── tests/               # Vitest tests
│
└── .github/workflows/        # CI/CD
```

## Support

For issues or questions, check:
1. README.md for detailed docs
2. Code comments in source files
3. GitHub Issues (if applicable)

Happy coding! 🚀
