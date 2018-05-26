const socket = new WebSocket('ws://localhost:3005');

// socket.onopen = event => socket.send('hello');

socket.onmessage = event => {
  if (event.data === 'reload') {
    window.location.reload();
  }
};
