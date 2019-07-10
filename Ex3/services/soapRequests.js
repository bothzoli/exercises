const debug = require('debug')('app:soapRequests');
const chalk = require('chalk');

const { sendSoapRequest } = require('./soapWrapper');
const getCommonIntMultiplier = require('./../utils/commonIntMultiplier');

const resultRegExp = /<\w+Result>(.*)<\/\w+Result>/;

function soapRequests() {
  function createMethodEnvelope(method) {
    return function insertIntValues(intA, intB) {
      return `<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>
  <s11:Body>
    <ns1:${method} xmlns:ns1='http://tempuri.org/'>
      <ns1:intA>${intA}</ns1:intA>
      <ns1:intB>${intB}</ns1:intB>
    </ns1:${method}>
  </s11:Body>
</s11:Envelope>`;
    };
  }

  function getResultFromResponse(res) {
    return resultRegExp.exec(res)[1];
  }

  async function soapRequest(method, intA, intB) {
    const res = await sendSoapRequest(createMethodEnvelope(method)(intA, intB));
    return getResultFromResponse(res);
  }

  function add(intA, intB) {
    debug(chalk`{yellow Creating SOAP request for: ${intA} + ${intB}}`);
    return soapRequest('Add', intA, intB);
  }

  function subtract(intA, intB) {
    debug(chalk`{yellow Creating SOAP request for: ${intA} - ${intB}}`);
    return soapRequest('Subtract', intA, intB);
  }

  function multiply(intA, intB) {
    debug(chalk`{yellow Creating SOAP request for: ${intA} * ${intB}}`);
    return soapRequest('Multiply', intA, intB);
  }

  function divide(intA, intB) {
    debug(chalk`{yellow Creating SOAP request for: ${intA} / ${intB}}`);
    const commonIntMultiplier = getCommonIntMultiplier(intA, intB);
    return soapRequest('Divide', commonIntMultiplier * intA, commonIntMultiplier * intB);
  }

  return {
    add,
    subtract,
    multiply,
    divide
  };
}

module.exports = soapRequests();
