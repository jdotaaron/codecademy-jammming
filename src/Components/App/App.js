import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import { Spotify } from '../util/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.searchResultLocation = [];
  }

  addTrack(track){
    console.log(`Attempting to Add Track ${track.id} to playlist.`);
    let currentPlaylist = this.state.playlistTracks;
    let currentSearchResults = this.state.searchResults;

    if(!currentPlaylist.some(trackID => trackID.id === track.id)){
      console.log(`Track ${track.id} is not in playlist. Adding to Playlist`);
      currentPlaylist.push(track);
      this.setState({playlistTracks: currentPlaylist});

      // Get index of current track being added
      let searchIndex = currentSearchResults.indexOf(track);
      // save location in search results of added track
      this.searchResultLocation.push([searchIndex, track]);
      console.log(this.searchResultLocation);
      // Remove Track from array
      currentSearchResults.splice(searchIndex, 1);
      // set new state of SearchResults
      this.setState({ searchResults: currentSearchResults});
    } else console.log('Song is already in playlist');
  }

  removeTrack(track){
    console.log(`Removing ${track.id} from playlist.`);
    let currentPlaylist = this.state.playlistTracks;
    let currentSearchResults = this.state.searchResults;

      if(this.searchResultLocation.length > 0){
        let originalSearchLocation;
        //locate saved track for its original index
        this.searchResultLocation.forEach(searchTrack => {
          if(searchTrack[1].id === track.id){
            originalSearchLocation = searchTrack[0];
          }
        })
        // reinsert track to proper location in searchResults
        currentSearchResults.splice(originalSearchLocation, 0, track);
      }

    this.setState({playlistTracks: currentPlaylist.filter(tracks => tracks.id !== track.id)});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
   const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist', playlistTracks: []});
  }

  search(term){
    let currentPlaylist = this.state.playlistTracks;
    let modifiedSearch = [];
    // reset searchResultLocation
    this.searchResultLocation = [];
    console.log(this.searchResultLocation);
    // if no songs in playlist, allow search to behave as normal
    if(currentPlaylist.length === 0){
      Spotify.search(term).then(result => this.setState({searchResults: result}));
    } else {
      Spotify.search(term).then(result =>
        {
          // For each track in the results...
          result.forEach(track => {
            // check if the ID DOES NOT match any of the IDs in currentPlaylist
            if(!currentPlaylist.some(playlistTrack => playlistTrack.id === track.id)){
              // push to modified searchResults
              modifiedSearch.push(track);
            }
          });
          this.setState({searchResults : modifiedSearch});
        });

    }

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
