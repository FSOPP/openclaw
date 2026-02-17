# API Contracts & Endpoints

## 1. Document Control

| Field   | Value                         |
| ------- | ----------------------------- |
| Version | 1.0                           |
| Date    | 2026-02-17                    |
| Author  | AI Architect (auto-generated) |
| Status  | Draft                         |

---

## 2. HTTP Endpoints

The OpenClaw Gateway exposes the following HTTP endpoints via `src/gateway/server-http.ts` (`createGatewayHttpServer`):

| Method | Path                   | Auth          | Description                               | Source File                         |
| ------ | ---------------------- | ------------- | ----------------------------------------- | ----------------------------------- |
| POST   | `/v1/chat/completions` | Bearer token  | OpenAI-compatible Chat Completions API    | src/gateway/openai-http.ts          |
| POST   | `/v1/responses`        | Bearer token  | Open Responses API (OpenAI Responses API) | src/gateway/openresponses-http.ts   |
| POST   | `/tools/invoke`        | Bearer token  | Invoke agent tools via HTTP               | src/gateway/tools-invoke-http.ts    |
| POST   | `/api/channels/*`      | Bearer token  | Channel plugin HTTP endpoints             | src/plugins/http-registry.ts        |
| POST   | `/api/hooks/*`         | Configurable  | Hooks HTTP request handler                | src/gateway/server-http.ts          |
| POST   | Slack Events URL       | Slack signing | Slack Events API handler                  | src/slack/ (handleSlackHttpRequest) |
| GET    | `/canvas/*`            | WS-authed IP  | Canvas (A2UI) static assets & API         | src/canvas-host/                    |
| GET    | `/control/*`           | Configurable  | Control UI web interface                  | src/gateway/control-ui.ts           |
| GET    | `/control/avatar/*`    | Configurable  | Agent avatar images                       | src/gateway/control-ui.ts           |
| GET    | `/*` (media)           | Local         | Media file server                         | src/media/server.ts                 |

### 2.1 OpenAI Chat Completions (`/v1/chat/completions`)

**Method:** POST  
**Auth:** Bearer token (gateway token/password)  
**Content-Type:** `application/json`

**Request Body:**

```typescript
{
  model?: string;           // Model identifier (optional, uses default)
  stream?: boolean;         // Enable SSE streaming
  messages?: Array<{
    role: "system" | "user" | "assistant" | "tool";
    content: string | Array<{ type: string; text?: string }>;
    name?: string;
  }>;
  user?: string;            // User identifier for session scoping
}
```

**Response:** OpenAI-compatible chat completion object (streamed via SSE when `stream=true`).

**Source:** `src/gateway/openai-http.ts` — `handleOpenAiHttpRequest()`

### 2.2 Open Responses API (`/v1/responses`)

**Method:** POST  
**Auth:** Bearer token  
**Content-Type:** `application/json`

Implements the OpenAI Responses API specification. Supports tool use, streaming, and configurable limits.

**Key options:**

- `openResponsesConfig.maxInputTokens` — Input token limit
- `openResponsesConfig.maxOutputTokens` — Output token limit
- `openResponsesConfig.allowedUrls` — Hostname allowlist for web tools

**Source:** `src/gateway/openresponses-http.ts` — `handleOpenResponsesHttpRequest()`

### 2.3 Tools Invoke (`/tools/invoke`)

**Method:** POST  
**Auth:** Bearer token  
**Content-Type:** `application/json`

**Request Body:**

```typescript
{
  tool: string;             // Tool name to invoke
  input: Record<string, unknown>;  // Tool input parameters
  sessionKey?: string;      // Optional session scope
  action?: string;          // Optional action (merged into input)
}
```

**Response:** Tool execution result as JSON.

**Source:** `src/gateway/tools-invoke-http.ts` — `handleToolsInvokeHttpRequest()`

---

## 3. WebSocket RPC Protocol

### Protocol Version

**Version:** 3 (constant `PROTOCOL_VERSION` in `src/gateway/protocol/schema/protocol-schemas.ts`)

### Connection Flow

1. Client opens WebSocket connection to `ws://host:port`
2. Server sends `connect.challenge` event
3. Client responds with authentication (token or password)
4. Server confirms connection

### Authentication

The WebSocket upgrade is authenticated via `src/gateway/server-http.ts` (`attachGatewayUpgradeHandler`). Auth is resolved per-request using `ResolvedGatewayAuth` which supports:

