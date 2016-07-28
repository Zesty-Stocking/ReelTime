import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

let host = process.env.NODE_ENV === 'production' ? 'https://reeltimeapp.herokuapp.com/' : 'http://localhost:3000/'; 

class Link extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false
    }
  }

  render() {
    let url = host + '?id=' + this.props.myId + '&video=' + this.props.type;

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
