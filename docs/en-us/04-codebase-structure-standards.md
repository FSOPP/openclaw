# Codebase Structure & Standards

## 1. Document Control

| Field   | Value                         |
| ------- | ----------------------------- |
| Version | 1.0                           |
| Date    | 2026-02-17                    |
| Author  | AI Architect (auto-generated) |
| Status  | Draft                         |

---

## 2. Project Layout

```
openclaw/
├── src/                          # Core application source (TypeScript ESM)
│   ├── index.ts                  # Main CLI entry point
│   ├── entry.ts                  # Entry with warning suppression
│   ├── runtime.ts                # Runtime environment/IO
│   ├── globals.ts                # Global constants
│   ├── logger.ts                 # Logging infrastructure
│   ├── utils.ts                  # General utilities
│   │
│   ├── cli/                      # CLI wiring (Commander framework)
│   │   ├── program.ts            # Main CLI program definition
│   │   ├── gateway-cli/          # Gateway CLI commands
│   │   ├── daemon-cli/           # Daemon management CLI
│   │   ├── cron-cli/             # Cron management CLI
│   │   ├── node-cli/             # Node management CLI
│   │   ├── nodes-cli/            # Nodes (camera, canvas, screen) CLI
│   │   ├── update-cli/           # Update management CLI
│   │   ├── deps.ts               # Dependency injection (createDefaultDeps)
│   │   ├── progress.ts           # Progress bars/spinners (osc-progress + clack)
│   │   ├── prompt.ts             # Interactive prompts
│   │   ├── profile.ts            # Profile management
│   │   └── ...                   # Other CLI modules
│   │
│   ├── commands/                 # High-level command implementations
│   │   ├── agent.ts              # Agent command
│   │   ├── onboard*.ts           # Onboarding flow (auth, channels, hooks, skills)
│   │   ├── doctor*.ts            # Diagnostics and repair
│   │   ├── configure*.ts         # Configuration wizard
│   │   ├── sessions.ts           # Session management
│   │   ├── status*.ts            # Status reporting
│   │   ├── health.ts             # Health check command
│   │   ├── message.ts            # Message send command
│   │   ├── dashboard.ts          # Dashboard command
│   │   ├── auth-choice*.ts       # Auth provider selection
│   │   ├── sandbox*.ts           # Sandbox management
│   │   ├── channels/             # Channel management commands
│   │   ├── models/               # Model management commands
│   │   ├── gateway-status/       # Gateway status commands
│   │   ├── status-all/           # Status --all implementation
│   │   └── ...
│   │
│   ├── gateway/                  # Gateway server (HTTP + WebSocket)
│   │   ├── server.ts             # Server export (re-export of server.impl.ts)
│   │   ├── server.impl.ts        # GatewayServer class + startGatewayServer()
│   │   ├── server-http.ts        # HTTP server factory
│   │   ├── server-methods/       # RPC method handler directory
│   │   │   ├── agent.ts          # Agent RPC handlers
│   │   │   ├── chat.ts           # Chat RPC handlers
│   │   │   ├── config.ts         # Config RPC handlers
│   │   │   ├── sessions.ts       # Session RPC handlers
│   │   │   ├── channels.ts       # Channel RPC handlers
│   │   │   ├── health.ts         # Health RPC handler
│   │   │   ├── cron.ts           # Cron RPC handlers
│   │   │   ├── nodes.ts          # Node RPC handlers
│   │   │   ├── devices.ts        # Device pairing RPC handlers
│   │   │   ├── mesh.ts           # Mesh execution RPC handlers
│   │   │   └── ...
│   │   ├── server-methods-list.ts # RPC method registry (BASE_METHODS, GATEWAY_EVENTS)
│   │   ├── protocol/             # WebSocket RPC protocol
│   │   │   ├── index.ts          # Protocol client
│   │   │   └── schema/           # Protocol schemas (TypeBox)
│   │   ├── server/               # Server infrastructure
│   │   │   ├── ws-connection/    # WebSocket connection management
│   │   │   ├── http-listen.ts    # HTTP listen logic
│   │   │   ├── tls.ts            # TLS configuration
│   │   │   └── plugins-http.ts   # Plugin HTTP routing
│   │   ├── auth.ts               # Gateway authentication
│   │   ├── boot.ts               # Server bootstrap
│   │   ├── openai-http.ts        # OpenAI Chat Completions endpoint
│   │   ├── openresponses-http.ts # Open Responses endpoint
│   │   ├── tools-invoke-http.ts  # Tools invoke endpoint
│   │   ├── hooks.ts              # Hook system
│   │   ├── server-channels.ts    # Channel management
│   │   ├── server-chat.ts        # Chat message handling
│   │   ├── server-cron.ts        # Cron job scheduling
│   │   ├── server-discovery.ts   # Service discovery (Bonjour/mDNS)
│   │   ├── server-plugins.ts     # Plugin loading
│   │   ├── server-broadcast.ts   # Event broadcasting to WS clients
│   │   ├── session-utils.ts      # Session utilities
│   │   ├── control-ui.ts         # Control UI serving
│   │   └── ...
│   │
│   ├── agents/                   # Agent runtime and orchestration
│   │   ├── pi-embedded-runner.ts # Core agent execution loop
│   │   ├── pi-embedded-subscribe.ts # Agent event subscription/streaming
│   │   ├── system-prompt.ts      # System prompt construction
│   │   ├── model-catalog.ts      # Model discovery and catalog
│   │   ├── model-selection.ts    # Model selection logic
│   │   ├── model-fallback.ts     # Model failover chains
│   │   ├── auth-profiles.ts      # Auth profile rotation
│   │   ├── tool-policy.ts        # Tool allowlist/denylist
│   │   ├── compaction.ts         # Session transcript compaction
│   │   ├── bash-tools*.ts        # Shell execution tools
│   │   ├── sandbox*.ts           # Sandbox management
│   │   ├── skills*.ts            # Skills loading and management
│   │   ├── subagent-*.ts         # Sub-agent orchestration
│   │   ├── workspace*.ts         # Workspace management
│   │   ├── identity*.ts          # Agent identity
│   │   ├── tools/                # Agent tool definitions
│   │   ├── schema/               # Agent schemas
│   │   ├── sandbox/              # Sandbox container management
│   │   └── ...
│   │
│   ├── channels/                 # Channel abstraction layer
│   │   ├── registry.ts           # Channel ID constants (CHAT_CHANNEL_ORDER)
│   │   ├── channel-config.ts     # Channel configuration
│   │   ├── command-gating.ts     # Command permission gating
│   │   ├── mention-gating.ts     # Mention handling
│   │   ├── allowlists/           # Allowlist management
│   │   ├── plugins/              # Channel plugin interface
│   │   │   └── types.plugin.ts   # ChannelPlugin interface
│   │   ├── web/                  # WebChat channel
│   │   └── telegram/             # Telegram-specific channel utilities
│   │
│   ├── routing/                  # Message routing
│   │   ├── resolve-route.ts      # Route resolution
│   │   ├── session-key.ts        # Session key computation
│   │   └── bindings.ts           # Agent-channel bindings
│   │
│   ├── config/                   # Configuration management
│   │   ├── config.ts             # Core config loading
│   │   ├── schema.ts             # TypeBox config schema
│   │   ├── io.ts                 # Config file I/O
│   │   ├── defaults.ts           # Default values
│   │   ├── legacy*.ts            # Legacy migration
│   │   ├── includes.ts           # Config file includes
│   │   ├── env-preserve.ts       # Env var preservation
│   │   ├── env-substitution.ts   # ${ENV_VAR} substitution
│   │   ├── paths.ts              # Config path resolution
│   │   ├── types*.ts             # Type definitions (20+ files)
│   │   ├── zod-schema*.ts        # Zod validation schemas (15+ files)
│   │   └── sessions/             # Session config
│   │
│   ├── security/                 # Security audit & policy
│   │   ├── audit.ts              # Main audit function (runSecurityAudit)
│   │   ├── audit-tool-policy.ts  # Tool policy audit
│   │   ├── audit-channel.ts      # Channel security audit
│   │   ├── audit-fs.ts           # File system permission audit
│   │   ├── dangerous-tools.ts    # Dangerous tool classification
│   │   ├── fix.ts                # Security fix application
│   │   ├── external-content.ts   # External content sanitization
│   │   └── scan-paths.ts         # Path scanning
│   │
│   ├── plugins/                  # Plugin system core
│   │   ├── loader.ts             # Plugin loader
│   │   ├── discovery.ts          # Plugin discovery
│   │   ├── registry.ts           # Plugin registry
│   │   ├── install.ts            # Plugin installation
│   │   ├── hooks.ts              # Plugin hook system
│   │   ├── config-schema.ts      # Plugin config schema
│   │   ├── http-registry.ts      # Plugin HTTP route registry
│   │   ├── manifest.ts           # Plugin manifest parsing
│   │   ├── runtime/              # Plugin runtime
│   │   └── ...
│   │
│   ├── hooks/                    # Hook system
│   │   ├── hooks.ts              # Hook execution
│   │   ├── loader.ts             # Hook file loading
│   │   ├── frontmatter.ts        # Hook frontmatter parsing
│   │   ├── install.ts            # Hook installation
│   │   ├── bundled/              # Built-in hooks
│   │   └── ...
│   │
│   ├── plugin-sdk/               # Plugin SDK (exports for extension authors)
│   │   ├── index.ts              # Main SDK exports
│   │   ├── file-lock.ts          # File lock utilities
│   │   ├── webhook-path.ts       # Webhook path helpers
│   │   ├── agent-media-payload.ts # Agent media helpers
│   │   └── ...
│   │
│   ├── providers/                # AI provider integrations
│   │   ├── github-copilot*.ts    # GitHub Copilot provider
│   │   ├── google-shared*.ts     # Google Gemini helpers
│   │   └── qwen-portal-oauth.ts  # Qwen Portal OAuth
│   │
│   ├── media/                    # Media pipeline
│   │   ├── server.ts             # Media file server
│   │   ├── store.ts              # Media storage
│   │   ├── fetch.ts              # Media fetching
│   │   ├── image-ops.ts          # Image operations (sharp)
│   │   ├── audio.ts              # Audio processing
│   │   └── ...
│   │
│   ├── memory/                   # Vector memory system
│   │   ├── manager.ts            # Memory manager
│   │   ├── embeddings.ts         # Embedding generation
│   │   ├── sqlite-vec.ts         # SQLite vector storage
│   │   ├── sqlite.ts             # SQLite database
│   │   ├── mmr.ts                # Maximal Marginal Relevance search
│   │   ├── hybrid.ts             # Hybrid search
│   │   ├── index.ts              # Memory module exports
│   │   └── ...
│   │
│   ├── infra/                    # Shared infrastructure utilities
│   │   ├── format-time/          # Time formatting
│   │   ├── fetch.ts              # HTTP fetch helpers
│   │   ├── env.ts                # Environment helpers
│   │   ├── home-dir.ts           # Home directory resolution
│   │   ├── tailscale.ts          # Tailscale integration
│   │   ├── bonjour*.ts           # Service discovery (mDNS/Bonjour)
│   │   ├── system-events.ts      # System event bus
│   │   ├── agent-events.ts       # Agent event bus
│   │   ├── heartbeat-*.ts        # Heartbeat system
│   │   ├── update-*.ts           # Update checking
│   │   └── ...
│   │
│   ├── terminal/                 # Terminal output utilities
│   │   ├── table.ts              # renderTable (ANSI-safe tables)
│   │   ├── palette.ts            # CLI color palette
│   │   ├── theme.ts              # Terminal theme
│   │   ├── ansi.ts               # ANSI escape helpers
│   │   └── ...
│   │
│   ├── sessions/                 # Session management
│   ├── shared/                   # Shared types/utilities
│   ├── types/                    # TypeScript type declarations
│   ├── test-helpers/             # Test helper utilities
│   ├── test-utils/               # Test utility functions
│   │
│   ├── telegram/                 # Telegram channel (grammy)
│   ├── discord/                  # Discord channel (@buape/carbon)
│   ├── slack/                    # Slack channel (@slack/bolt)
│   ├── signal/                   # Signal channel
│   ├── whatsapp/                 # WhatsApp channel (@whiskeysockets/baileys)
│   ├── imessage/                 # iMessage channel
│   ├── web/                      # Web/WhatsApp Web channel
│   ├── line/                     # Line channel (@line/bot-sdk)
│   │
│   ├── browser/                  # Browser automation (playwright)
│   ├── canvas-host/              # Canvas (A2UI) hosting
│   ├── tts/                      # Text-to-speech
│   ├── tui/                      # Terminal UI
│   ├── cron/                     # Cron scheduler
│   ├── daemon/                   # Daemon process management
│   ├── acp/                      # Agent Client Protocol
│   ├── auto-reply/               # Auto-reply pipeline
│   ├── markdown/                 # Markdown processing
│   ├── pairing/                  # Device pairing
│   ├── process/                  # Process management
│   └── wizard/                   # Configuration wizard
│
├── extensions/                   # Plugin/extension packages (40 packages)
│   ├── bluebubbles/              # BlueBubbles (macOS Messages bridge)
│   ├── copilot-proxy/            # GitHub Copilot proxy auth
│   ├── device-pair/              # Device pairing extension
│   ├── diagnostics-otel/         # OpenTelemetry diagnostics
│   ├── discord/                  # Discord extension
│   ├── feishu/                   # Feishu/Lark channel
│   ├── googlechat/               # Google Chat channel
│   ├── imessage/                 # iMessage extension
│   ├── irc/                      # IRC channel
│   ├── line/                     # Line extension
│   ├── lobster/                  # Lobster UI theme
│   ├── matrix/                   # Matrix channel
│   ├── mattermost/               # Mattermost channel
│   ├── memory-core/              # Core memory extension
│   ├── memory-lancedb/           # LanceDB memory backend
│   ├── msteams/                  # Microsoft Teams channel
│   ├── nextcloud-talk/           # Nextcloud Talk channel
│   ├── nostr/                    # Nostr protocol channel
│   ├── signal/                   # Signal extension
│   ├── slack/                    # Slack extension
│   ├── telegram/                 # Telegram extension
│   ├── twitch/                   # Twitch channel
│   ├── voice-call/               # Voice call channel
│   ├── whatsapp/                 # WhatsApp extension
│   ├── zalo/                     # Zalo channel (OA)
│   ├── zalouser/                 # Zalo user-mode channel
│   ├── shared/                   # Shared extension utilities
│   └── ...
│
├── apps/                         # Native applications
│   ├── macos/                    # macOS menubar app (SwiftUI)
│   ├── ios/                      # iOS app (SwiftUI)
│   ├── android/                  # Android app (Kotlin)
│   └── shared/                   # Shared OpenClawKit (Swift)
│
├── packages/                     # Additional workspace packages
│   ├── clawdbot/                 # Legacy compatibility package
│   └── moltbot/                  # Legacy compatibility package
│
├── ui/                           # Control UI (Lit-based web components)
├── docs/                         # Documentation (Mintlify)
├── scripts/                      # Build, release, CI/CD scripts
├── skills/                       # Agent skills (bundled)
├── vendor/                       # Vendored third-party code
├── test/                         # Top-level test utilities
├── patches/                      # pnpm dependency patches
├── assets/                       # Static assets (Chrome extension)
└── git-hooks/                    # Pre-commit hook
```

