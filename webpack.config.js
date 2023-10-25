const path = require('path');

module.exports = {
    mode: 'development',
    resolve: {
        fallback: {
          dgram: false,
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          os: false,
          util: false,
          path: false,
          "path-browserify": false,
          "stream-browserify": false,
          "string-decoder": false,
          "querystring-es3": false,
          "stream-http": false,
          "string_decoder": false,
          url: false,
          buffer: false,
          stream: false,
          zlib: false,
          querystring: false,
          http: false,
          https: false,
          "stream-http": false,
          "crypto-browserify": false,
          "https-browserify": false,
          "https-browserify": false,
          "osx-temperature-sensor": false,
          "async_hooks": false,
          crypto: false,
        }
    },
    entry: './server.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};