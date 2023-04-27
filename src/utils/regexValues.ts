export const patternRegex = {
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  aadhar: /^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  wholePositive: /^(0|[1-9]\d*)$/,
  onlyPositive: /^([1-9]\d*)$/,
  postiveNumber: /^[+]?([0-9]+(?:[\\.][0-9]*)?|\.[0-9]+)$/,
  postiveNumberAboveZero: /^[+]?([1-9]+(?:[\\.][1-9]*)?|\.[1-9]+)$/,
  mobile: /^[0-9]{10}$/
};
