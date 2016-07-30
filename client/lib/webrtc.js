import Peer from 'peerjs';

var host, secure, port;

if (process.env.NODE_ENV === 'production') {
  //host = 'staging-reeltime.herokuapp.com';
  host = 'reeltime-peerjs.herokuapp.com';
  //host = 'peerjs-server-simple.herokuapp.com';
  port = 443;
  secure = true;
} else {
  host = 'localhost';
  port = 3000;
  secure = false;
}

// const peer = new Peer({ key: 'dyf2h2fyul2nvcxr' });
var peerOpts = {
  key: 'peerjs',
  host: host,
  port: port,
  debug: 3,
  secure: secure
};

// manually-set the id, because server is not doing it properly ATM
var randomId = function () {
  return (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
};

const peer = new Peer(peerOpts);

console.log('---inside of lib/webrtc');
console.log(peer.options);

// Returns a Promise that is resolved with this peer's ID, assigned by the signaling server.
const getMyId = () => new Promise((resolve, reject) => {
  if (!peer.id) {
    // ID not received yet. Listen for open event.
    peer.on('open', resolve);
    peer.on('error', reject);
  } else {
    // ID already exists; resolve.
    resolve(peer.id);
  }
});

// Returns a Promise that is resolved with an active peer.js DataConnection.
// If sourceId is specified, this will connect to an existing peer with that source ID.
// If sourceId is not specified, this will listen for an incoming connection.
const establishPeerConnection = (sourceId) => new Promise((resolve, reject) => {
  const connect = () => {
    if (sourceId) {
      const conn = peer.connect(sourceId, { reliable: true });

      conn.on('open', () => {
        console.log('RTC data connection established - acting as receiver');
        resolve(conn);
      });

      conn.on('error', (error) => {
        reject(error);
      });
    } else {
      peer.on('connection', (conn) => {
        conn.on('open', () => {
          console.log('RTC data connection established - acting as source');
          resolve(conn);
        });
      });

      peer.on('error', (error) => {
        reject(error);
      });
    }
  };

  if (peer.disconnected) {
    peer.on('open', connect);
    peer.on('error', reject);
  } else {
    connect();
  }
});

// Returns a Promise that is resolved with an active peer.js MediaConnection.
// A MediaStream in active state must be provided as the first argument.
// If sourceId is specified, this will connect to an existing peer with that source ID.
// If sourceId is not specified, this will listen for an incoming connection.
const establishPeerCall = (mediaStream, sourceId) => new Promise((resolve, reject) => {
  const connect = () => {
    if (sourceId) {
      const call = peer.call(sourceId, mediaStream);

      call.on('stream', (stream) => {
        console.log('RTC call established - acting as receiver');
        resolve(stream);
      });

      call.on('error', (error) => {
        reject(error);
      });
    } else {
      peer.on('call', (call) => {
        call.answer(mediaStream);
        call.on('stream', (stream) => {
          console.log('RTC call established - acting as source');
          resolve(stream);
        });
      });

      peer.on('error', (error) => {
        reject(error);
      });
    }
  };

  if (peer.disconnected) {
    peer.on('open', connect);
    peer.on('error', reject);
  } else {
    connect();
  }
});

export {
  getMyId,
  establishPeerConnection,
  establishPeerCall,
};
