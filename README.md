# CityExplorer

A React Native app for discovering and planning trips around cities using real OpenStreetMap data. Think of it as your personal city exploration companion that actually uses open-source map data instead of relying on proprietary APIs.

## What This Does

Built this to solve a simple problem: finding interesting places in a city and organizing them into an actual plan. No ads, no sponsored listings, just pure OpenStreetMap goodness.

**Core features:**
- Search cities worldwide (powered by Nominatim)
- Browse places by category (museums, cafes, parks, historic sites, etc.)
- Interactive map with real-time place markers
- Multi-day trip planner with time slots
- Favorites system
- Light/dark theme 
- Works offline once you've loaded the data

The whole thing is built on OpenStreetMap's Overpass API, which means it's using the same data as OSM contributors maintain. Sometimes you'll find gems that Google Maps doesn't even know about.

## Tech Stack

Here's what's under the hood (and why I picked each):

- **React Native 0.81.5** - Latest stable version with the new architecture enabled
- **Expo 54** - Because native modules without the headache is a blessing
- **TypeScript** - Caught way too many bugs during development to go back to JS
- **React Navigation v7** - Bottom tabs + stack navigator combo
- **React Query (TanStack)** - Server state management that actually makes sense
- **Zustand** - For client state. Redux felt like overkill for this
- **Axios** - HTTP client with better defaults than fetch
- **react-native-maps** - The map component everyone uses (for good reason)
- **AsyncStorage** - Local persistence for favorites and plans

### API Services

**Nominatim API** (geocoding):
- Rate limit: 1 request/second (they're strict about this)
- Free tier, no API key needed
- Returns city data with coordinates

**Overpass API** (POI data):
- Multiple fallback instances (sometimes they get overloaded)
- Rate limit: 1 request/2 seconds
- Query timeout: 30 seconds
- Returns raw OpenStreetMap elements with all tags

Pro tip: The Overpass instances can be slow during European peak hours. I've added automatic failover to backup servers, but patience is key sometimes.

## Getting Started

### Prerequisites

You'll need these installed:
- Node.js 18+ (I'm using 18.17.0)
- npm or yarn (your choice, I use npm)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio with SDK 33+ (for Android builds)
- Xcode 14+ (if you're on Mac and want iOS builds)

### Installation

```bash
# Clone it
git clone https://github.com/EbrarTikit/CityExplorer.git
cd CityExplorer

# Install dependencies (grab a coffee, this takes a minute)
npm install

# Start the development server
npm start
```

### Running on Device

**Development mode:**
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios

# Web (works but maps are limited)
npm run web
```

The app will connect to Expo Go on your device automatically. Make sure your phone and computer are on the same WiFi network.

**First launch takes longer** - it's downloading the JS bundle. Subsequent launches are way faster.

## Project Structure

I organized this by feature rather than file type. Works better as the app grows:

```
src/
├── app/                    # Root app setup
│   ├── navigation/         # Navigation config
│   └── providers/          # Theme & Query providers
├── features/
│   ├── city/              # City search & selection
│   │   ├── api/           # Nominatim client
│   │   ├── components/    # Search input, suggestions
│   │   ├── hooks/         # useCitySearch, useCurrentCity
│   │   └── store/         # City state (Zustand)
│   ├── places/            # Place discovery
│   │   ├── api/           # Overpass client & queries
│   │   ├── components/    # PlaceCard, CategoryChips
│   │   ├── hooks/         # usePlaces, usePlaceDetail
│   │   ├── screens/       # Explore & Detail screens
│   │   ├── store/         # Favorites store
│   │   └── utils/         # Category definitions, parsers
│   ├── map/               # Map view
│   │   ├── components/    # Markers, bottom sheet
│   │   ├── hooks/         # useMapPlaces
│   │   └── screens/       # MapScreen
│   └── plan/              # Travel planner
│       ├── components/    # DayTabs, PlanItemRow
│       ├── screens/       # PlanScreen
│       ├── store/         # Plan state
│       └── utils/         # Share functionality
└── shared/                # Reusable stuff
    ├── components/        # Button, Input, LoadingSpinner
    ├── hooks/             # useTheme, useDebounce
    ├── theme/             # Colors, spacing, typography
    └── lib/               # Rate limiter, storage utils
```

Each feature is self-contained. If you want to rip out the plan feature, just delete the `plan/` folder and update navigation. That's it.

## Configuration

### Environment Setup

The app uses OpenStreetMap services which don't need API keys (thank you, open source gods). But you should set a custom User-Agent:

`src/shared/constants/env.ts`:
```typescript
export const ENV = {
  NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
  OVERPASS_BASE_URL: 'https://overpass-api.de/api/interpreter',
  APP_USER_AGENT: 'CityExplorer/1.0.0 (tikitebrar@gmail.com)', 
};
```

### Rate Limiting

Both APIs are rate-limited on the client side:

- **Nominatim:** 1 req/sec (hard limit, they'll block you otherwise)
- **Overpass:** 1 req/2sec (configurable, but be nice)

The rate limiter is implemented in `src/shared/lib/rateLimiter.ts` using a simple queue system. Works pretty well, but if you're testing queries aggressively, you'll notice the throttling.

### Storage

Uses AsyncStorage for:
- Favorites list
- Travel plans
- Last selected city
- User preferences (theme, etc.)

Data persists across app restarts. No cloud sync (maybe v2?).

## Features Breakdown

### 1. City Search
Type a city name, get suggestions from Nominatim. Supports:
- Autocomplete with 300ms debounce
- Multiple languages (tries Turkish then English)
- Fallback to user location if search fails
- Persistent "last city" on app restart

Heads up: Nominatim is case-insensitive but sometimes the sorting is weird. It's not us, it's their algorithm.

### 2. Place Discovery
Browse points of interest by category:
- **Popüler** - Tourist attractions, viewpoints
- **Müzeler** - Museums, galleries
- **Tarihi** - Historic sites, monuments
- **Yeme-İçme** - Restaurants, cafes
- **Gezilecek** - General tourism spots
- **Manzara** - Viewpoints, natural landmarks

Each place shows:
- Name, category, distance
- Opening hours (if available)
- Description from OSM
- Direct links to Wikipedia/website
- All OSM tags (translated to Turkish)

The Overpass queries pull data within a 5km radius. You can change this in `buildOverpassQuery.ts` but be careful - larger radius = slower queries.

### 3. Interactive Map
React Native Maps with custom markers:
- Color-coded by category
- Tap to preview in bottom sheet
- Real-time updates as you pan
- Integrates with device location

Known quirk: On Android, the map sometimes takes a second to load tiles. It's a react-native-maps thing, not our code.

### 4. Travel Planner
Multi-day itinerary builder:
- Add places with one tap (selects day if multiple days exist)
- Reorder items within a day
- Set time slots for each place
- Add personal notes
- Share entire plan as text

Everything saves locally in real-time. No backend, no account needed.

### 5. Dark Mode
Auto-follows system preference or manual toggle. All screens support both themes. Took way longer to get right than I'd like to admit.

## License

MIT - Do whatever you want with it. If you make something cool, let me know though. I'm curious.

## Credits

Built by [@EbrarTikit](https://github.com/EbrarTikit)

Powered by:
- [OpenStreetMap](https://www.openstreetmap.org) - The real MVP
- [Nominatim](https://nominatim.org) - Geocoding service
- [Overpass API](https://overpass-api.de) - OSM data queries

