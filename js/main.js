(function() {
  'use strict';

  var ViewModel = function() {
    var self = this;

    // Observables for user data
    this.user = ko.observable(null);
    this.isLoggedIn = ko.observable(false);
    this.loginErrorMessage = ko.observable(null);
    this.topTracks = ko.observableArray([]);
    this.display_name = ko.observable('');

    // Function to fetch the user's top tracks
    this.getTopTracks = function(token) {
      return new Promise(function(resolve, reject) {
        fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(function(data) {
            console.log('Top tracks data:', data);
            self.topTracks(data.items);
            // Resolve with the fetched data
            resolve(data.items);
          })
          .catch(function(error) {
            console.error('Error fetching top tracks:', error);
            // Reject with the error
            reject(error);
          });
      });
    };

    // Function to fetch audio features for the user's top tracks
    this.getAudioFeatures = function(token, trackIds) {
      fetch('https://api.spotify.com/v1/audio-features/?ids=' + trackIds.join(','), {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(function(audioFeatures) {
          // Calculate mean values
          var meanDanceability = 0;
          var meanValence = 0;
          var meanEnergy = 0;
          var meanMode = 0;

          audioFeatures.audio_features.forEach(function(feature) {
            meanDanceability += feature.danceability;
            meanValence += feature.valence;
            meanEnergy += feature.energy;
            meanMode += feature.mode;
          });

          meanDanceability /= audioFeatures.audio_features.length;
          meanValence /= audioFeatures.audio_features.length;
          meanEnergy /= audioFeatures.audio_features.length;
          meanMode /= audioFeatures.audio_features.length;

          // Set mean values as window variables
          window.meanDanceability = meanDanceability;
          window.meanValence = meanValence;
          window.meanEnergy = meanEnergy;
          window.meanMode = meanMode;

          // Log mean values to console
          console.log('Mean Danceability:', meanDanceability);
          console.log('Mean Valence:', meanValence);
          console.log('Mean Energy:', meanEnergy);
          console.log('Mean Mode:', meanMode);
        })
        .catch(function(error) {
          console.error('Error fetching audio features:', error);
        });
    };

    // Function to handle login
    this.login = function() {
      self.loginErrorMessage(null);
      OAuthManager.obtainToken({
          scopes: [
            'user-read-private user-read-email user-top-read'
          ]
        }).then(function(token) {
          onTokenReceived(token);
          // Redirect to main.html after successful login
          window.location.href = 'main.html';
        })
        .catch(function(error) {
          self.loginError(error);
        });
    };

    // Function to handle logout
    this.logout = function() {
      localStorage.removeItem('accessTokenKey');
      self.isLoggedIn(false);
      // Clear user data from the ViewModel
      self.user(null);
      self.topTracks([]);
      self.display_name('');
      // Redirect to the login page
      window.location.href = 'index.html'; 
    };

    // Error handling for login
    this.loginError = function(errorCode) {
      switch (errorCode) {
        case 'access_denied':
          self.loginErrorMessage('You need to grant access in order to use this website.');
          break;
        default:
          self.loginErrorMessage('There was an error trying to obtain authorization. Please, try it again later.');
      }
    };
  };

  // Create an instance of the ViewModel
  var viewModel = new ViewModel();

  var accessTokenKey = 'accessTokenKey';

  function onTokenReceived(token) {
    console.log('onTokenReceived');
    viewModel.isLoggedIn(true);
    localStorage.setItem(accessTokenKey, token);
    console.log('Access token stored:', token);

    // Initialize spotifyApi object
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);
    console.log('Access token set in SpotifyWebApi:', token);

    spotifyApi.getMe().then(function(data) {
      console.log('Data received from getMe():', data);

      viewModel.user(data);

      // Assign display name to observable
      viewModel.display_name(data.display_name);

      // Fetch user's top tracks
      viewModel.getTopTracks(token)
        .then(function(topTracks) {
          // Extract trackIds from topTracks
          var trackIds = topTracks.map(function(track) {
            return track.id;
          });
          // Call getAudioFeatures with token and trackIds
          viewModel.getAudioFeatures(token, trackIds);
        })
        .catch(function(error) {
          console.error('Error fetching top tracks:', error);
        });

    })
    
    .catch(function(error) {
      console.error('Error fetching user data:', error);
    });
  }

  /**
   * Uses the stored access token
   */
  function initAccessToken() {
    var storedAccessToken = localStorage.getItem(accessTokenKey);
    console.log('Stored access token:', storedAccessToken);
    if (storedAccessToken) {
      console.log('Stored access token found:', storedAccessToken);
      onTokenReceived(storedAccessToken);
    } else {
      console.log('No stored access token found.');
    }
  }

  // Initialize access token
  initAccessToken();

  // Apply bindings after ViewModel instantiation
  ko.applyBindings(viewModel);

})();
