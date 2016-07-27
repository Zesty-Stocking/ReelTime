import React from 'react';

const Landing = (props) => (
  <div id="page-top" className="index landing">
    <nav id="mainNav" className="navbar navbar-default navbar-custom navbar-fixed-top">
      <div className="container">
        <div className="navbar-header page-scroll">
          <a className="navbar-brand page-scroll" href="#page-top">ReelTime</a>
        </div>
      </div>
    </nav>
    <header>
      <div className="container">
        <div className="intro-text">
          <div className="intro-lead-in">Watch TV with your friends</div>
          <div className="intro-heading">But in your underwear</div>
          <p>
            Drop Your Video File Here
            <input type="file" id="files" name="file" onChange={props.setFile} />
            <form id="youtubeform" name="youtubeform" onSubmit={props.setYoutubeLink} >
              <input type="text" name="link" id="youtubelink" />
              <input type="submit" value="submit" />
            </form>
          </p>
        </div>
      </div>
    </header>
    <section id="services">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2 className="section-heading">About ReelTime</h2>
            <h3 className="section-subheading text-muted">The best video watching experience... in your underwear.</h3>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-4">
            <span className="fa-stack fa-4x">
              <i className="fa fa-circle fa-stack-2x text-primary"></i>
              <i className="fa fa-users fa-stack-1x fa-inverse"></i>
            </span>
            <h4 className="service-heading">Peer-to-peer</h4>
            <p className="text-muted">No need for a centralized, bandwidth-heavy, insecure server. ReelTime uses direct peer-to-peer connections, sending video directly from one client to another.</p>
          </div>
          <div className="col-md-4">
            <span className="fa-stack fa-4x">
              <i className="fa fa-circle fa-stack-2x text-primary"></i>
              <i className="fa fa-laptop fa-stack-1x fa-inverse"></i>
            </span>
            <h4 className="service-heading">Watch with friends</h4>
            <p className="text-muted">Enjoy your favorite (legally-acquired) shows and movies with your friends, over video and text chat.</p>
          </div>
          <div className="col-md-4">
            <span className="fa-stack fa-4x">
              <i className="fa fa-circle fa-stack-2x text-primary"></i>
              <i className="fa fa-lock fa-stack-1x fa-inverse"></i>
            </span>
            <h4 className="service-heading">No logging</h4>
            <p className="text-muted">We do not log the videos, filenames, or chats that you send over our service.</p>
          </div>
        </div>
      </div>
    </section>
    <section id="team" className="bg-light-gray">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2 className="section-heading">Our Amazing Team</h2>
            <h3 className="section-subheading text-muted">Meet the ReelTime Greenfield Project Team</h3>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-lg-offset-2 text-center">
            <p className="large text-muted">We are a group of developers from Silicon Valley. We were lonely and wanted to watch TV with each other, but didn’t want to leave our beds. Thus, ReelTime was born. Now we can stay in our underwear while we watch our favorite shows together.</p>
            <p className="large text-muted">In order to facilitate serverless, decentralized, peer-to-peer video streaming and video chat, we are using the library Peer.js, an abstraction layer on top of WebRTC, along with adapter.js, a shim to insulate WebRTC apps from different environments. WebRTC signaling is performed through WebSockets over the peerjs.com server, and Google STUN servers are used to enable NAT traversal. Socket.io was used for the text chat, as well as for low-latency video playback sync. ReelTime is built on React, Node, and Express.</p>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <span className="copyright">Created at Hack Reactor</span>
          </div>
          <div className="col-md-4">
            <ul className="list-inline social-buttons">
              <li><a href="https://twitter.com/HackReactor?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"><i className="fa fa-twitter"></i></a>
              </li>
              <li><a href="https://www.facebook.com/hackreactor"><i className="fa fa-facebook"></i></a>
              </li>
              <li><a href="https://www.instagram.com/explore/locations/70325290/"><i className="fa fa-linkedin"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

Landing.propTypes = {
  setFile: React.PropTypes.func.isRequired,
};

export default Landing;
