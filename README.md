# Tic-Tac-Toe (Frontend)

Frontend application for an **online multiplayer Tic-Tac-Toe game**, built as a **learning project** with a focus on real-time state, user flows, and error handling.

This repository contains **only the frontend**. The backend lives in a separate repository and is required for gameplay.

---

## Overview

The app allows players to:

- Join a lobby
- Wait for another player to connect
- Play a real-time Tic-Tac-Toe match online
- See whose turn it is
- Receive clear error feedback when something goes wrong

There is **no local (offline) mode** — all games are played against another user through the backend.

---

## Key Features

- Online multiplayer gameplay
- Lobby-based flow
- Turn indicator
- Basic error states and user feedback
- Clean, minimal UI focused on clarity

---

## Non-Goals (for now)

The following are intentionally **out of scope** at the moment:

- Local (same-device) multiplayer
- Reconnection or session recovery
- Spectators
- Match history or persistence

---

## Project Status

🚧 **Work in Progress**

This project is actively evolving. Changes to the backend may require corresponding updates in this frontend, and vice versa.

Current focus areas:
- Solidifying the multiplayer flow
- Improving robustness and error handling
- Refining the overall game lifecycle

---

## Motivation

This project exists primarily as a **learning exercise**, exploring:

- Client–server coordination for multiplayer games
- Managing async and real-time UI state
- Designing clear user flows for multiplayer experiences

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
