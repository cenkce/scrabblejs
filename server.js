const { PeerServer } = require('peer');
const cors = require('cors');

const peerServer = PeerServer({ allow_discovery: true, port: 9000, path: '/app' });
peerServer.use(cors)