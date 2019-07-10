require('dotenv').config();
const debug = require('debug')('app');

const { add, multiply, divide } = require('./services/soapRequests');

debug('55 + 42');
add(55, 42)
  .then((result) => {
    debug(`            = ${result}`);
    debug(`${result} * 12`);
    return multiply(result, 12);
  })
  .then((result) => {
    debug(`            = ${result}`);
    debug(`${result} + 3`);
    return add(result, 3);
  })
  .then((result) => {
    debug(`            = ${result}`);
    debug(`${result} / 3.14`);
    return divide(result, 3.14);
  })
  .then((result) => {
    debug(`            = ${result}`);
  });
