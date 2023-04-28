const searchForm = document.getElementById('searchForm');
const searchBar = document.getElementById('srcInput');
const prevSearches = document.getElementById('previousSearches');
let searchHistoryItems = [];

function renderSearcHistoryItems() {
prevSearches.innerHTML = "";
  for (let i = 0; i < searchHistoryItems.length; i++) {
    let searchHistoryItem = searchHistoryItems[i];
    let searchHistoryLine = document.createElement('div');
    searchHistoryLine.textContent = searchHistoryItem;
    prevSearches.appendChild(searchHistoryLine);
  };
  if(searchHistoryItems.length === 5){
    searchHistoryItems.shift();
  }
}

function loadSavedSearches() {
  var storedSearches = JSON.parse(localStorage.getItem("localStoredSearches"));
  if (storedSearches !== null) {
    searchHistoryItems = storedSearches;
  }
  renderSearcHistoryItems();
}

function storeSearches() {
  localStorage.setItem("localStoredSearches", JSON.stringify(searchHistoryItems));
}
searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  let searchText = searchBar.value.trim();
  if (searchText === "") {
    return;
  }
  searchHistoryItems.push(searchText);
  searchBar.value = "";
  storeSearches();
  renderSearcHistoryItems();
});


const clearSearchHistoryButton = document.getElementById('clearSrcHistory')
clearSearchHistoryButton.addEventListener('click', function(){
    prevSearches.innerHTML = "";
    searchHistoryItems = [];
    localStorage.clear();
});

loadSavedSearches();