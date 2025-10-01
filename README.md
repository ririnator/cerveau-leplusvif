# Cerveau Vif

**Daily 10-minute cognitive training mobile app built with Expo + React Native**

Cerveau Vif (Sharp Mind) is a mobile application that provides daily 10-minute cognitive training sessions. The app measures and improves cognitive abilities including processing speed, attention, and working memory through scientifically-designed mini-games.

## 🎯 Features

### V1 Core Features
- **3 Mini-Games (3 minutes each)**
  - **Arithmetic Blitz**: Fast-paced mental arithmetic
  - **Logical Sequences**: Arithmetic progression pattern recognition
  - **Stroop Binary**: Color-word interference task (Stroop effect)

- **Adaptive Difficulty**: Dynamic level adjustment (1-10) based on performance
  - Level up after 3 correct answers in a row
  - Level down on errors
  - Ensures optimal cognitive challenge

- **Comprehensive Scoring System**
  - Points based on level and streak bonuses
  - Accuracy tracking
  - Average response time measurement

- **Streak & Progress Tracking**
  - Daily streak counter
  - Best streak record
  - Session history with detailed breakdowns

- **Freemium Model**
  - 1 free session per day
  - Pro subscription: unlimited sessions + advanced stats
  - In-app purchase via RevenueCat

- **Analytics Integration**
  - PostHog event tracking (session_start, answer, level_up, session_end, paywall_view, purchase)
  - Safe no-op mode when API keys not configured

## 🏗️ Architecture

### Monorepo Structure (Turborepo)

```
/
├── apps/
│   └── mobile/              # Expo React Native app
│       ├── app/             # expo-router screens
│       │   ├── index.tsx    # Home screen
│       │   ├── session/     # Session runner
│       │   ├── recap/       # Results & insights
│       │   ├── paywall/     # Pro subscription
│       │   └── settings/    # Settings
│       └── src/
│           ├── components/  # Game views (Arithmetic, Sequences, Stroop)
│           ├── services/    # Storage, Analytics, Payments, Auth
│           ├── theme/       # Colors, spacing, typography
│           └── hooks/       # useSessionRunner
│
└── packages/
    └── core-logic/          # Pure TypeScript game engines
        ├── src/
        │   ├── arithmetic.ts
        │   ├── sequences.ts
        │   ├── stroop.ts
        │   ├── common.ts
        │   └── engines/
        │       ├── GameEngine.ts    # Types & interfaces
        │       └── SessionComposer.ts
        └── tests/           # Vitest unit tests
```

### Tech Stack

- **Framework**: Expo SDK ~52.0
- **Language**: TypeScript (strict mode)
- **Navigation**: expo-router
- **State Management**: React hooks + reducers
- **Storage**: react-native-mmkv (fast local persistence)
- **Analytics**: PostHog (with safe stubs)
- **Payments**: RevenueCat (with stubs for V1)
- **Auth**: Supabase (planned Phase 3)
- **Testing**: Vitest (unit), Detox (E2E planned)
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- iOS Simulator (macOS) or Android Emulator
- Expo CLI

### Installation

1. **Clone and install dependencies:**

```bash
cd "Cerveau Vif"
npm install
```

2. **Install dependencies for all workspaces:**

```bash
# This installs deps for both packages/core-logic and apps/mobile
npm install
```

### Development

**Run on iOS Simulator:**
```bash
cd apps/mobile
npm run ios
```

**Run on Android:**
```bash
cd apps/mobile
npm run android
```

**Run tests:**
```bash
npm test
```

**Type checking:**
```bash
npm run type-check
```

### Project Commands

