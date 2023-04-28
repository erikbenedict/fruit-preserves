const clientId = '463e1867583147f78d5b25bcc0004dda';
const clientSecret = '3e7065f63a874ad5a2c715aa6c24aed9';
const searchedResults = document.getElementById('searchedResults')
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('srcInput');
const searchType = document.getElementById('searchType');
const prevSearches = document.getElementById('previousSearches');
let searchHistoryItems = [];

// * function to create access token to use for API requests *
async function getAccessToken() {
	try { 
		const authOptions = {
			method: 'POST',
			headers: {
			'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
			'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'grant_type=client_credentials'
		};
		const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
		const data_1 = await response.json();
		const token = data_1.access_token;
		return token;
	} catch (error) {
		console.log(error);
	}
}

// * Event listener for submit on searchForm *
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let textInput = searchInput.value.trim();
  let type = searchType.value.trim();
  let searchText = `${textInput}: ${type}`;
  if (searchText === "") {
    return;
  }
  searchHistoryItems.push(searchText);
  searchInput.value = "";
  storeSearches();
  renderSearcHistoryItems();
});

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
  let storedSearches = JSON.parse(localStorage.getItem("localStoredSearches"));
  if (storedSearches !== null) {
    searchHistoryItems = storedSearches;
  }
  renderSearcHistoryItems();
}

function storeSearches() {
  localStorage.setItem("localStoredSearches", JSON.stringify(searchHistoryItems));
}




const clearSearchHistoryButton = document.getElementById('clearSrcHistory')
clearSearchHistoryButton.addEventListener('click', function(){
    prevSearches.innerHTML = "";
    searchHistoryItems = [];
    localStorage.clear();
});

loadSavedSearches();