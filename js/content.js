// @ts-check

async function getVideoElement(retryCount = 0) {
  if (retryCount < 0) {
    console.warn("YoutubeTabPlaylist: No video found!")
    throw new Error("No video found!")
  }

  let videoList = document.querySelectorAll("video")
  if (videoList.length === 0) {
    await new Promise((resolve) => setTimeout(() => resolve(0), 1000))
    return getVideoElement(retryCount - 1)
  } else {
    if (videoList.length > 1) {
      console.warn("YoutubeTabPlaylist: More than one video element found!")
    }
    return videoList[0]
  }
}

getVideoElement(30).then((video) => {
  video.addEventListener("ended", () => {
    chrome.runtime.sendMessage("video:ended")
  })
})

chrome.runtime.onMessage.addListener((body, sender, sendResponse) => {
  if (body === "play") {
    getVideoElement(6).then(async (video) => {
      video.click()
      await new Promise((resolve) => setTimeout(() => resolve(0), 500))
      video.play()
    })
  }
})
