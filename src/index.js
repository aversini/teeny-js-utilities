const deepEqual = require("./deepEqual");
const { capitalize, upperFirst } = require("./strings");
const { displayErrorMessages, printHTTPLogs } = require("./logs");
const { ONE_SECOND, runCommand, shallowMerge, Spinner } = require("./misc");

module.exports = {
  // constants
  ONE_SECOND,
  // public methods
  capitalize,
  displayErrorMessages,
  printHTTPLogs,
  runCommand,
  shallowMerge,
  Spinner,
  upperFirst,
  // "private" methods
  deepEqual,
};