- Token-based auth (`gateway.token`)
- Password-based auth (`gateway.password`)
- Rate limiting for brute-force protection (`AuthRateLimiter`)
- Trusted proxy support

### 3.1 RPC Methods (Client → Server)

All 95 RPC methods defined in `src/gateway/server-methods-list.ts`:

| Method Name                  | Category       | Description                          | Handler Source                   |
| ---------------------------- | -------------- | ------------------------------------ | -------------------------------- |
| `health`                     | Health         | Get gateway health status            | server-methods/health.ts         |
| `status`                     | Health         | Get overall gateway status           | server-methods/health.ts         |
| `logs.tail`                  | Logging        | Tail gateway logs                    | server-methods/logs.ts           |
| `channels.status`            | Channels       | Get channel connection status        | server-methods/channels.ts       |
| `channels.logout`            | Channels       | Logout from a channel                | server-methods/channels.ts       |
| `usage.status`               | Usage          | Get usage statistics                 | server-methods/usage.ts          |
| `usage.cost`                 | Usage          | Get cost information                 | server-methods/usage.ts          |
| `tts.status`                 | TTS            | Get TTS service status               | server-methods/tts.ts            |
| `tts.providers`              | TTS            | List TTS providers                   | server-methods/tts.ts            |
| `tts.enable`                 | TTS            | Enable TTS                           | server-methods/tts.ts            |
| `tts.disable`                | TTS            | Disable TTS                          | server-methods/tts.ts            |
| `tts.convert`                | TTS            | Convert text to speech               | server-methods/tts.ts            |
| `tts.setProvider`            | TTS            | Set TTS provider                     | server-methods/tts.ts            |
| `config.get`                 | Config         | Get configuration value              | server-methods/config.ts         |
| `config.set`                 | Config         | Set configuration value              | server-methods/config.ts         |
| `config.apply`               | Config         | Apply configuration changes          | server-methods/config.ts         |
| `config.patch`               | Config         | Patch configuration (partial update) | server-methods/config.ts         |
| `config.schema`              | Config         | Get configuration JSON schema        | server-methods/config.ts         |
| `exec.approvals.get`         | Exec Approvals | Get exec approval settings           | server-methods/exec-approvals.ts |
| `exec.approvals.set`         | Exec Approvals | Set exec approval settings           | server-methods/exec-approvals.ts |
| `exec.approvals.node.get`    | Exec Approvals | Get node exec approval settings      | server-methods/exec-approvals.ts |
| `exec.approvals.node.set`    | Exec Approvals | Set node exec approval settings      | server-methods/exec-approvals.ts |
| `exec.approval.request`      | Exec Approvals | Request execution approval           | server-methods/exec-approval.ts  |
| `exec.approval.waitDecision` | Exec Approvals | Wait for approval decision           | server-methods/exec-approval.ts  |
| `exec.approval.resolve`      | Exec Approvals | Resolve an approval request          | server-methods/exec-approval.ts  |
| `wizard.start`               | Wizard         | Start configuration wizard           | server-methods/wizard.ts         |
| `wizard.next`                | Wizard         | Advance wizard step                  | server-methods/wizard.ts         |
| `wizard.cancel`              | Wizard         | Cancel wizard                        | server-methods/wizard.ts         |
| `wizard.status`              | Wizard         | Get wizard status                    | server-methods/wizard.ts         |
| `talk.config`                | Talk/Voice     | Get talk mode configuration          | server-methods/talk.ts           |
| `talk.mode`                  | Talk/Voice     | Set talk mode                        | server-methods/talk.ts           |
| `models.list`                | Models         | List available AI models             | server-methods/models.ts         |
| `agents.list`                | Agents         | List configured agents               | server-methods/agents.ts         |
| `agents.create`              | Agents         | Create a new agent                   | server-methods/agents.ts         |
| `agents.update`              | Agents         | Update an agent                      | server-methods/agents.ts         |
| `agents.delete`              | Agents         | Delete an agent                      | server-methods/agents.ts         |
| `agents.files.list`          | Agents         | List agent files                     | server-methods/agents.ts         |
| `agents.files.get`           | Agents         | Get an agent file                    | server-methods/agents.ts         |
| `agents.files.set`           | Agents         | Set an agent file                    | server-methods/agents.ts         |
| `skills.status`              | Skills         | Get skills status                    | server-methods/skills.ts         |
| `skills.bins`                | Skills         | List skill binary sources            | server-methods/skills.ts         |
| `skills.install`             | Skills         | Install a skill                      | server-methods/skills.ts         |
| `skills.update`              | Skills         | Update a skill                       | server-methods/skills.ts         |
| `update.run`                 | Update         | Run system update                    | server-methods/update.ts         |
| `voicewake.get`              | Voice Wake     | Get voice wake settings              | server-methods/voicewake.ts      |
| `voicewake.set`              | Voice Wake     | Set voice wake settings              | server-methods/voicewake.ts      |
| `sessions.list`              | Sessions       | List active sessions                 | server-methods/sessions.ts       |
| `sessions.preview`           | Sessions       | Preview session content              | server-methods/sessions.ts       |
| `sessions.patch`             | Sessions       | Patch session metadata               | server-methods/sessions.ts       |
| `sessions.reset`             | Sessions       | Reset a session                      | server-methods/sessions.ts       |
| `sessions.delete`            | Sessions       | Delete a session                     | server-methods/sessions.ts       |
| `sessions.compact`           | Sessions       | Compact session transcript           | server-methods/sessions.ts       |
| `last-heartbeat`             | Heartbeat      | Get last heartbeat timestamp         | (inline handler)                 |
| `set-heartbeats`             | Heartbeat      | Configure heartbeat settings         | (inline handler)                 |
| `wake`                       | Heartbeat      | Wake the agent                       | (inline handler)                 |
| `node.pair.request`          | Nodes          | Request node pairing                 | server-methods/nodes.ts          |
| `node.pair.list`             | Nodes          | List pending pairings                | server-methods/nodes.ts          |
| `node.pair.approve`          | Nodes          | Approve node pairing                 | server-methods/nodes.ts          |
| `node.pair.reject`           | Nodes          | Reject node pairing                  | server-methods/nodes.ts          |
| `node.pair.verify`           | Nodes          | Verify node pairing status           | server-methods/nodes.ts          |
| `device.pair.list`           | Devices        | List device pairings                 | server-methods/devices.ts        |
| `device.pair.approve`        | Devices        | Approve device pairing               | server-methods/devices.ts        |
| `device.pair.reject`         | Devices        | Reject device pairing                | server-methods/devices.ts        |
| `device.token.rotate`        | Devices        | Rotate device auth token             | server-methods/devices.ts        |
| `device.token.revoke`        | Devices        | Revoke device auth token             | server-methods/devices.ts        |
| `node.rename`                | Nodes          | Rename a node                        | server-methods/nodes.ts          |
| `node.list`                  | Nodes          | List connected nodes                 | server-methods/nodes.ts          |
| `node.describe`              | Nodes          | Describe node capabilities           | server-methods/nodes.ts          |
| `node.invoke`                | Nodes          | Invoke a command on a node           | server-methods/nodes.ts          |
| `node.invoke.result`         | Nodes          | Get node invocation result           | server-methods/nodes.ts          |
| `node.event`                 | Nodes          | Send event to node                   | server-methods/nodes.ts          |
| `cron.list`                  | Cron           | List cron jobs                       | server-methods/cron.ts           |
| `cron.status`                | Cron           | Get cron job status                  | server-methods/cron.ts           |
| `cron.add`                   | Cron           | Add a cron job                       | server-methods/cron.ts           |
| `cron.update`                | Cron           | Update a cron job                    | server-methods/cron.ts           |
| `cron.remove`                | Cron           | Remove a cron job                    | server-methods/cron.ts           |
| `cron.run`                   | Cron           | Run a cron job immediately           | server-methods/cron.ts           |
| `cron.runs`                  | Cron           | List cron run history                | server-methods/cron.ts           |
| `system-presence`            | System         | System presence heartbeat            | server-methods/system.ts         |
| `system-event`               | System         | Emit system event                    | server-methods/system.ts         |
| `send`                       | Messaging      | Send a message via channel           | server-methods/send.ts           |
| `agent`                      | Agents         | Run agent with a message             | server-methods/agent.ts          |
| `agent.identity.get`         | Agents         | Get agent identity info              | server-methods/agent.ts          |
| `agent.wait`                 | Agents         | Wait for agent completion            | server-methods/agent.ts          |
| `mesh.plan`                  | Mesh           | Create mesh execution plan           | server-methods/mesh.ts           |
| `mesh.plan.auto`             | Mesh           | Auto-create mesh plan                | server-methods/mesh.ts           |
| `mesh.run`                   | Mesh           | Run mesh execution                   | server-methods/mesh.ts           |
| `mesh.status`                | Mesh           | Get mesh execution status            | server-methods/mesh.ts           |
| `mesh.retry`                 | Mesh           | Retry failed mesh step               | server-methods/mesh.ts           |
| `browser.request`            | Browser        | Browser automation request           | server-methods/browser.ts        |
| `chat.history`               | WebChat        | Get chat history                     | server-methods/chat.ts           |
| `chat.abort`                 | WebChat        | Abort current chat                   | server-methods/chat.ts           |
| `chat.send`                  | WebChat        | Send chat message (WebChat native)   | server-methods/chat.ts           |

