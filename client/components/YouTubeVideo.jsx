import React from 'react';
import ReactPlayer from 'react-player'

class YouTubeVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
    }

    this.emitPlayAndListenForPause = this.emitPlayAndListenForPause.bind(this);
    this.emitPauseAndListenForPlay = this.emitPauseAndListenForPlay.bind(this);
  }

  emitPlayAndListenForPause() {
    this.props.socket.emit('play', 0);
    this.props.socket.on('pause', (otherTime) => {
      this.setState({ playing: false });
    });
  }

  emitPauseAndListenForPlay() {
    this.props.socket.emit('pause', 0);
    this.props.socket.on('play', (otherTime) => {
      this.setState({ playing: true });
    });
  }

  render () {
    return (
      <ReactPlayer
        url={ this.props.url }
        controls
        playing={ this.state.playing }
        onPlay={ this.emitPlayAndListenForPause }
        onPause={ this.emitPauseAndListenForPlay }
      />
    )
  }
}

export default YouTubeVideo;
