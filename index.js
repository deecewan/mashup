import chokidar from 'chokidar';
import http from 'http';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.babel';
import loadConfig from './server/lib/loadConfig';
import routes from './server';
// set up the environment
loadConfig('development');

const app = express();
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);

// Serve hot-reloading bundle to client
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));

  app.use((req, res, next) => {
    require('./server').default(req, res, next); // eslint-disable-line global-require
  });

  const watcher = chokidar.watch('./server');

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach(id => {
        if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });

// Do "hot-reloading" of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
  compiler.plugin('done', () => {
    console.log('Clearing /client/ module cache from server');
    Object.keys(require.cache).forEach(id => {
      if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
  });
} else {
  app.use(routes);
}

const server = http.createServer(app);
server.listen(3000, '0.0.0.0', err => {
  if (err) throw err;

  const addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});
