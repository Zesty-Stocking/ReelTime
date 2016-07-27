import React from "react";

import Landing from './Landing';
import Link from './Link';
import VideoWrapper from './VideoWrapper'

import { getMyId } from '../lib/webrtc';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setFile = this.setFile.bind(this);
    this.hideLink = this.hideLink.bind(this);

    const params = new URLSearchParams(location.search.slice(1));
    const isSource = !params.has('id');

    this.state = {
      isSource,
      file: null,
      myId: null,
      peerId: params.get('id'),
      showLanding: isSource,
      showLink: isSource,
      showBody: !isSource,
    };
  }

  componentDidMount() {
    if (this.state.isSource) {
      this.initAsSource();
    }
  }

  setFile(e) {
    console.log('setting file:', e.target.files[0]);
    this.setState({
      file: e.target.files[0],
      showLanding: false,
      showBody: true,
    });
  }

  hideLink() {
    this.setState({
      showLink: false,
    })
  }

  initAsSource() {
    // Act as source: display a link that may be sent to a receiver
    getMyId().then((myId) => {
      this.setState({
        myId,
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.showLanding ? <Landing setFile={this.setFile} /> : null}
        {this.state.showLink ? <Link myId={this.state.myId} /> : null}
        {this.state.showBody ? 
          <VideoWrapper 
            socket={this.props.socket}
            isSource={this.state.isSource}
            peerId={this.state.peerId}
            hideLink={this.hideLink}
            file={this.state.file}
          /> : null}
      </div>
    );
  }
}

App.propTypes = {
  socket: React.PropTypes.object.isRequired,
};

export default App;
