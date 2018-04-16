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
  }

  addTrack(track){
    console.log(`Attempting to Add Track ${track.id} to playlist.`);
    let currentPlaylist = this.state.playlistTracks;

    if(!currentPlaylist.some(trackID => trackID.id === track.id)){
      console.log(`Track ${track.id} is not in playlist. Adding to Playlist`);
      currentPlaylist.push(track);
      this.setState({playlistTracks: currentPlaylist});
    } else console.log('Song is already in playlist');
  }

  removeTrack(track){
    console.log(`Removing ${track.id} from playlist.`);
    let currentPlaylist = this.state.playlistTracks;

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
    Spotify.search(term).then(result => this.setState({searchResults: result}));
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
