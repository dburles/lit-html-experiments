#!/usr/bin/env node

const Koa = require('koa');
const websockify = require('koa-websocket');
const chokidar = require('chokidar');

const sock = websockify(new Koa());
const app = new Koa();

const connections = [];

const srcDir = (() => {
  if (process.argv[2]) {
    return process.argv[2];
  }
  throw new Error('Please specify watch directory!');
})();

sock.ws.use(function(ctx, next) {
  connections.push(ctx.websocket);
  // ctx.websocket.on('message', function(message) {});
  ctx.websocket.on('close', function() {
    connections.splice(connections.indexOf(ctx.websocket), 1);
  });
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next(ctx);
});

chokidar
  .watch(srcDir, { ignored: '**/node_modules' })
  .on('all', (event, path) => {
    console.log(event, path);
    connections.forEach(connection => connection.send('reload'));
  });

app.use(
  require('koa-static')(srcDir, {
    /* options */
  }),
);

app.listen(3000);
sock.listen(3005);

console.log(`💦  Server running at http://localhost:3000`);
