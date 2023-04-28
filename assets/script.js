const clientId = '463e1867583147f78d5b25bcc0004dda';
const clientSecret = '3e7065f63a874ad5a2c715aa6c24aed9';
const searchedResults = document.getElementById('searchedResults')
const srcForm = document.getElementById('searchForm');
const srcBar = document.getElementById('srcInput');
const prevSrcs = document.getElementById('previousSearches');
let srcHistoryItems = [];

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
  });
  
  const clearSrcHistoryButton = document.getElementById('clearSrcHistory')
  clearSrcHistoryButton.addEventListener('click', function(){
	  prevSrcs.innerHTML = "";
	  srcHistoryItems = [];
	  localStorage.clear();
  });
  console.log(localStorage);

  

