import React from 'react';

const Link = (props) => (
  <div id="link">
    <div id="link-message">
      Send your friend the following link:<br />
      <span id="link-url">http://localhost:3000/?id={props.myId}&video={props.type}</span>
    </div>
  </div>
);

Link.propTypes = {
  myId: React.PropTypes.string,
};

export default Link;
