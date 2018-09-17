import {config} from './Config.js';
import openSocket from 'socket.io-client';
const  socket = openSocket(config.apiserver);
function subscribeToBlocks(cb) {
  socket.on('blocks', blocks => cb(null, blocks));
  socket.emit('subscribeToBlocks', 1000);
}
export { subscribeToBlocks };