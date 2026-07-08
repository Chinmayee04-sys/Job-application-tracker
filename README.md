# JobTrack

A **React Native** job application tracker built with **Expo SDK 57** — track applications, discover jobs, manage interviews, all in one place.

## Tech Stack

- **Framework**: React Native via Expo SDK 57
- **Target**: Web (react-native-web), also supports iOS & Android
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS), custom theme system
- **Forms**: React Hook Form + Zod validation
- **State**: React Query (server state), React Context (auth/theme)
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons
- **Storage**: AsyncStorage (native) / localStorage (web)
- **Calendar**: react-native-calendars
- **API**: Reed.co.uk job search API

## Features

- **Dashboard** — Stats overview (total, applied, interviews, offers), recent applications, job opportunities feed
- **Applications** — Full CRUD with status tracking (wishlist → applied → interview → rejected → offer)
- **Job Discovery** — Browse live listings from Reed.co.uk API with mock fallback
- **Calendar** — View and manage interview dates
- **Profile** — User settings, dark mode toggle
- **Dark Mode** — Full theme support with persistent preference
- **Animations** — Smooth transitions and micro-interactions via Reanimated
- **Responsive** — Works on web, iOS, and Android

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI (`npx expo`)

### Installation

```bash
git clone https://github.com/Chinmayee04-sys/Job-application-tracker.git
cd Job-application-tracker
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
REED_API_KEY=your_reed_api_key
```

Get a free API key at [reed.co.uk](https://www.reed.co.uk/developers). The app works without it (uses mock data).

### Run

```bash
npx expo start --web
```

For native:

```bash
npx expo start        # scan QR with Expo Go
npx expo start --ios  # iOS simulator
npx expo start --android  # Android emulator
```

### Build for Production

```bash
npx expo export --platform web
```

Output goes to `dist/`.

## Project Structure

```
src/
├── app/                  # Expo Router pages
│   ├── (auth)/           # Login, Register
│   ├── (tabs)/           # Dashboard, Applications, Calendar, Profile
│   ├── api/              # API routes (Reed proxy)
│   ├── application/      # Add/Edit, Detail screens
│   └── job/              # Job detail screen
├── components/           # Reusable components
│   ├── ui/               # Button, Card, Input, etc.
│   └── ...               # ApplicationCard, AuthGuard, ErrorBoundary
├── constants/            # Colors, theme tokens
├── hooks/                # useAuth, useApplications, useJobs, etc.
├── services/             # API clients, storage, notifications
├── store/                # State management (React Context)
└── types/                # TypeScript interfaces
```

## License

MIT
