var suggestedSong = document.getElementById("theSongs");
// var addedSong = document.getElementById("addedSongs");
const srcForm = document.getElementById('searchForm');
const srcBar = document.getElementById('srcInput');
const prevSrcs = document.getElementById('previousSearches');
let srcHistoryItems = [];




function addSong() {
  let addedSong = document.getElementById("srcInput").value
  let songLi = document.createElement("li");
  songLi.textContent = addedSong + "" + ".";
  document.getElementById("theSongs").appendChild(li);
}


function renderSrcHistoryItems() {
prevSrcs.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let srcHistoryItem = srcHistoryItems[i];
    let srcHistoryLine = document.createElement('p');
    srcHistoryLine.textContent = srcHistoryItem;
    srcHistoryLine.setAttribute('index', i);
    prevSrcs.appendChild(srcHistoryLine);
  }
}

function loadSavedSrcs() {
  var storedSearches = JSON.parse(localStorage.getItem("localStoredSrcs"));
  if (storedSearches !== null) {
    srcHistoryItems = storedSearches;
  }
  renderSrcHistoryItems();
}

function storeSearches() {
  localStorage.setItem("localStoredSrcs", JSON.stringify(srcHistoryItems));
}
srcForm.addEventListener("submit", function(event) {
  event.preventDefault();
  let srcText = srcBar.value.trim();
  if (srcText === "") {
    return;
  }
  srcHistoryItems.push(srcText);
  srcBar.value = "";
 
  storeSearches();
  renderSrcHistoryItems();
  // addSong();
});

// srcForm.addEventListener("click", addSong)

const clearSrcHistoryButton = document.getElementById('clearSrcHistory')
clearSrcHistoryButton.addEventListener('click', function(){
    prevSrcs.innerHTML = "";
    srcHistoryItems = [];
    localStorage.clear();
});

console.log(localStorage);