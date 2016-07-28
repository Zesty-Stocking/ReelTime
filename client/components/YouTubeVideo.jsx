import React from 'react';
import ReactPlayer from 'react-player'

class YouTubeVideo extends React.Component {
  constructor(props) {
    super(props);

    this.onPressPlay = this.onPressPlay.bind(this);
    this.onPressPause = this.onPressPause.bind(this);
  }

  onPressPlay() {
    console.log('pressed Play');
  }

  onPressPause() {
    console.log('pressed Pause');
  }

  render () {
    return (
      <ReactPlayer
        url={ this.props.url }
        controls
        playing={ false }
        onPlay={ this.onPressPlay }
        onPause={ this.onPressPause }
      />
    )
  }
}

export default YouTubeVideo;