### 3.2 Gateway Events (Server → Client)

| Event Name                | Direction     | Description                          | Source File             |
| ------------------------- | ------------- | ------------------------------------ | ----------------------- |
| `connect.challenge`       | server→client | Auth challenge on WebSocket connect  | server/ws-connection.ts |
| `agent`                   | server→client | Agent execution events (streaming)   | server-broadcast.ts     |
| `chat`                    | server→client | Chat message events                  | server-chat.ts          |
| `presence`                | server→client | User/agent presence updates          | server-broadcast.ts     |
| `tick`                    | server→client | Periodic heartbeat tick              | server-broadcast.ts     |
| `talk.mode`               | server→client | Talk mode change notification        | server-broadcast.ts     |
| `shutdown`                | server→client | Gateway shutdown notification        | server-close.ts         |
| `health`                  | server→client | Health status update                 | server-broadcast.ts     |
| `heartbeat`               | server→client | Heartbeat event                      | server-broadcast.ts     |
| `cron`                    | server→client | Cron job execution event             | server-cron.ts          |
| `node.pair.requested`     | server→client | Node pairing request notification    | server-mobile-nodes.ts  |
| `node.pair.resolved`      | server→client | Node pairing resolved notification   | server-mobile-nodes.ts  |
| `node.invoke.request`     | server→client | Node invocation request              | server-node-events.ts   |
| `device.pair.requested`   | server→client | Device pairing request notification  | server-broadcast.ts     |
| `device.pair.resolved`    | server→client | Device pairing resolved notification | server-broadcast.ts     |
| `voicewake.changed`       | server→client | Voice wake settings changed          | server-broadcast.ts     |
| `exec.approval.requested` | server→client | Exec approval request notification   | server-broadcast.ts     |
| `exec.approval.resolved`  | server→client | Exec approval resolved notification  | server-broadcast.ts     |

