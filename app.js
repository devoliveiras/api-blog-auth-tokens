const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { estrategiasAutenticacao } = require('./scr/usuarios')

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = app;
