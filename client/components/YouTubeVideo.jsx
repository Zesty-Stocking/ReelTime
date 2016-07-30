import React from 'react';
import ReactPlayer from 'react-player'

class YouTubeVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      played: 0,
      loaded: 0,
      duration: 0,
      seeking: false
    }

    this.emitPlayAndListenForPause = this.props.emitPlayAndListenForPause.bind(this);
    this.emitPauseAndListenForPlay = this.props.emitPauseAndListenForPlay.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }

  componentDidMount() {
    this.props.initVoice();
    this.initListeners();
  }

  initListeners() {
    this.props.socket.on('go back', () => {
      console.log('go back message received, about to sync');
      var currentTime = Math.floor(this.state.played * this.state.duration);
      var targetTime = Math.floor(currentTime - 10, 0);
      var targetFraction = targetTime / this.state.duration;
      this.seekTo(targetFraction);
    });

    this.props.socket.on('progress', (otherProgress) => {
      // Sync videos if they are way off:
      var currentTime = Math.floor(this.state.played * this.state.duration);
      var otherTime = Math.floor(otherProgress.played * this.state.duration);

      if (currentTime > otherTime + 1 || currentTime < otherTime - 1) {
        console.log('syncing videos!');
        this.seekTo(otherProgress.played);
      }
    });
  }

  seekTo(targetFraction) {
    // stop emitting progress temporarily
    this.setState({ seeking: true });
    this.refs.player.seekTo(targetFraction);
    // resume emitting progress
    this.setState({ seeking: false });
  }

  onProgress(state) {
    this.setState(state);    
    // only emit progress if we're not in the middle of seeking
    if (!this.state.seeking) {
      // emit the progress of the video so server can listen and keep the two peers in sync
      this.props.socket.emit('progress', state);  
    }
  }

  render () {
    return (
      <ReactPlayer
        className='video'
        ref='player'
        url={ this.props.url }
        controls
        playing={ this.props.playing }
        volume={ this.props.volume }
        onPlay={ this.emitPlayAndListenForPause }
        onPause={ this.emitPauseAndListenForPlay }
        onProgress = { this.onProgress }
        progressFrequency = { 500 }
        onDuration = { duration => this.setState({ duration }) }
      />
    )
  }
}

export default YouTubeVideo;
