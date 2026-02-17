# Codebase Structure

## Root Layout
```
openclaw/
├── src/           # Core source code
├── extensions/    # Plugin/extension channels (workspace packages)
├── apps/          # Native apps (macos, ios, android, shared)
├── docs/          # Mintlify documentation
├── scripts/       # Build, release, CI scripts
├── packages/      # Additional workspace packages (clawdbot, moltbot)
├── ui/            # Control UI (Lit-based web UI)
├── vendor/        # Vendored third-party code
├── test/          # Top-level test utilities
├── skills/        # Agent skills
├── patches/       # pnpm patches for dependencies
├── assets/        # Static assets (chrome extension, etc.)
├── git-hooks/     # Pre-commit hook
└── dist/          # Build output (generated)
```

## Source Code (`src/`)
### Core Infrastructure
- `src/index.ts` — Main CLI entry
- `src/entry.ts` — Entry with experimental warning suppression
- `src/runtime.ts` — Runtime environment/IO
- `src/utils.ts` — General utilities (paths, JID, JSON, etc.)
- `src/globals.ts` — Global constants
- `src/logging.ts` / `src/logger.ts` — Logging infrastructure

### Gateway (the server)
- `src/gateway/` — Gateway server, auth, sessions, chat, WebSocket, hooks, plugins, discovery, mobile nodes, cron, etc.
  - `server.ts` / `server.impl.ts` — Main server
  - `boot.ts` — Server bootstrap
  - `auth.ts` — Authentication
  - `hooks.ts` — Hook system
  - `session-utils.ts` — Session management

### Channels (messaging integrations)
- `src/channels/` — Channel registry, config, command gating, allowlists, session, typing
  - `registry.ts` — Channel ID constants and metadata
- `src/discord/` — Discord channel
- `src/telegram/` — Telegram channel
- `src/slack/` — Slack channel
- `src/signal/` — Signal channel
- `src/imessage/` — iMessage channel
- `src/whatsapp/` — WhatsApp (web) channel
- `src/web/` — Web channel
- `src/line/` — Line channel

### CLI
- `src/cli/` — CLI wiring, all CLI command implementations
  - `program.ts` — Main CLI program (commander)
  - `gateway-cli.ts` — Gateway CLI commands
  - `config-cli.ts` — Config CLI
  - `channels-cli.ts` — Channels CLI
  - `plugins-cli.ts` — Plugin management CLI
  - `progress.ts` — Progress bars/spinners (osc-progress + clack)

### Commands
- `src/commands/` — High-level command implementations (send, receive, agent, onboard, doctor, etc.)

### AI/Agent System
- `src/agents/` — Agent orchestration
- `src/auto-reply/` — Auto-reply/response generation
- `src/providers/` — Model provider integrations (GitHub Copilot, Google, Qwen Portal OAuth)

### Media & Browser
- `src/media/` — Media processing pipeline
- `src/media-understanding/` — Media analysis
- `src/browser/` — Browser automation (playwright)
- `src/canvas-host/` — Canvas (A2UI) hosting

### Config & Security
- `src/config/` — Configuration management
- `src/security/` — Security checks
- `src/pairing/` — Device pairing

### Infrastructure
- `src/infra/` — Shared infra (format-time, etc.)
- `src/terminal/` — Terminal output (table, palette/theme)
- `src/shared/` — Shared types/utilities
- `src/types/` — TypeScript type definitions

### Plugin SDK
- `src/plugin-sdk/` — SDK for building extensions
  - `index.ts` — Main SDK exports
  - `onboarding.ts` — Plugin onboarding helpers
  - `config-paths.ts` — Config path utilities

## Extensions (`extensions/`)
Each is a workspace package with its own `package.json`:
- Messaging: bluebubbles, discord, feishu, googlechat, imessage, irc, line, matrix, mattermost, msteams, nextcloud-talk, nostr, signal, slack, telegram, tlon, twitch, voice-call, whatsapp, zalo, zalouser
- Auth: copilot-proxy, google-antigravity-auth, google-gemini-cli-auth, minimax-portal-auth, openai-codex-auth, qwen-portal-auth
- Features: device-pair, diagnostics-otel, llm-task, lobster, memory-core, memory-lancedb, open-prose, openclaw-zh-cn-ui, phone-control, talk-voice, thread-ownership
- Shared: extensions/shared

## Apps (`apps/`)
- `apps/macos/` — macOS SwiftUI menubar app
- `apps/ios/` — iOS SwiftUI app
- `apps/android/` — Android Kotlin app
- `apps/shared/` — Shared OpenClawKit (Swift)
