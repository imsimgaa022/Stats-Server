const { createServer, proxy } = require('vercel-node-server');

const app = require('../index'); // Update the path if necessary

const server = createServer((req, res) => {
  proxy(req, res, {
    path: req.url,
    onProxyRes: (proxyRes) => {
      // Add any necessary response modifications here
    },
  });
});

module.exports = server;