---

## 3. Naming Conventions

| Category           | Convention                                 | Example                        |
| ------------------ | ------------------------------------------ | ------------------------------ |
| Source files       | kebab-case.ts                              | `model-catalog.ts`             |
| Test files (unit)  | `<source>.test.ts` (colocated)             | `model-catalog.test.ts`        |
| Test files (e2e)   | `<source>.e2e.test.ts` (colocated)         | `gateway.e2e.test.ts`          |
| Test files (live)  | `<source>.live.test.ts`                    | `models.profiles.live.test.ts` |
| TypeScript types   | PascalCase                                 | `GatewaySessionRow`            |
| Constants          | UPPER_SNAKE_CASE                           | `CHAT_CHANNEL_ORDER`           |
| Functions          | camelCase                                  | `createGatewayHttpServer`      |
| Config keys        | camelCase (dot-notation for nesting)       | `gateway.mode`                 |
| CLI commands       | kebab-case                                 | `openclaw gateway run`         |
| Extension packages | kebab-case directory + `package.json` name | `extensions/memory-core/`      |
| Imports            | `.js` extension (ESM requirement)          | `import { x } from "./foo.js"` |
| Type-only imports  | `import type { X }`                        | `import type { Config }`       |

---

## 4. Dependency Manifest

### Core Dependencies (production)

