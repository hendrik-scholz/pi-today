# pi-today

A [pi](https://pi.dev) extension that prepends today's date to the system prompt for new sessions.

LLMs don't inherently know the current date. This extension ensures the model can give accurate date-based answers, avoid "as of my last training cutoff" disclaimers, and use proper date references in responses.

## Installation

### Via `pi install` (recommended)

```bash
pi install git:github.com/jandrikus/pi-today
```

### Manual

```bash
# Global (available in all projects)
cp -r pi-today ~/.pi/agent/extensions/

# Or symlink
ln -sf /path/to/pi-today ~/.pi/agent/extensions/pi-today
```

### Project-local

```bash
cp -r pi-today .pi/extensions/
```

## Usage

No configuration needed. The extension works automatically:

1. Start a new session (launch `pi` or use `/new`)
2. The system prompt is prepended with: `Current date: [Day], [Month] [Day], [Year]`

Example: `Current date: Thursday, May 30, 2025`

The date is injected on the **first message only** — subsequent messages in the same session reuse the cached system prompt.

## How It Works

1. On `session_start` (new session or `/new`), the extension computes today's date
2. On the first `before_agent_start` event, it prepends the date to the system prompt via the return value
3. All subsequent messages skip the injection — preserving prompt cache and reducing costs

The extension also emits a `today:date` event via `pi.events`, making the date available to other extensions (e.g., [pi-system-prompt](https://github.com/jandrikus/pi-system-prompt) displays it in `/system-prompt` output).

## Features

- **Zero configuration** — works out of the box
- **Cache-safe** — only modifies the first message's system prompt, not the base prompt
- **Cross-extension support** — emits `today:date` event for other extensions to consume
- **No dependencies** — pure TypeScript, no external packages
- **No file I/O or network requests**

## Compatibility

Works with [pi-system-prompt](https://github.com/jandrikus/pi-system-prompt) — when both extensions are installed, `/system-prompt` displays the injected date at the top of the system prompt.

## License

Apache-2.0
