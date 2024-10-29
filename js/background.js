// @ts-check

if (localStorage['enabled'] === undefined) {
  localStorage['enabled'] = true;
}
if (localStorage['close'] === undefined) {
  localStorage['close'] = false;
}

/** @param {chrome.tabs.Tab} originTab */
function close(originTab) {
  chrome.tabs.remove(originTab.id ?? -1)
}

/** @param {chrome.tabs.Tab} originTab */
function handleVideoEnd(originTab) {
  chrome.tabs.query(
    {
      windowId: originTab.windowId,
      url: "*://*.youtube.com/watch*",
    },
    (youtubeTabArray) => {
      if (youtubeTabArray.length <= 1) {
        return
      }
      youtubeTabArray.sort((ta, tb) => ta.index - tb.index)
      let nextTab = youtubeTabArray.find((tab) => tab.index > originTab.index)
      if (nextTab) {
        chrome.tabs.sendMessage(nextTab.id ?? -1, "play")
        chrome.tabs.update(nextTab.id ?? -1, { active: true })
        if (localStorage['close'] === 'true') {
          close(originTab);
        }
      }
    }
  )
}

chrome.runtime.onMessage.addListener((body, sender, sendResponse) => {
  if (localStorage['enabled'] === 'true' && body === "video:ended" && sender.tab) {
    handleVideoEnd(sender.tab)
  }
})
