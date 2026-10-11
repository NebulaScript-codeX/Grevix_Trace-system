# TRACE

TRACE is a standalone React workspace for exploring connected context, reviewing insights, and managing local actions. It includes a set of focused modules for workspace search, records, memories, risks, audit history, integrations, settings, and TRAVI, a clearly labelled keyword-based local demo assistant.

## Features

- Landing page and Command Center dashboard.
- Universal Search and interactive Context Graph.
- Memory Center and Source Library with local create, edit, and delete workflows.
- Intelligence Center, Action Board, Trust & Risk, and Timeline & Audit review workflows.
- Integrations & Permissions and Settings & Privacy screens.
- TRAVI local demo assistant with predefined, keyword-based responses based on workspace records.
- Browser `localStorage` persistence for workspace data and preferences.
- Responsive layouts, animations, and TRACE branding.

All workspace records are stored in this browser. Connector records are demonstrations only; the app does not connect to external services or require a backend or AI provider.

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Motion, Lucide, and React Flow

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install

```sh
npm install
```

## Run locally

```sh
npm run dev
```

Open the local address printed by Vite (the default port is 3000).

## Production build

```sh
npm run build
```

The optimized static application is written to `dist`.

## Preview the production build

```sh
npm run preview
```

## Deploy to Render

Create a **Static Site** in Render and configure:

| Setting | Value |
| --- | --- |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

No environment variables are required.
