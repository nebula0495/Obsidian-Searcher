# Searcher Community Release Design

## Goal

Prepare Searcher for an Obsidian community-plugin release. The plugin must reliably search editor selections on desktop and mobile, preserve existing user configuration, use the current Obsidian APIs, and present a Chinese or English interface that follows the app language.

## Scope

- Keep the editor context-menu and command-palette search entry points.
- Open search results through the platform webview's `window.open` API, which is available on desktop and mobile.
- Support Google, Bing, Baidu, DuckDuckGo, and Yahoo presets.
- Support a validated custom HTTP(S) search URL with an optional `{query}` placeholder.
- Migrate the existing `searchEngine` setting without losing a user's selected or custom engine.
- Localize all visible plugin text for Chinese and English.
- Update release metadata, build tooling, documentation, automated checks, and tests.

The context menu is a desktop interaction. On mobile, the command palette remains the supported entry point for an editor selection.

## Settings Model

The persisted settings model will contain an engine identifier and a custom URL template. Presets are stored by stable identifier rather than by display label or URL. A custom template accepts only `http:` and `https:` URLs.

`{query}` is replaced with the URL-encoded selected text. When a custom template has no placeholder, the encoded text is appended to it. This maintains compatibility with the current trailing-query convention such as `https://www.google.com/search?q=`.

On load, legacy data containing only `searchEngine` is normalized as follows:

- A known preset URL maps to that preset identifier.
- Any other non-empty string maps to the custom template.
- Invalid or missing data falls back to Google.

The normalized model is saved only after the user changes a setting, avoiding unnecessary writes during startup.

## Runtime Flow

1. An editor context-menu action or command reads and trims the active editor selection.
2. Empty selections show a localized notice and do not open a link.
3. The plugin builds a URL from the selected engine and query text.
4. Invalid custom configuration shows a localized notice and does not open a link.
5. A valid URL is opened in a separate browser context through the platform webview.

Search URL construction and settings normalization will be pure functions, isolated from the Obsidian UI layer.

## UI And Localization

The plugin detects whether Obsidian is using Chinese and otherwise uses English. The menu item, command name, settings labels, descriptions, validation feedback, and usage help all use this locale dictionary. The README remains bilingual.

The settings screen provides a preset dropdown and conditionally displays the custom-template input. Its help text documents `{query}` and the compatible append behavior.

## Compatibility And Release

The manifest minimum version, TypeScript types, build configuration, and development dependencies will be updated to a currently supported Obsidian API baseline. The published artifact remains `manifest.json`, `main.js`, and `styles.css`; development-only files are excluded from releases.

A CI workflow will install dependencies, run type checking and unit tests, build the plugin, and verify the expected release files.

## Testing

Unit tests cover:

- preset and legacy-setting migration;
- valid and invalid custom templates;
- `{query}` substitution and query encoding;
- fallback append behavior;
- empty selection and invalid-template paths where they are exposed through testable helpers.

The release check runs the production build. Manual verification covers editor context-menu search on desktop and command-palette search on desktop and mobile.

## Non-Goals

- Multiple simultaneous custom engines.
- A search-engine submenu.
- Searching arbitrary reading-view DOM selections.
- Built-in web requests, analytics, or external runtime dependencies.