| Category    | Package                       | Purpose                        |
| ----------- | ----------------------------- | ------------------------------ |
| AI/Agent    | @mariozechner/pi-agent-core   | Agent execution core           |
| AI/Agent    | @mariozechner/pi-ai           | AI provider abstraction        |
| AI/Agent    | @mariozechner/pi-coding-agent | Coding agent capabilities      |
| AI/Agent    | @mariozechner/pi-tui          | Terminal UI for agent          |
| ACP         | @agentclientprotocol/sdk      | Agent Client Protocol SDK      |
| CLI         | commander                     | CLI framework                  |
| CLI         | @clack/prompts                | Interactive CLI prompts        |
| CLI         | osc-progress                  | Terminal progress bars         |
| HTTP        | express                       | HTTP framework                 |
| WebSocket   | ws                            | WebSocket server/client        |
| Schema      | @sinclair/typebox             | TypeBox JSON schema            |
| Schema      | zod                           | Zod schema validation          |
| Schema      | ajv                           | JSON Schema validation         |
| Telegram    | grammy                        | Telegram Bot API               |
| Discord     | @buape/carbon                 | Discord API                    |
| Slack       | @slack/bolt, @slack/web-api   | Slack API                      |
| WhatsApp    | @whiskeysockets/baileys       | WhatsApp Web API               |
| Line        | @line/bot-sdk                 | LINE Messaging API             |
| Feishu      | @larksuiteoapi/node-sdk       | Feishu/Lark API                |
| AWS         | @aws-sdk/client-bedrock       | AWS Bedrock                    |
| Storage     | sqlite-vec                    | SQLite vector search           |
| Image       | sharp                         | Image processing               |
| PDF         | pdfjs-dist                    | PDF parsing                    |
| Browser     | playwright-core               | Browser automation             |
| TTS         | node-edge-tts                 | Text-to-speech                 |
| Crypto      | signal-utils                  | Signal protocol utilities      |
| Archive     | tar, jszip                    | Archive handling               |
| HTTP client | undici                        | HTTP/1.1 and HTTP/2 client     |
| Logging     | tslog                         | Structured logging             |
| Config      | dotenv, yaml, json5           | Config file parsing            |
| Discovery   | @homebridge/ciao              | mDNS/Bonjour service discovery |
| DOM         | linkedom                      | Lightweight DOM implementation |
| QR          | qrcode-terminal               | QR code display                |
| File watch  | chokidar                      | File system watcher            |
| Scheduling  | croner                        | Cron scheduling                |
| Markdown    | markdown-it                   | Markdown rendering             |
| Terminal    | chalk, cli-highlight          | Terminal coloring              |

