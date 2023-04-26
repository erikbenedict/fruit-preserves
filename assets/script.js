const srcBar = document.getElementById('srcBarEl');

const url = 'https://genius-song-lyrics1.p.rapidapi.com/search/?q=daft%20punk&per_page=10&page=1';
const options = {
	method: 'GET',
	headers: {
		'content-type': 'application/octet-stream',
		'X-RapidAPI-Key': '20be61fe96msh81f284389c5697bp179be5jsn0a196850298b',
		'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
	}
};

fetch(url, options)
.then(response => response.json())
.then(test =>
    console.log('test ' + test))
    .catch(function (error) {
        alert('Unable to connect');
          })