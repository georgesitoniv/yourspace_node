const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const path = require('path');
const { database } = require('./firebase');
const webpackConfig = require('../../webpack.config');

let app = express();
app.use(webpackDevMiddleware(webpack(webpackConfig)));
// app.use(express.static(path.resolve(__dirname, '../../dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
// });

module.exports = app;
