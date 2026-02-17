# OpenClaw Project Overview

## Purpose
OpenClaw is a **personal AI assistant** (multi-channel AI gateway) that runs on the user's own devices. It answers on channels already in use (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat) plus extension channels (BlueBubbles, Matrix, Zalo, etc.). It supports voice, live Canvas, and native apps on macOS/iOS/Android.

## Version & License
- Current version: `2026.2.16`
- License: MIT
- Repository: https://github.com/openclaw/openclaw

## Tech Stack
- **Language**: TypeScript (ESM, strict mode)
- **Runtime**: Node 22+ (Bun also supported for dev/scripts)
- **Package Manager**: pnpm 10.23.0 (monorepo with workspace packages)
- **Build**: tsdown (outputs to `dist/`)
- **Lint**: Oxlint (with TypeScript type-aware, unicorn, oxc plugins)
- **Format**: Oxfmt
- **Tests**: Vitest (V8 coverage, 70% thresholds)
- **CLI Framework**: Commander + @clack/prompts
- **UI**: Lit (legacy decorators) for Control UI
- **Native Apps**: SwiftUI (macOS/iOS), Kotlin (Android)

## Architecture
- **Gateway**: Central server that routes messages between AI providers and channels. Runs as a menubar app on macOS or standalone CLI process.
- **Channels**: Built-in (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, MS Teams, WebChat) + extension channels via plugin system.
- **Plugin SDK**: Extensions under `extensions/*` as workspace packages. Plugins use `openclaw/plugin-sdk` for integration.
- **Agent System**: AI agent orchestration with Pi-agent-core/@mariozechner dependencies.
- **ACP (Agent Client Protocol)**: Standard protocol integration.

## Key Dependencies
- AI Providers: Anthropic (Claude), OpenAI (GPT), Google (Gemini), AWS Bedrock, GitHub Copilot
- Messaging: grammy (Telegram), @slack/bolt, @buape/carbon (Discord), @whiskeysockets/baileys (WhatsApp)
- Infrastructure: Express 5, ws (WebSocket), playwright-core (browser automation)
- Media: sharp (images), pdfjs-dist, node-edge-tts
- Storage: SQLite (sqlite-vec)

## Entry Points
- CLI entry: `openclaw.mjs` → `src/entry.ts` → `src/index.ts`
- Gateway: `src/gateway/server.ts`
- Plugin SDK: `src/plugin-sdk/index.ts`
