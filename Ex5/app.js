const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const moment = require('moment');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

moment.locale('hu');

app.get('/', (req, res) => {
  res.json({
    now: moment().format('YYYY-MM-DD dddd')
  });
});

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
