var color='red';
const getJoke = async () => {
    const joke = await fetch("https://icanhazdadjoke.com", { headers: { "Accept": "application/json" } })
      .then(response => response.json())
      .then(json => json.joke)
      .catch(() => "No Internet Connection");
  
    document.getElementById("joke").innerHTML = joke;
};
const ping = async (url) => {
    fetch('https://jsonp.afeld.me/?url='+url).then(function(data){
      if (data){
        if (data.status == 429) {
            alert("too many requests. Please wait a minute and try again.");
            setColor('thecheat');
        } else if ((data.status >= 200 && data.status <= 299) || data.status == 304){
            setColor('green');
        } else {
            setColor('red');
        }
    }
    });
};

const setColor = function(color) {
    console.log(color);
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

    $('body').css("background-color", color);
}
  document.addEventListener("DOMContentLoaded", () => {
    getJoke(); // initial joke

    document.getElementById("one-more").addEventListener("click", getJoke);
    // onClick's logic below:
    document.getElementById("submit").addEventListener('click', function() {
        var elem = document.getElementById('url');
        ping(elem.value);
    });
  });
  