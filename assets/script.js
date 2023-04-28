const clientId = '463e1867583147f78d5b25bcc0004dda';
const clientSecret = '3e7065f63a874ad5a2c715aa6c24aed9';
const searchedResults = document.getElementById('searchedResults')
const searchForm = document.getElementById('searchForm');
const searchBar = document.getElementById('srcInput');
const prevSearches = document.getElementById('previousSearches');
let searchHistoryItems = [];

// * create access token to use for API requests *
const authOptions = {
	method: 'POST',
	headers: {
	  'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
	  'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: 'grant_type=client_credentials'
  };
  
  fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(response => response.json())
    .then(data => {
        const token = data.access_token;
	// * API request test *
	// 	const trackOptions = {
	// 	headers: {
	// 	'Authorization': 'Bearer ' + token
	// 	}
	// };

	// fetch('https://api.spotify.com/v1/tracks/6QjmnLmLqwjJzHSDCRTACU', trackOptions)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 	console.log(data);
	// 	const sampleUl = document.createElement('ul');
	// 	const sample = document.createElement('li');
	// 	const audio = document.createElement('audio');
	// 	const trackName = document.createElement('div');
	// 	const artistName = document.createElement('div');
	// 	const albumName = document.createElement('div');

	// 	audio.setAttribute('controls', true);
	// 	audio.setAttribute('src', data.preview_url);

	// 	trackName.innerHTML = `Track Name: ${data.name}`;
	// 	artistName.innerHTML = `Artist Name: ${data.artists[0].name}`;
	// 	albumName.innerHTML = `Album Name: ${data.album.name}`;

	// 	sample.append(audio, trackName, artistName, albumName);
	// 	sampleUl.append(sample);
	// 	searchedResults.append(sampleUl);
	// 	})
	// 	.catch(error => console.error(error));
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