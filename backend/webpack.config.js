//const path = require('path');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // path: './dist',
    filename: 'bundle.js',
  },
  target: 'node'
};