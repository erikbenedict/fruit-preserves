const srcForm = document.getElementById('searchForm');
const srcBar = document.getElementById('srcInput');
const prevSrcs = document.getElementById('previousSearches');
let srcHistoryItems = [];

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

function init() {

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
});

init();


// let srcSubmitHandler = function (event) {
//     event.preventDefault();
//     let searchedTerm = srcBar.value.trim();
//     console.log(searchedTerm);
//     if (searchedTerm){
//         saveSearches(searchedTerm)
//         //call function to get data from api
//         srcBar.value = '';
//     } else {
//         alert('Please enter a valid search term')
//     }
// };

// let srcHistoryItems = [];

// let saveSearches = function(searchedTerm){
//     for (let i = 0; i < 5; i++){
//         let srcHistoryItem = srcHistoryItems[i];
//     }
    
//     storedSearches.push(searchedTerm);
//     let newSavedSrc = document.createElement('p');
//     let newSavedSrcText = document.createTextNode(searchedTerm);
//     newSavedSrc.appendChild(newSavedSrcText);
//     document.getElementById('previousSearches').appendChild(newSavedSrc);
//     //if search history isn't empty, create a new item in search history div
// }

// //need to instead add each new search to an array

// srcForm.addEventListener('submit', srcSubmitHandler);