### Dev Dependencies

| Package                    | Purpose                       |
| -------------------------- | ----------------------------- |
| typescript                 | TypeScript compiler           |
| @typescript/native-preview | tsgo (native TS type checker) |
| vitest                     | Test framework                |
| @vitest/coverage-v8        | Coverage provider             |
| oxlint                     | Linter (type-aware)           |
| oxfmt                      | Formatter                     |
| tsdown                     | Build tool                    |
| tsx                        | TypeScript execution          |
| rolldown                   | Bundler (for A2UI canvas)     |
| lit                        | Web components (Control UI)   |
| ollama                     | Ollama client (dev/testing)   |

---

## 5. Build Pipeline

### Build Steps (`pnpm build`)

1. **Canvas A2UI bundle** — `bash scripts/bundle-a2ui.sh` (Rolldown bundle)
2. **tsdown** — Transpile TypeScript to JavaScript (ESM, outputs to `dist/`)
3. **Plugin SDK declarations** — `tsc -p tsconfig.plugin-sdk.dts.json`
4. **Plugin SDK entry DTS** — Generate entry `.d.ts` file
5. **Canvas A2UI copy** — Copy bundled assets to `dist/`
6. **Hook metadata copy** — Copy hook metadata to `dist/`
7. **HTML template copy** — Copy export HTML templates
8. **Build info** — Write `dist/build-info.json`
9. **CLI compat** — Write CLI compatibility shims

