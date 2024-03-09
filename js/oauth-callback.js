/*global OAuthConfig*/
var target = window.self === window.top ? window.opener : window.parent;

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

var params = getHashParams(),
    accessToken = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(OAuthConfig.stateKey);

if (accessToken && (state === undefined || state !== storedState)) {
  target.postMessage(JSON.stringify(
     {
      type: 'token',
      success: false,
      message: 'error'
    }), OAuthConfig.host);
} else {
  localStorage.removeItem(OAuthConfig.stateKey);
  target.postMessage(JSON.stringify({
    type: 'token',
    success: true,
    token: accessToken
  }), OAuthConfig.host);
}

// Check if the access token is present
if (accessToken) {
  // Log the access token to the console for testing
  console.log('Access Token:', accessToken);

  // Use the access token to make an API request to Spotify
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  })
  .then(userData => {
    // Log the user data to the console for testing
    console.log('User Data:', userData);
  })
  .catch(error => {
    // Handle any errors that occur during the API request
    console.error('Error fetching user data:', error);
  });
} else {
  // Handle case where access token is not present
  console.error('Access token is missing');
}
