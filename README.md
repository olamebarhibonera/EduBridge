# EduBridge Mobile (React Native + Expo)

EduBridge rebuilt with **React Native** and **Expo**, keeping all features from the web app.

## Features

- **Auth**: Email/password and OAuth (Google, Facebook) via Supabase
- **Home**: Quick actions (Translate, Budget, Services), emergency contacts, essential services, quick tips
- **Translate**: Source/target language, mock translation, common Swahili phrases, copy/speak
- **Budget**: Income/expense transactions, categories, add transaction modal, balance, breakdown by category
- **Services**: Search, categories, list with address/phone/hours, Get Directions & Call links
- **Profile**: User metadata, theme selector (light/dark/chocolate/pink), contact info, admin link, sign out
- **Admin**: Dashboard (placeholder) for users whose email contains `admin`
- **Themes**: Light, dark, chocolate, pink (persisted with AsyncStorage)

## Setup

1. Install dependencies:

   ```bash
   cd mobile
   npm install
   ```

2. (Optional) Supabase env: copy `.env.example` to `.env` and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` if you use a different project. If not set, the app uses the same project as the web app.

3. Run the app:

   ```bash
   npx expo start
   ```

   Then press `a` for Android, `i` for iOS, or `w` for web.

## Login: "Invalid login credentials"

If signup works but login says **Invalid login credentials**, Supabase is likely requiring **email confirmation**. Do this:

1. **Confirm your email** – Open the confirmation email from signup and tap the link. That signs you in and activates the account.
2. **Then log in** – Use the same email and password on the Login screen.

You can also tap **Resend confirmation email** on the login screen (shown when that error appears) to get a new link.

## Auth: Email confirmation and OAuth

- **Redirect URLs (required for email confirm + OAuth):** In [Supabase Dashboard](https://supabase.com/dashboard) → Authentication → URL Configuration, add:
  - `edubridge://auth/callback`
  - (Optional for web) Your web origin, e.g. `https://yourdomain.com`
- **Email confirmation:** Enable “Confirm email” in Authentication → Providers → Email. After sign up, users get a confirmation email; tapping the link opens the app and signs them in.
- **OAuth (Google/Facebook):** Add the same redirect URL above, then configure each provider in Auth → Providers with your app’s bundle ID / package name.

## Project structure

- `App.tsx` – Root with SafeArea, Theme, Auth, Navigation
- `src/contexts/` – AuthContext, ThemeContext
- `src/navigation/` – Stack + bottom tabs (RootNavigator)
- `src/screens/` – Home, Login, SignUp, AuthCallback, Translate, Budget, Services, Profile, Admin
- `src/components/` – MobileLayout (tab bar), ThemeSelector
- `src/theme/` – Theme colors (light, dark, chocolate, pink)
- `src/types/` – User, Transaction, Service, ThemeId
- `src/utils/supabase.ts` – Supabase client

## Original project

The web app remains in the repo root (`src/`, Vite + React). This mobile app is in the `mobile/` folder.
