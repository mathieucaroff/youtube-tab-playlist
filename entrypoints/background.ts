import browser from 'webextension-polyfill'

import { getSettings, onSettingsChanged } from '~/lib/settings'

const seenTabIds = new Set<number>()

async function updateActionIcon(enabled: boolean) {
  await browser.action.setIcon({
    path: enabled
      ? {
          16: 'icon/iconB16.png',
          19: 'icon/iconB19.png',
          38: 'icon/iconB38.png',
        }
      : {
          16: 'icon/iconB16-grey.png',
          19: 'icon/iconB19-grey.png',
          38: 'icon/iconB38-grey.png',
        },
  })
}

async function syncActionIcon() {
  const settings = await getSettings()
  await updateActionIcon(settings.enabled)
}

async function closeTab(tabId: number | undefined) {
  if (typeof tabId !== 'number') {
    return
  }

  await browser.tabs.remove(tabId)
}

async function handleVideoEnded(originTab: browser.Tabs.Tab, isMix = false) {
  const settings = await getSettings()
  if (
    !settings.enabled ||
    typeof originTab.windowId !== 'number' ||
    typeof originTab.index !== 'number'
  ) {
    return
  }

  const youtubeTabs = (
    await browser.tabs.query({
      windowId: originTab.windowId,
      url: '*://*.youtube.com/watch*',
    })
  )
    .filter((tab) => typeof tab.index === 'number')
    .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))

  if (youtubeTabs.length <= 1) {
    return
  }

  const nextTab =
    youtubeTabs.find((tab) => (tab.index ?? -1) > originTab.index!) ??
    (settings.cycleToFirstTab ? youtubeTabs[0] : undefined)

  if (!nextTab?.id) {
    return
  }

  // If the next tab has never been focused, activate it briefly to
  // enable media playback, then switch back to the origin tab.
  if (!seenTabIds.has(nextTab.id)) {
    const [currentTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })
    await browser.tabs.update(nextTab.id, { active: true })
    if (currentTab) {
      await browser.tabs.update(currentTab.id, { active: true })
    }
  }

  await browser.tabs.sendMessage(nextTab.id, { type: 'play' })

  if (isMix && typeof originTab.id === 'number') {
    await browser.tabs.sendMessage(originTab.id, { type: 'pause' })
  }

  if (settings.closeCurrentTab) {
    await closeTab(originTab.id)
  }
}

export default defineBackground(() => {
  browser.tabs.onActivated.addListener(({ tabId }) => {
    seenTabIds.add(tabId)
  })

  browser.tabs.onRemoved.addListener((tabId) => {
    seenTabIds.delete(tabId)
  })

  browser.runtime.onInstalled.addListener(() => {
    void syncActionIcon()
  })

  browser.runtime.onStartup.addListener(() => {
    void syncActionIcon()
  })

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message?.type === 'video:ended' && sender.tab) {
      return handleVideoEnded(sender.tab, message.mix === true)
    }

    return undefined
  })

  onSettingsChanged((settings) => {
    void updateActionIcon(settings.enabled)
  })

  void syncActionIcon()
})