### 3.3 Protocol Schema Modules

The WebSocket protocol schemas are defined in `src/gateway/protocol/schema/`:

| Schema Module             | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `agent.ts`                | Agent request/response schemas            |
| `agents-models-skills.ts` | Agent, model, and skill operation schemas |
| `channels.ts`             | Channel status/logout schemas             |
| `config.ts`               | Config get/set/apply/patch schemas        |
| `cron.ts`                 | Cron job CRUD schemas                     |
| `devices.ts`              | Device pairing schemas                    |
| `error-codes.ts`          | Protocol error code definitions           |
| `exec-approvals.ts`       | Exec approval schemas                     |
| `frames.ts`               | WebSocket frame schemas                   |
| `logs-chat.ts`            | Log tailing and chat schemas              |
| `mesh.ts`                 | Mesh execution schemas                    |
| `nodes.ts`                | Node management schemas                   |
| `primitives.ts`           | Shared primitive types                    |
| `sessions.ts`             | Session management schemas                |
| `snapshot.ts`             | State snapshot schemas                    |
| `types.ts`                | Shared TypeScript types                   |
| `wizard.ts`               | Wizard flow schemas                       |

---

## 4. OpenAPI v3 Specification (HTTP Endpoints)

```yaml
openapi: "3.0.3"
info:
  title: OpenClaw Gateway HTTP API
  description: >
    HTTP endpoints exposed by the OpenClaw Gateway server.
    The primary interface is WebSocket RPC; these HTTP endpoints provide
    compatibility with OpenAI client libraries and direct tool invocation.
  version: "2026.2.16"
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT
servers:
  - url: http://localhost:18789
    description: Local gateway (default port)
paths:
  /v1/chat/completions:
    post:
      summary: OpenAI-compatible Chat Completions
      operationId: chatCompletions
      tags:
        - OpenAI Compatibility
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChatCompletionRequest"
      responses:
        "200":
          description: Chat completion response (or SSE stream)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ChatCompletionResponse"
            text/event-stream:
              schema:
                type: string
                description: SSE stream of chat completion chunks
        "400":
          description: Bad Request
        "401":
          description: Unauthorized
        "429":
          description: Rate Limited
        "500":
          description: Internal Server Error

  /v1/responses:
    post:
      summary: Open Responses API
      operationId: createResponse
      tags:
        - OpenAI Compatibility
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ResponsesRequest"
      responses:
        "200":
          description: Response object (or SSE stream)
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ResponsesResponse"
            text/event-stream:
              schema:
                type: string
        "400":
          description: Bad Request
        "401":
          description: Unauthorized
        "500":
          description: Internal Server Error

  /tools/invoke:
    post:
      summary: Invoke an agent tool via HTTP
      operationId: toolsInvoke
      tags:
        - Tools
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ToolsInvokeRequest"
      responses:
        "200":
          description: Tool execution result
          content:
            application/json:
              schema:
                type: object
                description: Tool-specific result
        "400":
          description: Bad Request (invalid tool or input)
        "401":
          description: Unauthorized
        "405":
          description: Method Not Allowed
        "500":
          description: Internal Server Error

components:
  schemas:
    ChatCompletionRequest:
      type: object
      properties:
        model:
          type: string
          description: Model identifier
        stream:
          type: boolean
          description: Enable SSE streaming
          default: false
        messages:
          type: array
          items:
            type: object
            properties:
              role:
                type: string
                enum: [system, user, assistant, tool]
              content:
                type: string
              name:
                type: string
        user:
          type: string
          description: User identifier for session scoping

    ChatCompletionResponse:
      type: object
      properties:
        id:
          type: string
        object:
          type: string
          enum: [chat.completion]
        choices:
          type: array
          items:
            type: object
            properties:
              message:
                type: object
                properties:
                  role:
                    type: string
                  content:
                    type: string
              finish_reason:
                type: string
        usage:
          type: object
          properties:
            prompt_tokens:
              type: integer
            completion_tokens:
              type: integer
            total_tokens:
              type: integer

    ResponsesRequest:
      type: object
      description: OpenAI Responses API request body
      properties:
        model:
          type: string
        input:
          type: string
          description: User input text
        stream:
          type: boolean
        tools:
          type: array
          items:
            type: object
        instructions:
          type: string

    ResponsesResponse:
      type: object
      properties:
        id:
          type: string
        output:
          type: array
          items:
            type: object

    ToolsInvokeRequest:
      type: object
      required:
        - tool
        - input
      properties:
        tool:
          type: string
          description: Name of the tool to invoke
        input:
          type: object
          description: Tool input parameters
        sessionKey:
          type: string
          description: Optional session scope
        action:
          type: string
          description: Optional action (merged into input)

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      description: Gateway token or password
```

---

## References

- [src/gateway/server-http.ts](../../src/gateway/server-http.ts) — HTTP server factory
- [src/gateway/server-methods-list.ts](../../src/gateway/server-methods-list.ts) — RPC method registry
- [src/gateway/openai-http.ts](../../src/gateway/openai-http.ts) — OpenAI Chat Completions endpoint
- [src/gateway/openresponses-http.ts](../../src/gateway/openresponses-http.ts) — Open Responses endpoint
- [src/gateway/tools-invoke-http.ts](../../src/gateway/tools-invoke-http.ts) — Tools invoke endpoint
- [src/gateway/protocol/schema/protocol-schemas.ts](../../src/gateway/protocol/schema/protocol-schemas.ts) — Protocol version & schemas
- [src/gateway/server-methods/](../../src/gateway/server-methods/) — RPC method handlers
- [src/gateway/auth.ts](../../src/gateway/auth.ts) — Authentication logic
- [src/gateway/probe.ts](../../src/gateway/probe.ts) — Gateway probe (health check)

## Appendix

### A. Error Codes

Protocol error codes are defined in `src/gateway/protocol/schema/error-codes.ts`.

### B. Default Gateway Port

The default gateway port is `18789` (configured via `gateway.port` in config or `--port` CLI flag).
