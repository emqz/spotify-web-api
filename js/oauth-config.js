/*exported OAuthConfig*/
var OAuthConfig = (function() {
  'use strict';

  /* replace these values with yours obtained in the
  "My Applications" section of the Spotify developer site */
  var clientId = 'be4b6717e3a54772a4b60a37b8cc5329';
  var redirectUri = 'http://localhost:5502/callback';

  if (location.href.indexOf('http://jmperezperez.com') === 0) {
    redirectUri = 'http://jmperezperez.com/spotify-web-api-start-template/callback.html';
  }

  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host,
    stateKey: 'spotify_auth_state'
  };
})();
