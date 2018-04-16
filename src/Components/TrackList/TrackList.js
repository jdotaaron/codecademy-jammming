import React from 'react';
import './TrackList.css';

import Track from '../Track/Track';

class TrackList extends React.Component {

  mapTracks() {
    let results = this.props.tracks;
    return results.map(track => {
      if (this.props.playlistTracks === undefined || this.props.playlistTracks === 0) {
        console.log(this.props.playlistTracks);
        return (<Track key={track.id}
                      track={track}
                      onAdd={this.props.onAdd}
                      onRemove={this.props.onRemove}
                      isRemoval={this.props.isRemoval} />
                )} else if(!this.props.playlistTracks.includes(track)){
                  console.log('track is in the playlist');
                  return (<Track key={track.id}
                                track={track}
                                onAdd={this.props.onAdd}
                                onRemove={this.props.onRemove}
                                isRemoval={this.props.isRemoval} />
                          )};
    });
  }

  render(){
    return (
      <div className="TrackList">
        { this.mapTracks() }
      </div>
    );
  }
}

export default TrackList;
