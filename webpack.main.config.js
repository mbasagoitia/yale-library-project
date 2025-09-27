// webpack.main.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env.production.demo',
      systemvars: true,
    }),
  ],
};
