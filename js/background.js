var name = "ytp"
var info = Log({name, logfn: console.info});
var log = Log({name});
var warn = Log({name, logfn: console.warn});
var error = Log({name, logfn: console.error});

var error = Log({name, logfn: console.error});

var ytp = {
    settings: {
        onvideoend: {close, playnext}["playnext"],
    }
};

function close(originTab) {
    chrome.tabs.remove(originTab.id);
}

function playnext(originTab) {
    log("playnext(", originTab, ")");
    chrome.tabs.query({
        windowId: originTab.windowId,
        url: "*://*.youtube.com/watch*",
    }, (tab_a) => {
        log("chrome.tabs.query =>", tab_a);
        log("got video:end message");
        let foundCurrent = false;
        let destination;
        tab_a.sort((ta, tb) => ta.index - tb.index);
        tabPosByIndex = {};
        let c = tab_a.length;
        log("c =", c);
        for (let k = 0; k < c; k++) {
            tabPosByIndex[tab_a[k].index] = k;
        }
        log({tabPosByIndex});
        let originPos = tabPosByIndex[originTab.index];
        log({originPos});
        let nextPos = (originPos + 1) % c;
        log("nextPos =", nextPos);
        if (nextPos !== originPos) {
            destination = tab_a[nextPos];
        }
        log("destination =", destination);
        if (destination) {
            chrome.tabs.sendMessage(destination.id, "play");
            chrome.tabs.update(destination.id, {highlighted: true});
        } else {
            log("No destination tab found");
        }
    });
}


chrome.runtime.onMessage.addListener((body, sender, sendResponse) => {
    log(`onMessageListener(<${body}>,...)`);
    if (false) {
    } else if (body === "video:play") {
    } else if (body === "video:ended") {
        log({senderTab: sender.tab});
        log({senderTabId: sender.tab.id});
        ytp.settings.onvideoend(sender.tab);
    } else if (body === "click") {
    } else {
        warn("unhandeled message:", body)
    }
});