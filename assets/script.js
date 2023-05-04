const clientId = "463e1867583147f78d5b25bcc0004dda";
const clientSecret = "3e7065f63a874ad5a2c715aa6c24aed9";
const searchedResults = document.getElementById("searchedResults");
const suggestions = document.getElementById("suggestions");
const addedSongs = document.getElementById('addedSongs');
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("srcInput");
const searchType = document.getElementById("searchType");
const prevSearches = document.getElementById("previousSearches");
const clearUserPlaylistButton = document.getElementById('clearUserPlaylist');
const clearSearchHistoryButton = document.getElementById('clearSrcHistory');
let searchHistoryItems = [];
let userPlaylistItems = [];

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
    iframe.setAttribute("id", "iframe-" + i);
	iframe.setAttribute('src', `https://open.spotify.com/embed/track/${recommendationsData.tracks[i].id}`);
	iframe.setAttribute('width', '100%');
	iframe.setAttribute('height', '80');
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('allowtransparency', 'true');
	iframe.setAttribute('allow', 'encrypted-media');
	iframe.setAttribute('data-artist', recommendationsData.tracks[i].artists[0].name);
	let addBtn = document.createElement("button");
	addBtn.setAttribute("id", "button-" + i);
    addBtn.textContent = "Save to Playlist";
    addBtn.setAttribute("class", "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded my-1")
	addBtn.setAttribute("onClick", "returnElementId123(this.id)");
	songSuggestion.append(iframe);
	suggestions.append(songSuggestion, addBtn);
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
	}
}

function returnElementId123(elementId) {
	let buttonId = elementId;
	let iframeId = buttonId.toString().split("-")[1];
	const node = document.getElementById("iframe-" + iframeId);
	const clone = node.cloneNode(true);
	userPlaylistItems.push({name: `${clone.getAttribute('data-artist')}`, iframe: clone.outerHTML});
	storeUserPlaylist();
	if(userPlaylistItems.length >= 5){
	  userPlaylistItems.shift();
	}
	renderUserPlaylistItems();
  }

function storeUserPlaylist() {
localStorage.setItem('userPlaylistItems', JSON.stringify(userPlaylistItems));
}

function renderUserPlaylistItems() {
	addedSongs.innerHTML = '';
	let userPlaylistItems = JSON.parse(localStorage.getItem('userPlaylistItems')) || [];
	userPlaylistItems.forEach((item) => {
		let thisSong = document.createElement("h2");
		thisSong.textContent = (addedSongs.childElementCount/3) + 1 + ')';
		addedSongs.appendChild(thisSong);
		let clone = document.createElement('div');
		clone.innerHTML = item.iframe;
		addedSongs.appendChild(clone.firstChild);
		let addArtistBtn = document.createElement("button");
		addArtistBtn.setAttribute("class", "bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 border-b-4 border-amber-700 hover:border-amber-500 rounded my-1");
		addArtistBtn.textContent = "Check out upcoming Concerts!";
		addedSongs.appendChild(addArtistBtn);
		addArtistBtn.addEventListener('click', () => {
		let artistName = item.name;
    getArtistId(artistName);
	})
	});
  }

function loadSavedPlaylist() {
	let storedUserPlaylist = JSON.parse(localStorage.getItem("userPlaylistItems"));
	if (storedUserPlaylist !== null) {
		userPlaylistItems = storedUserPlaylist;
	}
	renderUserPlaylistItems();
}

function loadSavedSearches() {
	let storedSearches = JSON.parse(localStorage.getItem("localStoredSearches"));
	if (storedSearches !== null) {
	searchHistoryItems = storedSearches;
	}
	renderSearchHistoryItems();
}

let getArtistId = async function(searchTerm){
    let tempSearch = 'marina';
    let artistEndpoint = 'https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=' + searchTerm + '&apikey=OG2fkxjdAsu6SUo15migEcOBGuAtVBAL';
    let response = await fetch(artistEndpoint);
    let data = await response.json();
    for(i = 0; i < 5 && i < data._embedded.attractions.length; i++){
        await getConcertData(data._embedded.attractions[i].id);
    }
};

const ticketmasterDiv = document.getElementById('concerts');

let getConcertData = async function(artistId){
    let concertsEndpoint = 'https://app.ticketmaster.com/discovery/v2/events.json?attractionId=' + artistId + '&apikey=OG2fkxjdAsu6SUo15migEcOBGuAtVBAL';
    let response2 = await fetch(concertsEndpoint);
    let data2 = await response2.json();
    ticketmasterDiv.innerHTML='';
    if(!data2['_embedded'] || !data2._embedded['events']){
      const noConcertsDiv = document.createElement('div');
      const noConcertsMessage = document.createTextNode('No concerts at this time, please try another artist');
      noConcertsDiv.appendChild(noConcertsMessage);
      ticketmasterDiv.appendChild(noConcertsDiv);
      return
    } else {
    for(i = 0; i < 5 && i < data2._embedded.events.length; i++){
        let name = data2._embedded.events[i].name
        let date = data2._embedded.events[i].dates.start.localDate
        let url = data2._embedded.events[i].url
        renderConcertData(name, date, url);
    }}
};

let renderConcertData = function(name, date, url){
  const concertInfo = document.createElement('div');
  let concertName = document.createTextNode(name);
  const concertDateLabel = document.createTextNode(' | Date: ');
  let concertDate = document.createTextNode(date);
  const concertVenueLabel = document.createTextNode('');
  const concertVenue = document.createElement('a');
  concertVenue.setAttribute('href', url);
  const venueLink = document.createTextNode('| Click here for more information');
  concertVenue.appendChild(venueLink);
  concertVenue.setAttribute('class', 'p-2 text-blue-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white');
  concertInfo.appendChild(concertName);
  concertInfo.appendChild(concertDateLabel);
  concertInfo.appendChild(concertDate);
  concertInfo.appendChild(concertVenueLabel);
  concertInfo.appendChild(concertVenue);
  ticketmasterDiv.appendChild(concertInfo)
}

clearSearchHistoryButton.addEventListener('click', function(){
    prevSearches.innerHTML = "";
    searchHistoryItems = [];
    localStorage.clear();
});

clearUserPlaylistButton.addEventListener('click', function(){
    addedSongs.innerHTML = "";
    userPlaylistItems = [];
    localStorage.clear();
});

loadSavedSearches();
loadSavedPlaylist();

// * Light & Dark Mode
const body = document.querySelector('body');
const header = document.querySelector('.titles');
const div = document.querySelector('#hero');
const redDiv = document.querySelector('#searchHistory');
const greenDiv = document.querySelector('#ticketmaster');
const button = document.querySelector('#clearSrcHistory');
const blueDiv = document.querySelector('#userPlaylist');
const orangeDiv = document.querySelector('#searchedResults');
const toggle = document.getElementById('toggle');
toggle.onclick = function(){
    toggle.classList.toggle('active');
    body.classList.toggle('active');
    header.classList.toggle('active');
    hero.classList.toggle('active');
    searchHistory.classList.toggle('active');
    ticketmaster.classList.toggle('active');
    clearSrcHistory.classList.toggle('active');
    userPlaylist.classList.toggle('active');
    searchedResults.classList.toggle('active');
}