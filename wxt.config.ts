import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'
import packageInfo from './package.json' with { type: 'json' }

export default defineConfig({
  srcDir: '.',
  modules: ['@wxt-dev/module-react', '@wxt-dev/webextension-polyfill'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Youtube Tab Playlist',
    short_name: 'YTP',
    description: 'Use your tab bar as a playlist!',
    version: packageInfo.version,
    permissions: ['storage', 'tabs'],
    host_permissions: ['*://*.youtube.com/*'],
    icons: {
      '16': '/icon/iconB16.png',
      '19': '/icon/iconB19.png',
      '32': '/icon/iconB32.png',
      '38': '/icon/iconB38.png',
      '48': '/icon/iconB48.png',
      '64': '/icon/iconB64.png',
      '128': '/icon/iconB128.png',
      '256': '/icon/iconB256.png',
    },
  },
})
