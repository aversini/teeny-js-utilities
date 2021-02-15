const deepEqual = require("./deepEqual");
const { capitalize, kebabCase, upperFirst } = require("./strings");
const { displayErrorMessages, printHTTPLogs } = require("./logs");
const {
  ONE_SECOND,
  isScopedPackage,
  runCommand,
  shallowMerge,
  Spinner,
  uniqueID,
} = require("./misc");
const { parseGitHubURL } = require("./github");
const { meowOptionsHelper, meowParserHelper } = require("./meowHelpers");

module.exports = {
  ONE_SECOND,
  Spinner,
  capitalize,
  deepEqual,
  displayErrorMessages,
  isScopedPackage,
  kebabCase,
  meowOptionsHelper,
  meowParserHelper,
  parseGitHubURL,
  printHTTPLogs,
  runCommand,
  shallowMerge,
  uniqueID,
  upperFirst,
};
