import React, { Component } from "react";

import Video from "./Video.jsx";
import YouTubeVideo from "./YouTubeVideo.jsx";
import ChatSpace from "./ChatSpace.jsx";

import { establishPeerConnection } from '../lib/webrtc';
import readFile from '../lib/fileReader';
import appendChunk from '../lib/mediaSource';

class VideoWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      youtubeLink: props.youtubeLink,
      playing: false,
      volume: 0.8
    };

    this.initVoice = this.initVoice.bind(this);
    this.emitPlayAndListenForPause = this.emitPlayAndListenForPause.bind(this);
    this.emitPauseAndListenForPlay = this.emitPauseAndListenForPlay.bind(this);
  }

  componentDidMount() {
    if (this.props.isSource) {
      this.initAsSource(this.props.videoType);
    } else {
      this.initAsReceiver(this.props.videoType, this.props.peerId);
    }
    this.initListeners();
  }

  initAsSource(videoType) {
    //establishpeerconnection here
    establishPeerConnection().then((conn) => {
      // Now connected to receiver as source

      // Remove the link display in app.jsx
      this.props.hideLink();

      // Check if file or link:
      if (videoType === 'file') {
        // Read in the file from disk.
        // For each chunk, append it to the local MediaSource and send it to the other peer
        const video = document.querySelector('.video');
        readFile(this.props.file, (chunk) => {
          appendChunk(chunk, video);
          conn.send(chunk);
        });
      } else if (videoType === 'youtube') {
        conn.send(this.state.youtubeLink);
      }
    })
    .catch(console.error.bind(console));
  }

  initAsReceiver(videoType, peerId) {
    //establishpeerconnection here
    establishPeerConnection(peerId).then((conn) => {
      // Now connected to source as receiver
      // Listen for incoming video data from source
      conn.on('data', (data) => {
        if (typeof data === 'string') {
          this.setState({ youtubeLink: data });
        } else {
          // Append each received ArrayBuffer to the local MediaSource
          const video = document.querySelector('.video');
          appendChunk(data, video);
        }
      });

    });
  }

  initListeners() {
    this.props.socket.on('play', () => {
      this.setState({ 
        playing: true
      });
    });

    this.props.socket.on('pause', () => {
      this.setState({ 
        playing: false
      });
    });
  }

  // Initialize annyong voice command library and define commands
  initVoice(video) {
    video = video || null;

    var playFunction = () => {
      console.log('play voice command received');
      // TODO: dry this out using setstate for Video component too  
      (video) ? video.play() : this.setState({ playing: true }); 
      this.emitPlayAndListenForPause(video);
    };

    var pauseFunction = () => {
      console.log('pause voice command received');
      // TODO: dry this out using setstate for Video component too
      (video) ? video.pause() : this.setState({ playing: false });
      this.emitPauseAndListenForPlay(video);
    };

    var goBackFunction = () => {
      console.log('go back voice command received');
      if (video) {
        video.currentTime = Math.floor(video.currentTime - 10, 0);  
      }
      this.emitGoBack(video);
    };

    var muteFunction = () => {
      console.log('mute voice command received');
      if (video) {
        video.muted = true;  
      } else {
        this.setState({ volume: 0 });  
      }
    };

    var unmuteFunction = () => {
      console.log('unmute voice command received');
      if (video) {
        video.muted = false;  
      } else {
        this.setState({ volume: 1 });  
      }
    };

    var playCommands = {'play': playFunction};

    // define words that empirically sound like our main command, and synonyms
    var pauseWords = ['pause', 'call', 'car', 'cars', 'cause', 'hans', 
      'hollis', 'hot', 'palm', 'paul', 'paula\'s', 'paw', 'pawn', 
      'paws', 'pod', 'pods', 'polish', 'pond', 'posh'];
    var goBackWords = ['go back', 'goback'];
    var muteWords = ['mute', 'new', 'news', 'newt', 'nude', 'use', 'used', 'you'];
    var unmuteWords = ['unmute', 'enhance', 'enhanced', 'in hands', 'in hats', 'n hance'];

    // generate a command object for each array of command words
    var pauseCommands = pauseWords.reduce(function(obj, word) {
      obj[word] = pauseFunction;
      return obj;
    }, {});

    var goBackCommands = goBackWords.reduce(function(obj, word) {
      obj[word] = goBackFunction;
      return obj;
    }, {});

    var muteCommands = muteWords.reduce(function(obj, word) {
      obj[word] = muteFunction;
      return obj;
    }, {});

    var unmuteCommands = unmuteWords.reduce(function(obj, word) {
      obj[word] = unmuteFunction;
      return obj;
    }, {});


    if (annyang) {
      annyang.debug();
      annyang.addCommands(playCommands);
      annyang.addCommands(pauseCommands);
      annyang.addCommands(goBackCommands);
      annyang.addCommands(muteCommands);
      annyang.addCommands(unmuteCommands);
      annyang.start();

      setInterval(function() {
        var listen = annyang.isListening();
        console.log('listen:', listen);
      }, 1000);

      annyang.addCallback('error', function(err) {
        console.log('annyang error:', err);
      });
    }
  }

  emitPlayAndListenForPause(eventOrVideo) {
    if (eventOrVideo) {
      const video = eventOrVideo.target ? eventOrVideo.target : eventOrVideo;
      this.props.socket.emit('play', video.currentTime);
    } else {
      this.props.socket.emit('play');
    }
  }

  emitPauseAndListenForPlay(eventOrVideo) {
    if (eventOrVideo) {
      const video = eventOrVideo.target ? eventOrVideo.target : eventOrVideo;
      this.props.socket.emit('pause', video.currentTime);  
    } else {
      this.props.socket.emit('pause');  
    }
  }

  emitGoBack(video) {
    // this method will only ever be passed a video, never an event
    if (video) {
      this.props.socket.emit('go back', video.currentTime);  
    } else {
      this.props.socket.emit('go back');
    }
  }

  render() {
    return (
      <div>
        {this.props.videoType === 'file' ?
          <div className="wrapper">
            <Video 
              socket={this.props.socket} 
              initVoice={this.initVoice} 
              emitPlayAndListenForPause={this.emitPlayAndListenForPause} 
              emitPauseAndListenForPlay={this.emitPauseAndListenForPlay} 
            />
            <ChatSpace socket={this.props.socket} isSource={this.props.isSource} peerId={this.props.peerId} />
          </div> :
          <div className="wrapper">
            <YouTubeVideo 
              socket={this.props.socket} 
              initVoice={this.initVoice} 
              emitPlayAndListenForPause={this.emitPlayAndListenForPause} 
              emitPauseAndListenForPlay={this.emitPauseAndListenForPlay}
              playing={this.state.playing}
              volume={this.state.volume}
              url={ this.state.youtubeLink }
            />
            <ChatSpace socket={this.props.socket} isSource={this.props.isSource} peerId={this.props.peerId} />
          </div>
        }
      </div>
    );
  }
};

export default VideoWrapper;
