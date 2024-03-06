(function() {
  'use strict';

  var ViewModel = function() {
    this.isLoggedIn = ko.observable(false);
    this.login = function() {
      var self = this;
      this.loginErrorMessage(null);
      OAuthManager.obtainToken({
        scopes: [
          /*
            the permission for reading public playlists is granted
            automatically when obtaining an access token through
            the user login form
            */
            'user-read-private'
          ]
        }).then(function(token) {
          onTokenReceived(token);
        }).catch(function(error) {
          self.loginError(error);
        });
    };

    this.logout = function() {
      if (!this.isLoggedIn()) { // Check if the user is already logged out
        return; // If already logged out, do nothing
      }
      localStorage.removeItem(accessTokenKey);
      this.isLoggedIn(false);
      window.location.href = 'http://127.0.0.1:5500/index.html#';
    };

    this.loginError = function(errorCode) {
      switch (errorCode) {
        case 'access_denied':
          this.loginErrorMessage('You need to grant access in order to use this website.');
          break;
        default:
          this.loginErrorMessage('There was an error trying to obtain authorization. Please, try it again later.');
        }
    };

    this.loginErrorMessage = ko.observable(null);

    this.user = ko.observable(null);

    this.playlists = ko.observableArray([]);

    this.toptracks = ko.observableArray([]);

    this.audiofeatures = ko.observableArray([]);
  };

  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);

  var spotifyApi = new SpotifyWebApi(),
      accessTokenKey = 'sp-access-token';

  function onTokenReceived(token) {
    viewModel.isLoggedIn(true);
    localStorage.setItem(accessTokenKey, token);
    window.location.href = 'main.html';

    // do something with the token
    spotifyApi.setAccessToken(token);
    spotifyApi.getMe().then(function(data) {
      viewModel.user(data);

      spotifyApi.getUserPlaylists(data.id).then(function(playlists) {
        console.log(playlists);
        viewModel.playlists(playlists.items);
      });

      spotifyApi.getMyTopTracks(data.id).then(function(toptracks) {
        console.log(toptracks);
        viewModel.toptracks(toptracks.items);
    
        var trackIds = toptracks.items.map(function(track) {
            return track.id;
        });
    
        // Call the API to get audio features for the top tracks
        spotifyApi.getAudioFeaturesForTracks(trackIds).then(function(audiofeatures) {
            console.log(audiofeatures);
            var features = audiofeatures.audio_features;
    
            // Extracting the desired properties from each track's audio features
            var danceability = features.map(function(feature) {
                return feature.danceability;
            });
            var mode = features.map(function(feature) {
                return feature.mode;
            });
            var energy = features.map(function(feature) {
                return feature.energy;
            });
            var valence = features.map(function(feature) {
                return feature.valence;
            });
    
            // Now you can use these arrays (danceability, mode, energy, valence) as needed
            console.log('Danceability:', danceability);
            console.log('Mode:', mode);
            console.log('Energy:', energy);
            console.log('Valence:', valence);
            
            // Optionally, you can update your ViewModel with these arrays
            viewModel.danceability = ko.observableArray(danceability);
            viewModel.mode = ko.observableArray(mode);
            viewModel.energy = ko.observableArray(energy);
            viewModel.valence = ko.observableArray(valence);
        }).catch(function(error) {
            console.error('Error getting audio features:', error);
        });
    }).catch(function(error) {
        console.error('Error getting top tracks:', error);
    });    

    });
  }

  /**
   * Uses the stored access token
   */
  function initAccessToken() {
    var storedAccessToken = localStorage.getItem(accessTokenKey);
    if (storedAccessToken) {
      onTokenReceived(storedAccessToken);
    }
  }

  initAccessToken();

})();

