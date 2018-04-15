let accessToken = '';
let expiresIn = '';
let userID = '';

const clientId = '19f2c30b492c4c6cac6c958566125c2a';
const redirectUri = 'http://localhost:3000/';
const header = {Authorization: `Bearer ${accessToken}`};

export const Spotify = {
  getAccessToken(){
    console.log('Getting Access Token');
    if(accessToken) {
      console.log('Access Token Exists. Returning.');
      return accessToken;
    } else {
        console.log('Access Token not set. Checking URL');
        let accessTokenUrl = window.location.href.match(/access_token=([^&]*)/);
        if (accessTokenUrl) {
          console.log('Token in URL');

          accessToken = accessTokenUrl[1];
          expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
        } else {
          console.log('Login Required');
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
          }
      }
  },

  search(term) {
    console.log('Begin Search');
    if (!accessToken) {
      console.log('Access Token not Set. Retrieving Access Token');
      Spotify.getAccessToken();
    }

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
          { headers: header }
        ).then(response => response.json()).then(jsonResponse => {
          if(jsonResponse.tracks) {
            console.log('Search Sucessful');
            return jsonResponse.tracks.items.map(track =>
            ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }));
          } else {
            return [];
          }
        });
  },

  savePlaylist(playlistName, trackURIs){
    let playlistId;

    if(!playlistName || !trackURIs){
      return;
    }else {
      // GETs userID
       return fetch('https://api.spotify.com/v1/me',
          {
            headers: {Authorization: `Bearer ${accessToken}`}
          }
        ).then(response => {
          if(response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
          {
           headers: {Authorization: `Bearer ${accessToken}`},
           method: 'POST',
           body: JSON.stringify({name: playlistName})
         }
       ).then(response => {
           if (response.ok) {
             return response.json();
           }
           throw new Error('Request failed!');
         }, networkError => console.log(networkError.message)
         ).then(jsonResponse => {
           playlistId = jsonResponse.id;
           return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,
             {
               headers: {Authorization: `Bearer ${accessToken}`},
               method: 'POST',
               body: JSON.stringify({uris: trackURIs})
             }
           ).then(response => {
               if(response.ok) {
                 return response.json();
               }
               throw new Error('Request failed!');
             }, networkError => console.log(networkError.message)
             ).then(jsonResponse =>{
               console.log('Playlist Saved Sucessfully');
               return jsonResponse.id;
             });
         });
      });
    }
  }
}
