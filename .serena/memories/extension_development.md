# Extension/Plugin Development Guide

## Structure
Each extension lives under `extensions/<name>/` as a workspace package.

## Key Extension Categories

### Messaging Channels
bluebubbles, discord, feishu, googlechat, imessage, irc, line, matrix, mattermost, msteams, nextcloud-talk, nostr, signal, slack, telegram, tlon, twitch, voice-call, whatsapp, zalo, zalouser

### Auth Providers
copilot-proxy, google-antigravity-auth, google-gemini-cli-auth, minimax-portal-auth, openai-codex-auth, qwen-portal-auth

### Features
device-pair, diagnostics-otel, llm-task, lobster, memory-core, memory-lancedb, open-prose, openclaw-zh-cn-ui, phone-control, talk-voice, thread-ownership

### Shared
extensions/shared — shared code for extensions

## Plugin SDK
- Import from `openclaw/plugin-sdk`
- Key exports: onboarding helpers, config paths, webhook targets, tool-send, status helpers, file locks, JSON store, text chunking
- Account IDs: `openclaw/plugin-sdk/account-id`

## Dependency Rules
- Runtime deps in `dependencies`
- `openclaw` in `devDependencies` or `peerDependencies` (never `workspace:*` in `dependencies`)
- Plugin install runs `npm install --omit=dev` in plugin dir
- Runtime resolves `openclaw/plugin-sdk` via jiti alias

## When Adding Channels/Extensions
- Update `.github/labeler.yml`
- Create matching GitHub labels (use existing channel/extension label colors)
- Update every UI surface and docs (macOS app, web UI, mobile if applicable)
- Add matching status + configuration forms
- Update core channel docs: `docs/channels/`

## Workspace Config (pnpm-workspace.yaml)
```yaml
packages:
  - .
  - ui
  - packages/*
  - extensions/*
```
