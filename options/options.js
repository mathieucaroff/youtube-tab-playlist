// When the popup loads, get the current enabled/disabled status and set the checkbox
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the enabled status from storage or default to true

    document.getElementById("enable-addon").checked = localStorage['enabled'] === 'true';


    document.getElementById("close-tab").checked = localStorage['close'] === 'true';


    // Add an event listener for the checkbox change
    document.getElementById("enable-addon").addEventListener("change", event => {
        const isEnabled = event.target.checked;
        
        // Store the enable status and update the icon
        localStorage['enabled'] = isEnabled
        //updateIcon(isEnabled); // <-- Does not work for me, sets an invisible icon
    });
    document.getElementById("close-tab").addEventListener("change", event => {
        const isEnabled = event.target.checked;
        
        // Store the enable status and update the icon
        localStorage['close'] = event.target.checked
    });    
});

// Function to update the icon based on enable/disable status
function updateIcon(enabled) {
    if (enabled) {
        chrome.browserAction.setIcon({ path: "icon/iconB16.png"});
    } else {
        chrome.browserAction.setIcon({ path: "icon/iconB16-grey.png"});
    } 
}
