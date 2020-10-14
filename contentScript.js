var color='red';

const loadUI = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        var url = tabs[0].url;
        submitHostname($('#url'), url, 100);
    });
};

const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const submitHostname = async function(targetEl, url, delayMs) {
    $('#up').hide();
    $('#down').hide();

    try {
        var hostname = (new URL(url)).hostname;
        for (var i = 0; i < hostname.length; i++) {
            await sleep(delayMs);
            if (i == 4) {
                $('.lds-spinner').css('display', 'inline-block');
            }
            targetEl.html(targetEl.html()+hostname.charAt(i));
        }

        var isUp = ping(url);
        $('.lds-spinner').hide();
        if (isUp){
            setColor('green');
            $('#up').show();
            $('#down').hide();
            $("#up iframe")[0].src += "&autoplay=1&loop=1";
        } else {
            setColor('red');
            $('#up').hide();
            $('#down').show();
            $("#down iframe")[0].src += "&autoplay=1&loop=1";
        }
    } catch(err) {}
};

const ping = function(url) {
    var isUp = false;

    if (url.substr(0, 6) == 'chrome') {
        return false;
    }

    $.ajax({
        url: url,
        type: "get",
        async: false,
        timeout: 3000, // sets timeout to 3 seconds
        statusCode: {
            200: function(xhr) {
                isUp=true;
            }
        }    
    });

    return isUp;
};

const setColor = function(color) {
    switch(color) {
    case 'red':
        chrome.browserAction.setIcon({path: 'img/red.png'});
        color='red';
        break;
    case 'green':
        chrome.browserAction.setIcon({path: 'img/green.png'});
        color='green';
        break;
    default:
        chrome.browserAction.setIcon({path: 'img/thecheat.png'});
        color='thecheat';
    }
}

/* when the extension is clicked, load the UI */
document.addEventListener("DOMContentLoaded", () => {
    loadUI();
});

/* when a tab is first activated */
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.getSelected(null,function(tab) {
        var isUp = ping(tab.url);
        setColor(isUp ? 'green' : 'red');
    });
});

/* when a tab changes, ping the (possibly new) URL */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null,function(tab) {
        var isUp = ping(tab.url);
        setColor(isUp ? 'green' : 'red');
    });
});