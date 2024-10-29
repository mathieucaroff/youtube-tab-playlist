document.addEventListener("DOMContentLoaded", () => {
  const enableAddonCheckbox = document.getElementById("enable-addon")
  const closeTabCheckbox = document.getElementById("close-tab")

  enableAddonCheckbox.checked = localStorage["enabled"] === "true"
  closeTabCheckbox.checked = localStorage["close"] === "true"

  enableAddonCheckbox.addEventListener("change", (event) => {
    localStorage["enabled"] = event.target.checked
    updateIcon(event.target.checked)
  })
  closeTabCheckbox.addEventListener("change", (event) => {
    localStorage["close"] = event.target.checked
  })
})

function updateIcon(enabled) {
  if (enabled) {
    chrome.browserAction.setIcon({ path: "../icon/iconB16.png" })
  } else {
    chrome.browserAction.setIcon({ path: "../icon/iconB16-grey.png" })
  }
}