### Build Configuration (tsdown)

Entry points defined in `tsdown.config.ts`:

- `src/index.ts` — Main entry
- `src/entry.ts` — CLI entry
- `src/cli/daemon-cli.ts` — Daemon CLI (legacy shim)
- `src/infra/warning-filter.ts` — Warning suppression
- `src/plugin-sdk/index.ts` → `dist/plugin-sdk/` — Plugin SDK

### TypeScript Configuration

| Setting                  | Value       | Notes                     |
| ------------------------ | ----------- | ------------------------- |
| `target`                 | ES2023      | Modern JavaScript         |
| `module`                 | NodeNext    | ESM module system         |
| `moduleResolution`       | NodeNext    | Node.js module resolution |
| `strict`                 | true        | Strict mode enabled       |
| `noEmit`                 | true        | Build via tsdown, not tsc |
| `experimentalDecorators` | true        | Required for Lit (legacy) |
| `lib`                    | DOM, ES2023 | Browser + modern JS APIs  |

---

## 6. Code Quality Gates

| Gate           | Tool                     | Command                 | Notes                                               |
| -------------- | ------------------------ | ----------------------- | --------------------------------------------------- |
| Formatting     | Oxfmt                    | `pnpm format`           | `oxfmt --check` for CI, `--write` for fix           |
| Linting        | Oxlint (type-aware)      | `pnpm lint`             | Includes oxc, unicorn, TypeScript rules             |
| Type checking  | tsgo (native TypeScript) | `pnpm tsgo`             | Uses `@typescript/native-preview`                   |
| Combined check | All three above          | `pnpm check`            | `format:check && tsgo && lint`                      |
| Tests          | Vitest                   | `pnpm test`             | Parallel runner (test-parallel.mjs)                 |
| Coverage       | V8 via Vitest            | `pnpm test:coverage`    | 70% threshold (lines/branches/functions/statements) |
| LOC guard      | Custom script            | `pnpm check:loc`        | Max ~500 LOC per file (guideline)                   |
| Pre-commit     | Git hooks                | `git-hooks/pre-commit`  | Runs check commands before commit                   |
| Doc links      | Custom audit             | `pnpm docs:check-links` | Validates documentation links                       |
| Doc formatting | Oxfmt + markdownlint     | `pnpm check:docs`       | Markdown formatting + linting                       |

