const decimalNumbersRegExp = /\d*\.?(\d*)/;

function getIntMultiplier(float) {
  const numberOfDecimalDigits = float.toString().match(decimalNumbersRegExp)[1].length;
  return 10 ** numberOfDecimalDigits;
}

function getCommonIntMultiplier(floatA, floatB) {
  const multiplierA = getIntMultiplier(floatA);
  const multiplierB = getIntMultiplier(floatB);

  return multiplierA > multiplierB ? multiplierA : multiplierB;
}

module.exports = getCommonIntMultiplier;
