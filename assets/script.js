const clientId = '463e1867583147f78d5b25bcc0004dda';
const clientSecret = '3e7065f63a874ad5a2c715aa6c24aed9';
const searchedResults = document.getElementById('searchedResults');
const suggestions = document.getElementById('suggestions')
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('srcInput');
const searchType = document.getElementById('searchType');
const prevSearches = document.getElementById('previousSearches');
let searchHistoryItems = [];

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let textInput = searchInput.value.trim();
  let type = searchType.value.trim();
  let searchText = `${textInput} : ${type}`;
  if (searchText === "") {
    return;
  }
  searchHistoryItems.push(searchText);
  searchInput.value = "";
  storeSearches();
  renderSearchHistoryItems();
  getRecommendations(type, textInput);
});

function storeSearches() {
	localStorage.setItem("localStoredSearches", JSON.stringify(searchHistoryItems));
  }

function renderSearchHistoryItems() {
prevSearches.innerHTML = "";
	for (let i = 0; i < searchHistoryItems.length; i++) {
	let searchHistoryItem = searchHistoryItems[i];
	let searchHistoryLine = document.createElement('div');
	let searchHistoryBtn = document.createElement('button');
	searchHistoryBtn.setAttribute('class', 'bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow my-1');
	searchHistoryBtn.setAttribute('id', 'searchHistoryBtn');
	searchHistoryBtn.textContent = searchHistoryItem;
	searchHistoryLine.append(searchHistoryBtn);
	prevSearches.append(searchHistoryLine);
	searchHistoryBtn.addEventListener('click', () => {
	let textInput = searchHistoryBtn.textContent.split(':')[0].trim();
	let type = searchHistoryBtn.textContent.split(':')[1].trim();
	getRecommendations(type, textInput);
	})
	};
	if(searchHistoryItems.length === 5){
	searchHistoryItems.shift();
	}
}

async function getRecommendations(type, textInput) {
	//   * creates endpoints and seed types based on selection in searchForm *
	let seedType;
	let endpoint;
	if (type === 'Artist') {
	  endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(textInput)}&type=artist&limit=1`;
	  seedType = 'seed_artists';
	} else if (type === 'Song') {
	  endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(textInput)}&type=track&limit=1`;
	  seedType = 'seed_tracks';
	} else {
	  endpoint = `https://api.spotify.com/v1/recommendations?limit=1&market=US&seed_genres=${encodeURIComponent(textInput)}`;
	  seedType = 'seed_genres';
	}
	const token = await getAccessToken();
	const response = await fetch(endpoint, {
	  headers: {
		Authorization: `Bearer ${token}`,
	  },
	});
	const data = await response.json();
  //   * seed track path based on selection in searchForm *
	let seedTrack;
	if (type === 'Song') {
	  seedTrack = data.tracks.items[0].id;
	} else if (type === 'Artist') {
	  seedTrack = data.artists.items[0].id
	} else {
	  seedTrack = data.seeds[0].id
	}
  //   * Endpoint for User search to create recommended songs *
	const recommendationsEndpoint = `https://api.spotify.com/v1/recommendations?limit=5&market=US&${seedType}=${seedTrack}`;
	const recommendationsResponse = await fetch(recommendationsEndpoint, {
	  headers: {
		Authorization: `Bearer ${token}`,
	  },
	});
	const recommendationsData = await recommendationsResponse.json();
  //    ! >>>>>>>>> recommendations data >>>>>>> !
	console.log('>>>>> recommendationsData >>>>', recommendationsData);
  //   * Display recommended track in the searchedResults div *
	//  * clears previous suggestions
	suggestions.innerHTML = '';
	// * Loop through the tracks in the recommendations data
	let recommendationCount = 0;
	for (let i = 0; i < recommendationsData.tracks.length && recommendationCount < 5; i++) {
	// * creates new suggestion elements and adds them to the recommendation count
	const songSuggestion = document.createElement('div');
	songSuggestion.setAttribute('class', 'col-12 bg-gray-600 text-white my-2');
    let iframe = document.createElement('iframe');
	iframe.setAttribute('src', `https://open.spotify.com/embed/track/${recommendationsData.tracks[i].id}`);
	iframe.setAttribute('width', '100%');
	iframe.setAttribute('height', '80');
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('allowtransparency', 'true');
	iframe.setAttribute('allow', 'encrypted-media');
	songSuggestion.append(iframe);
	suggestions.append(songSuggestion);
	recommendationCount++;
  }
}

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

const clearSearchHistoryButton = document.getElementById('clearSrcHistory')
clearSearchHistoryButton.addEventListener('click', function(){
    prevSearches.innerHTML = "";
    searchHistoryItems = [];
    localStorage.clear();
});

function loadSavedSearches() {
  let storedSearches = JSON.parse(localStorage.getItem("localStoredSearches"));
  if (storedSearches !== null) {
    searchHistoryItems = storedSearches;
  }
  renderSearchHistoryItems();
}

loadSavedSearches();