# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js portfolio application with a "Metro" (subway) map theme. It uses React 19, Tailwind CSS v4, and Framer Motion for animations.

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Icons**: Lucide React
- **Animation**: Framer Motion

## Development Commands

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Start Production Server**: `npm run start`
- **Lint Code**: `npm run lint`

## Code Structure

The source code is located in the `src` directory:

- `src/app/`: Next.js App Router pages and layouts.
  - `page.tsx`: Main entry point.
  - `layout.tsx`: Root layout.
  - `providers.tsx`: Global providers wrapper.
- `src/components/`: React components organized by domain.
  - `metro/`: Components related to the metro map visualization (Map, Lines, Stops).
  - `content/`: Content sections (About Me, Contact, Projects).
  - `accessibility/`: Accessibility features (Panel, Reading Guide).
  - `layout/`: Structural components (Header, Footer, SplitScreen).
  - `ui/`: Generic UI components.
- `src/contexts/`: Global state contexts (Metro, Accessibility, Modal).
- `src/hooks/`: Custom React hooks.
- `src/data/`: Static data definitions (lines, stops).
- `src/types/`: TypeScript type definitions.
- `src/lib/`: Utility functions (e.g., `cn` for Tailwind class merging).
- `src/styles/`: Global styles and font configurations.

## Architecture Notes

- **Layout**: The application uses a `SplitScreen` layout, likely dividing the view between the interactive Metro Map and content panels.
- **Theming**: Heavily styled using Tailwind CSS with a focus on the Metro aesthetic.
- **Data Flow**: Static data is loaded from `src/data` and managed via `MetroContext`.
- **Accessibility**: First-class citizen with a dedicated `AccessibilityContext` and UI controls.
- **Navigation**: Navigation appears to be driven by interacting with the Metro map elements or the `MetroLineNav` modal.