### Anti-Patterns (Enforced)

- No `@ts-nocheck` — fix root causes
- No disabling `no-explicit-any` — use proper types
- No prototype mutation for class behavior sharing
- No re-export wrapper files — import from source
- No `Type.Union` in tool input schemas (google-antigravity compatibility)
- No raw `format` property name in tool schemas (reserved keyword conflict)
- Patched dependencies must use exact versions (no `^`/`~`)
- Never edit `node_modules`
- Never update the Carbon dependency

---

## References

- [package.json](../../package.json) — Dependencies, scripts, engines
- [tsconfig.json](../../tsconfig.json) — TypeScript configuration
- [tsdown.config.ts](../../tsdown.config.ts) — Build configuration
- [vitest.config.ts](../../vitest.config.ts) — Test configuration
- [git-hooks/pre-commit](../../git-hooks/pre-commit) — Pre-commit hook
- [AGENTS.md](../../AGENTS.md) — Repository guidelines
- [.github/instructions/copilot.instructions.md](../../.github/instructions/copilot.instructions.md) — Codebase patterns
- [src/cli/program.ts](../../src/cli/program.ts) — CLI program definition
- [src/terminal/palette.ts](../../src/terminal/palette.ts) — CLI color palette
- [src/terminal/table.ts](../../src/terminal/table.ts) — Table rendering

## Appendix

### A. Workspace Packages (pnpm monorepo)

The project uses pnpm workspaces. Extension packages are defined in `pnpm-workspace.yaml` and each has its own `package.json` under `extensions/`.

### B. Supported Runtimes

| Runtime | Usage                         | Notes                          |
| ------- | ----------------------------- | ------------------------------ |
| Node.js | Production (dist/), CI, tests | ≥22.12.0 required              |
| Bun     | Dev execution, scripts, tests | `bun <file.ts>`, `bunx <tool>` |
| pnpm    | Package management            | 10.23.0 (via corepack)         |

### C. Entry Point Resolution

```
openclaw.mjs (bin entry)
  └→ src/entry.ts (warning suppression)
       └→ src/index.ts (main CLI)
            └→ src/cli/program.ts (Commander program)
                 └→ src/commands/* (command implementations)
```
