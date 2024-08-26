// @ts-check

async function getVideoElement() {
  let videoList = document.querySelectorAll("video")
  if (videoList.length === 0) {
    console.warn("YoutubeTabPlaylist: No video found!")
    return new Promise((resolve) =>
      setTimeout(() => resolve(getVideoElement()), 1000)
    )
  } else {
    if (videoList.length > 1) {
      console.warn("YoutubeTabPlaylist: More than one video element found!")
    } else {
      console.warn("YoutubeTabPlaylist: Video found!")
    }
    return videoList[0]
  }
}

getVideoElement().then((video) => {
  video.addEventListener("ended", () => {
    console.warn("YoutubeTabPlaylist: event: video ended")
    chrome.runtime.sendMessage("video:ended")
  })
})

chrome.runtime.onMessage.addListener((body, sender, sendResponse) => {
  console.warn("YoutubeTabPlaylist: got messge:", body)
  if (body === "play") {
    getVideoElement().then((video) => video.play())
  }
})
