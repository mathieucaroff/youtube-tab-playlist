let name = "ytp";
var info = Log({name, logfn: console.info});
var log = Log({name}).off();
var warn = Log({name, logfn: console.warn});
var error = Log({name, logfn: console.error});

function messageSender(message) {
    return () => {
        console.log(`sending: <${message}>`);
        chrome.runtime.sendMessage(message);
    };
}

function autoplayEnabled() {
    try {
        let b = document.querySelector("paper-toggle-button#improved-toggle");
        if (b) {
            return JSON.parse(b.getAttribute("aria-pressed"));
        } else {
            warn("autoplayEnabled() could not find the autoplay button");
            return true;
        }
    } catch (e) {
        error(e);
        return true;
    }
}

/* Hooks */
function setClickHook() {
    document.documentElement.addEventListener(
        "click", messageSender("click"), true
    );
}
setClickHook();


var pleaseStop = false;
function setVideoEndedHook() {
    let video = I.want(document.querySelector("video"));

    if (video) {
        video.addEventListener("ended",
            () => {
                messageSender("video:ended")()  ;
                if (autoplayEnabled()) {
                    pleaseStop = true;
                }
            }
        , true);
    }
}
setVideoEndedHook();

function setVideoPlayHook() {
    let video = I.want(document.querySelector("video"));

    if (video) {
        video.addEventListener("play",
            () => {
                messageSender("video:play");
                if (autoplayEnabled() && pleaseStop) {
                    video.pause();
                }
                pleaseStop = false;
            }
        , true);
    }
}
setVideoPlayHook();

function setPlayMessageHook() {
    chrome.runtime.onMessage.addListener((body, sender, sendResponse) => {
        log(`onMessageListener(<${body}>,...)`);
        if (body === "play") {
            let video_a = document.querySelectorAll("video");
            if (video_a) {
                let video = video_a[0];
                video.play();
            } else {
                warn("No video found!");
            }
            if (video_a.length > 1) {
                warn("More than one video element found! w.length:", video_a.length);
            }
        } else {
            warn("unhandeled message:", body)
        }
    });
}
setPlayMessageHook();