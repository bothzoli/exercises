const soapRequest = require('easy-soap-request');
const debug = require('debug')('app:soapWrapper');
const chalk = require('chalk');

const header = {
  'Content-Type': 'text/xml',
};

function soapWrapper(url) {
  async function sendSoapRequest(req) {
    debug(chalk`{cyan Sending SOAP request:}\n${req}`);
    const { response } = await soapRequest(url, header, req, 0);
    const { body } = response;
    debug(chalk`{green SOAP request response:}\n${body}`);
    return body;
  }

  return {
    sendSoapRequest
  };
}

module.exports = soapWrapper(process.env.SERVICE_URL);
