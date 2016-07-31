import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

var host;
var NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'production') {
  host = 'https://reeltimeapp.herokuapp.com';
} else if (NODE_ENV === 'staging') {
  host = 'https://staging-reeltime.herokuapp.com';
} else {
  let port = 3000; // or whatever the port is for express server
  host = `http://localhost:${port}/`;
}

class Link extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    }
  }

  render() {
    let url = `${host}?id=${this.props.myId}&video=${this.props.type}`;

    return (
      <div id="link">
        <div id="link-message">
          Send your friend the following link:<br />
          <span id="link-url">{url}</span>

          <div className="copy-btn">
            <CopyToClipboard text={`${url}`}
              onCopy={ () => this.setState({ copied: true }) }>
              <button className="btn btn-primary">Copy to clipboard</button>
            </CopyToClipboard>

            {this.state.copied ? <span className="copied-text">Copied!</span> : null}
          </div>

        </div>
      </div>
    );
  }

}

Link.propTypes = {
  myId: React.PropTypes.string,
};

export default Link;
