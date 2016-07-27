import React from 'react';

let host = process.env.NODE_ENV === 'production' ? 'https://reeltimeapp.herokuapp.com/' : 'http://localhost:3000/'; 
const Link = (props) => (
  <div id="link">
    <div id="link-message">
      Send your friend the following link:<br />
      <span id="link-url">{host}?id={props.myId}&video={props.type}</span>
    </div>
  </div>
);

Link.propTypes = {
  myId: React.PropTypes.string,
};

export default Link;
