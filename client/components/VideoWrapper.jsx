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
      youtubeLink: props.youtubeLink
    };
  }

  componentDidMount() {
    if (this.props.isSource) {
      this.initAsSource(this.props.videoType);
    } else {
      this.initAsReceiver(this.props.videoType, this.props.peerId);
    }
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

  render() {
    return (
      <div>
        {this.props.videoType === 'file' ?
          <div className="wrapper">
            <Video socket={this.props.socket} />
            <ChatSpace socket={this.props.socket} isSource={this.props.isSource} peerId={this.props.peerId} />
          </div> :
          <div className="wrapper">
            <YouTubeVideo socket={this.props.socket} url={ this.state.youtubeLink }/>
            <ChatSpace socket={this.props.socket} isSource={this.props.isSource} peerId={this.props.peerId} />
          </div>
        }
      </div>
    );
  }
};

export default VideoWrapper;