From the root directory:
- `npm run dev` - Start all dev servers (Turbo)
- `npm run build` - Build all packages
- `npm test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages

## 🎮 How It Works

### Game Mechanics

#### 1. Arithmetic Blitz
- Mental arithmetic with +, -, × operations
- Difficulty scales with level (larger numbers, more operations)
- Multiplication introduced at level 6+

#### 2. Logical Sequences
- Arithmetic progressions with constant step
- Find the next term in the sequence
- Increasing sequence length and step range at higher levels
- Both increasing and decreasing sequences

#### 3. Stroop Binary
- Word-color matching task (Stroop effect)
- Answer "Oui" if word matches ink color, "Non" otherwise
- Increasing incongruent ratio at higher levels (makes it harder)

### Scoring Formula

**Correct answer:**
```
score += 10 + (2 × level) + max(0, streak - 1)
```

**Incorrect answer:**
```
score = max(0, score - 5)
```

### Adaptive Difficulty

- **Level Up**: After 3 correct answers in a row
- **Level Down**: Immediately after an error
- **Range**: Clamped between 1 and 10

### Session Flow

1. User taps "Jouer 10:00" on Home screen
2. 3 games run sequentially (3 minutes each = 9 minutes total)
3. 1-minute recap screen with detailed stats
4. Streak updated, quota consumed (if free)
5. Option to replay or return home

### Free vs Pro

**Free Tier:**
- 1 session per day (resets at midnight)
- Basic stats (last session)
- Streak tracking

**Pro Tier (4.99€/month):**
- Unlimited sessions
- 30-90 day statistics
- Early access to new games
- No ads

## 🧪 Testing

### Unit Tests (Vitest)

Tests cover core game logic in `packages/core-logic`:

```bash
cd packages/core-logic
npm test
```

**Test Coverage:**
- Arithmetic engine: 15+ tests (level bounds, operations, scoring, level transitions)
- Sequences engine: 7+ tests (generation, difficulty scaling, negative steps)
- Stroop engine: 8+ tests (color logic, congruency, difficulty)
- Common utilities: 6+ tests (clamp, randInt, formatTime, etc.)

**Total: 30+ unit tests**

### E2E Tests (Planned)

Detox tests for critical user flows (planned for future sprint).

## 📊 Analytics Events

The app tracks the following events via PostHog:

- `session_start` - User begins a 10-minute session
- `answer` - Each answer submission (game type, correct, level, response time)
- `level_up` - Difficulty increases
- `session_end` - Session completes (total score, accuracy, duration)
- `paywall_view` - Paywall screen displayed
- `purchase` - User completes Pro purchase

*All analytics are safe no-ops if PostHog API key is not configured.*

## 🎨 Design System

### Dark Theme
- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Primary: `#6366f1` (Indigo)
- Success: `#10b981`
- Error: `#ef4444`

### Typography
- Sizes: xs(12), sm(14), md(16), lg(20), xl(24), xxl(32), xxxl(48)
- Weights: normal(400), medium(500), semibold(600), bold(700)

### Spacing
- xs(4), sm(8), md(16), lg(24), xl(32), xxl(48)

## 🔐 Data & Privacy

### Local Storage (MMKV)
- Best streak
- Current streak
- Last played date
- Last session results
- Free quota usage
- Pro status

### Cloud Sync (Phase 3)
- Optional Supabase integration
- User authentication
- Cross-device session history

## 📱 Platform Support

- **iOS**: 13.0+
- **Android**: API 24+ (Android 7.0+)
- **Tested on**: iPhone Simulator, Android Emulator

## 🛣️ Roadmap

### V1 (Current) ✅
- Core 3 games
- Adaptive difficulty
- Local persistence
- Freemium gating
- Analytics stubs
- Unit tests

### V2 (Planned)
- Additional games (Memory Matrix, Word Association)
- Enhanced statistics dashboard
- Weekly/monthly reports
- Social features (opt-in leaderboards)

### V3 (Future)
- Cloud sync via Supabase
- User accounts
- Cross-device progress
- Personalized training programs

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome via issues.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Inspired by Peak and Lumosity
- Built with Expo and React Native
- Cognitive science principles from research literature

---

**Build with ❤️ for daily brain training**
