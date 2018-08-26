import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:4001');
function subscribeToBlocks(cb) {
  socket.on('blocks', blocks => cb(null, blocks));
  socket.emit('subscribeToBlocks', 1000);
}
export { subscribeToBlocks };