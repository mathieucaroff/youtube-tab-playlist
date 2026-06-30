# Youtube Tab Playlist

This extension turns open YouTube watch tabs into a lightweight playlist.

When the current YouTube video finishes, the extension looks for the next YouTube watch tab in the same window, activates it, and tells it to play. If the `Close current tab` setting is enabled, the finished tab is closed after the next one starts.

## License (JAM License)

> License is hereby granted to use this software and distribute it freely, as long as this copyright notice is retained and modifications are clearly marked.

> ALL WARRANTIES ARE HEREBY DISCLAIMED.

## Stack

- Bun

- WXT
- TypeScript
- React
- Tailwind CSS
- Zod
- webextension-polyfill

## Development

Install dependencies:

```bash
# npm install -g bun
bun install
```

Start the dev server:

```bash
bun run dev
```

Build the extension:

```bash
bun run build
# or
bun run build --browser firefox
```

Create a distributable zip:

```bash
bun run zip
# or
bun run zip --browser firefox
```

## Behavior

- Watches YouTube watch pages for the active video ending.
- Advances to the next YouTube watch tab in the same window.
- Optional setting to close the finished tab.
- Shared settings UI available as both the popup and the options page.

![Youtube Tab Playlist icon](./icon/iconB256.png)
