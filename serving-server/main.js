const Koa = require('koa');
const websockify = require('koa-websocket');
const chokidar = require('chokidar');

const sock = websockify(new Koa());
const app = new Koa();

const connections = [];

sock.ws.use(function(ctx, next) {
  connections.push(ctx.websocket);
  // ctx.websocket.on('message', function(message) {});
  ctx.websocket.on('close', function() {
    connections.splice(connections.indexOf(ctx.websocket), 1);
  });
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next(ctx);
});

chokidar.watch('../src').on('all', (event, path) => {
  console.log(event, path);
  connections.forEach(connection => connection.send('reload'));
});

app.use(
  require('koa-static')('../src', {
    /* options */
  }),
);

app.listen(3000);
sock.listen(3005);
