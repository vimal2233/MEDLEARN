# MedLearn - MBBS Mobile Learning Application

> **Learn Smarter. Remember Longer. Become Better.**

A professional mobile learning application for MBBS students built with Expo, React Native, TypeScript, and Supabase.

## Features

### Core Learning
- **Structured MBBS Curriculum** - Complete Indian MBBS curriculum organized by phases, subjects, chapters, and topics
- **Micro-Learning** - Bite-sized 5-10 minute lessons with interactive elements
- **Medical Notes** - Detailed, point-wise, and revision notes with clinical correlations
- **Visual Learning** - Anatomy diagrams, histology images, pathology specimens with zoom and annotation

### Practice & Assessment
- **Question Bank** - Thousands of MCQs with detailed explanations and clinical relevance
- **Quiz Engine** - Topic, chapter, subject, mixed, timed, and mock examinations
- **Flashcards** - Spaced repetition using FSRS algorithm for long-term retention
- **Clinical Cases** - Interactive case simulations with diagnostic reasoning

### AI-Powered Learning
- **AI Medical Tutor** - 24/7 personalized explanations, mnemonics, viva practice
- **Multiple Modes** - Simple, MBBS-level, Exam, Viva, Clinical reasoning
- **Context-Aware** - Integrates with your learning progress and weak areas

### Planning & Analytics
- **Study Planner** - Daily goals, scheduled tasks, exam date tracking
- **Performance Analytics** - Subject progress, weak areas, study time, retention rates
- **Gamification** - XP, streaks, achievements, daily missions

### Technical Features
- **Offline Support** - Download content for offline learning
- **Cross-Platform** - Android (primary) and iOS support
- **Secure** - Supabase Auth with Row Level Security
- **Real-time Sync** - Automatic synchronization when online

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 58 + React Native 0.88 |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| State Management | TanStack Query + Zustand |
| Styling | Custom design system with theme support |
| Testing | Jest + React Native Testing Library |
| Build | EAS Build |

## Project Structure

```
MEDLEARN/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout
│   ├── (auth)/                  # Authentication screens
│   ├── (onboarding)/            # First-time user flow
│   ├── (tabs)/                  # Main tab navigation
│   └── ...                      # Feature screens
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base components (Button, Card, Input)
│   │   ├── common/              # Shared components
│   │   ├── charts/              # Data visualization
│   │   └── learning/            # Learning-specific components
│   ├── features/                # Feature modules
│   ├── services/                # API and business logic
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React contexts (Auth, Theme)
│   ├── lib/                     # External library configs
│   ├── database/                # Database types and queries
│   ├── types/                   # TypeScript type definitions
│   ├── constants/               # App constants
│   ├── utils/                   # Utility functions
│   └── theme/                   # Design system (colors, spacing, typography)
├── supabase/
│   ├── migrations/              # Database migrations
│   ├── functions/               # Edge Functions
│   └── seed/                    # Seed data
├── assets/                      # Images, fonts, icons
├── tests/                       # Test files
├── scripts/                     # Build and utility scripts
├── app.json                     # Expo config
├── eas.json                     # EAS Build config
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (for Android development)
- Physical Android device with USB debugging enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vimal2233/MEDLEARN.git
   cd MEDLEARN
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Run migrations: `npx supabase db push` (or apply via dashboard)
   - Copy your project URL and anon key to `.env`

5. **Start development server**
   ```bash
   npx expo start
   ```

### Running on Android Device

1. **Enable USB debugging** on your Android phone
2. **Connect via USB** and verify:
   ```bash
   adb devices -l
   ```
3. **Install development build:**
   ```bash
   npx expo run:android --device
   ```
4. **Or start with dev client:**
   ```bash
   npx expo start --dev-client
   ```

## Database Setup

The Supabase schema includes:

- **User Management**: Profiles, preferences, authentication
- **Curriculum**: Phases, subjects, chapters, topics, lessons
- **Question Bank**: Questions, options, images, quizzes
- **Flashcards**: Decks, cards, FSRS spaced repetition reviews
- **Clinical Cases**: Cases, attempts, learning points
- **Study Planner**: Plans, tasks, scheduling
- **Progress Tracking**: User progress, daily activity, achievements
- **Personal Data**: Bookmarks, notes, AI conversations
- **Offline Sync**: Sync queue for offline-first architecture

Run migrations in order:
1. `20240101000001_initial_schema.sql` - Tables and indexes
2. `20240101000002_rls_policies.sql` - Row Level Security
3. `20240101000003_seed_data.sql` - Academic phases, subjects, achievements

## EAS Build Configuration

### Build Profiles

| Profile | Purpose | Output |
|---------|---------|--------|
| `development` | Physical device testing | APK |
| `preview` | Internal distribution | APK |
| `production` | Play Store release | AAB |

### Build Commands

```bash
# Development build for device testing
eas build --profile development --platform android

# Preview build for internal testing
eas build --profile preview --platform android

# Production build for Play Store
eas build --profile production --platform android
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Type checking
npx tsc --noEmit

# Expo doctor (dependency check)
npx expo-doctor
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `EXPO_PUBLIC_AI_API_URL` | No | AI tutor backend endpoint |
| `EXPO_PUBLIC_AI_API_KEY` | No | AI API key |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

MedLearn is an educational support tool. It does not provide medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals and official curriculum materials for medical education.

## Support

- Repository: https://github.com/vimal2233/MEDLEARN
- Issues: https://github.com/vimal2233/MEDLEARN/issues

---

Built with ❤️ for MBBS students everywhere.