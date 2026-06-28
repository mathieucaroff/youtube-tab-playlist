import browser from 'webextension-polyfill'

const VIDEO_SELECTOR = 'video'
const ATTACHED_ATTRIBUTE = 'data-yt-tab-playlist-listener'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getVideoElement(retries: number): Promise<HTMLVideoElement> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const video = document.querySelector<HTMLVideoElement>(VIDEO_SELECTOR)
    if (video) {
      return video
    }

    await wait(1000)
  }

  throw new Error('YoutubeTabPlaylist: No video found')
}

async function playVideo() {
  const video = await getVideoElement(6)
  video.click()
  await wait(500)
  await video.play()
}

function bindEndedListener(video: HTMLVideoElement) {
  if (video.getAttribute(ATTACHED_ATTRIBUTE) === 'true') {
    return
  }

  video.setAttribute(ATTACHED_ATTRIBUTE, 'true')
  video.addEventListener('ended', () => {
    void browser.runtime.sendMessage({ type: 'video:ended' })
  })
}

async function ensureVideoListener() {
  try {
    const video = await getVideoElement(30)
    bindEndedListener(video)
  } catch (error) {
    console.warn(error)
  }
}

function isWatchUrl(url: URL | string) {
  const parsed = typeof url === 'string' ? new URL(url) : url
  return parsed.hostname.endsWith('youtube.com') && parsed.pathname === '/watch'
}

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  async main(ctx) {
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === 'play') {
        return playVideo()
      }

      return undefined
    })

    if (isWatchUrl(window.location.href)) {
      void ensureVideoListener()
    }

    const observer = new MutationObserver(() => {
      if (isWatchUrl(window.location.href)) {
        void ensureVideoListener()
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    ctx.addEventListener(window, 'wxt:locationchange', (event) => {
      const nextUrl =
        event instanceof CustomEvent
          ? event.detail.newUrl
          : window.location.href
      if (isWatchUrl(nextUrl)) {
        void ensureVideoListener()
      }
    })
  },
})
