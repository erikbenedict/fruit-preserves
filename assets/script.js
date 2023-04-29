const clientId = '463e1867583147f78d5b25bcc0004dda';
const clientSecret = '3e7065f63a874ad5a2c715aa6c24aed9';
const searchedResults = document.getElementById('searchedResults');
const suggestions = document.getElementById('suggestions')
var suggestedSong = document.getElementById("theSongs");
// var addedSong = document.getElementById("addedSongs");
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

//   ! >>>>>> data >>>>> !
  console.log('>>>>>> data >>>>>', data);

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
  const recommendationsEndpoint = `https://api.spotify.com/v1/recommendations?market=US&${seedType}=${seedTrack}`;

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
});
var addBtn = document.querySelector("#searchBtn")
var addInput = document.querySelector("#srcInput")



addBtn.addEventListener("click", () => {
  var ul = document.getElementById("theSongs");
  var li = document.createElement("li");
  li.innerHTML = addInput.value;
  ul.appendChild(li);
});

// function addSong() {
//   let addedSong = document.getElementById("srcInput").value
//   let songLi = document.createElement("li");
//   songLi.textContent = addedSong + "" + ".";
//   document.getElementById("theSongs").appendChild(li);
// };



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

// srcForm.addEventListener("click", addSong)


const clearSearchHistoryButton = document.getElementById('clearSrcHistory')
clearSearchHistoryButton.addEventListener('click', function(){
    prevSearches.innerHTML = "";
    searchHistoryItems = [];
    localStorage.clear();
});

loadSavedSearches();