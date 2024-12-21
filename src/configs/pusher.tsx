// src/pusherConfig.js
import Pusher from 'pusher-js';

const key = '82ae322a20416e54cc8a';
const cluster = 'us2';

const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY || key, {
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || cluster,
  encrypted: true,
});

pusher.logToConsole = true;
export default pusher;
