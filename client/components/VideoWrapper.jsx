import React, { Component } from "react";

import Video from "./Video.jsx";
import ChatSpace from "./ChatSpace.jsx";

import { establishPeerConnection } from '../lib/webrtc';
import readFile from '../lib/fileReader';
import appendChunk from '../lib/mediaSource';

class VideoWrapper extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    if (this.props.isSource) {
      this.initAsSource();
    } else {
      this.initAsReceiver(this.props.peerId);
    }
  }

  initAsSource() {
    //establishpeerconnection here
    establishPeerConnection().then((conn) => {
      // Now connected to receiver as source

      // Remove the link display in app.jsx
      this.props.hideLink();

      // Read in the file from disk.
      // For each chunk, append it to the local MediaSource and send it to the other peer
      const video = document.querySelector('.video');
      readFile(this.props.file, (chunk) => {
        appendChunk(chunk, video);
        conn.send(chunk);
      });
    })
    .catch(console.error.bind(console));
  }

  initAsReceiver() {
    //establishpeerconnection here
    establishPeerConnection(this.props.peerId).then((conn) => {
      // Now connected to source as receiver

      // Listen for incoming video data from source
      conn.on('data', (data) => {
        if (typeof data === 'string') {
          console.log(data);
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
      <div className="wrapper">
        <Video socket={this.props.socket} />
        <ChatSpace socket={this.props.socket} isSource={this.props.isSource} peerId={this.props.peerId} />
      </div>
    );
  }
};

export default VideoWrapper;