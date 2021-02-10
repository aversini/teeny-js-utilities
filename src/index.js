const deepEqual = require("./deepEqual");
const { capitalize, kebabCase, upperFirst } = require("./strings");
const { displayErrorMessages, printHTTPLogs } = require("./logs");
const {
  ONE_SECOND,
  isScopedPackage,
  runCommand,
  shallowMerge,
  Spinner,
} = require("./misc");
const Performance = require("./performance");
const { parseGitHubURL } = require("./github");

module.exports = {
  // constants
  ONE_SECOND,
  Performance,
  Spinner,
  // public methods
  capitalize,
  // "private" methods
  deepEqual,
  displayErrorMessages,
  isScopedPackage,
  kebabCase,
  parseGitHubURL,
  printHTTPLogs,
  runCommand,
  shallowMerge,
  upperFirst,
};
