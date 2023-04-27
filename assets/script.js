import secrets from '../mysecrets.js';
const clientId = secrets.clientId
const clientSecret = secrets.clientSecret

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
		console.log(data);
        const token = data.access_token;
        // Do something with the token
    })
    .catch(error => console.error(error));