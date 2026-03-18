# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Ideas Diary" — an Expo (React Native) mobile app for capturing, organizing, and revisiting ideas. Work in progress. The backend is a separate Django REST API (not in this repo) running at `http://127.0.0.1:8000/api/`.

## Commands

- `npx expo start` — start dev server (or `npm start`)
- `npx expo start --ios` / `--android` / `--web` — platform-specific
- `npm run lint` — runs `expo lint` (ESLint with expo flat config)
- No test runner is configured yet

## Architecture

**Routing:** Expo Router (file-based routing). All screens live as flat files in `app/`. The root layout (`app/_layout.tsx`) wraps the app in `PaperProvider` (theme) → `AuthProvider` (auth context) → `Stack` navigator.

**Screens:** `index.tsx` (home/dashboard), `Login.tsx`, `IdeasList.tsx`, `IdeaDetails.tsx`, `AddIdea.tsx`, `EditIdea.tsx`, `Settings.tsx`, `Loading.tsx`.

**Auth flow:** `app/context/AuthContext.tsx` provides auth state via React Context. JWT access/refresh tokens stored in AsyncStorage. The `useAuth()` hook (in `app/hooks/`) exposes `user`, `loading`, `login()`, `logout()`. The root layout conditionally renders Login vs authenticated screens based on auth state.

**API layer:** `app/services/api.ts` creates an Axios instance with interceptors that auto-attach Bearer tokens and handle 401 refresh logic. `app/services/ideas.ts` exports CRUD functions for the Idea resource.

**State management:** React Context + local component state only (no Redux/Zustand).

**UI framework:** React Native Paper (Material Design 3) with a custom purple theme defined in `app/customTheme.tsx`. Primary color: `#7c56a7`.

## Key Conventions

- TypeScript with strict mode; path alias `@/` maps to project root
- Expo new architecture enabled (`newArchEnabled: true`)
- Typed routes enabled in Expo Router
- API base URL is hardcoded in `app/services/api.ts` — toggle the commented Pinggy URL for mobile device testing
