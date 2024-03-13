(function() {
  'use strict';

  // Declare mean variables globally
  var meanDanceability, meanValence, meanEnergy, meanMode;

  var ViewModel = function() {
    var self = this;

    // Observables for user data
    this.user = ko.observable(null);
    this.isLoggedIn = ko.observable(false);
    this.loginErrorMessage = ko.observable(null);
    this.topTracks = ko.observableArray([]);
    this.display_name = ko.observable('');

    this.meanDanceability = ko.observable(0);
    this.meanValence = ko.observable(0);
    this.meanEnergy = ko.observable(0);
    this.meanMode = ko.observable(0);

    // Function to fetch the user's top tracks
    this.getTopTracks = function(token) {
      return new Promise(function(resolve, reject) {
        fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
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
          var totalDanceability = 0;
          var totalValence = 0;
          var totalEnergy = 0;
          var totalMode = 0;

          audioFeatures.audio_features.forEach(function(feature) {
            totalDanceability += feature.danceability;
            totalValence += feature.valence;
            totalEnergy += feature.energy;
            totalMode += feature.mode;
        });

        var numTracks = audioFeatures.audio_features.length;

            // Calculate mean values
            var meanDanceability = totalDanceability / numTracks;
            var meanValence = totalValence / numTracks;
            var meanEnergy = totalEnergy / numTracks;
            var meanMode = totalMode / numTracks;

            // Log mean values to console
            console.log('Mean Danceability:', meanDanceability);
            console.log('Mean Valence:', meanValence);
            console.log('Mean Energy:', meanEnergy);
            console.log('Mean Mode:', meanMode);

            meanDanceability = meanDanceability.toFixed(2);
            meanValence = meanValence.toFixed(2);
            meanEnergy = meanEnergy.toFixed(2);
            meanMode = meanMode.toFixed(2);

            // Update ViewModel's mean variables
            self.meanDanceability(meanDanceability);
            self.meanValence(meanValence);
            self.meanEnergy(meanEnergy);
            self.meanMode(meanMode);

            window.meanDanceability = meanDanceability;
            window.meanValence = meanValence;
            window.meanEnergy = meanEnergy;
            window.meanMode = meanMode;

          // Load sketch.js after mean variables are calculated
          loadSketch();
        })
        .catch(function(error) {
          console.error('Error fetching audio features:', error);
        });
    };

    // Function to load sketch.js after mean variables are calculated
    function loadSketch() {
    var script = document.createElement('script');
    script.src = 'flower-visualiser/sketch.js';
    script.onload = function() {
      window.setup(meanDanceability, meanValence, meanEnergy, meanMode);
    };
    document.body.appendChild(script);
}

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
      self.user(null);
      self.topTracks([]);
      self.display_name('');
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

// Function to get mean danceability
this.getMeanDanceability = function() {
  return self.meanDanceability();
};

// Function to get mean valence
this.getMeanValence = function() {
  return self.meanValence();
};

// Function to get mean energy
this.getMeanEnergy = function() {
  return self.meanEnergy();
};

// Function to get mean mode
this.getMeanMode = function() {
  return self.meanMode();
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

  // Make ViewModel accessible globally
  window.viewModel = viewModel;
})();
