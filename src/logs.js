const { cyan, green, grey } = require("kleur");
const TeenyLogger = require("teeny-logger");
const logger = new TeenyLogger({
  boring: process.env.NODE_ENV === "test",
});

/**
 * Log multiple error messages at the prompt using `console.error` behind the scenes.
 * @param {string[]} errorMessages array of error message to display line by line
 * @param {number} [exitStatus=0] the process will exit with this value, unless set to false
 */
const displayErrorMessages = (errorMessages, exitStatus = 0) => {
  if (errorMessages && errorMessages.length) {
    logger.log();
    errorMessages.forEach(function (msg) {
      logger.error(msg);
    });
    logger.log();

    if (typeof exitStatus === "number") {
      process.exit(exitStatus);
    }
  }
};

/**
 * Log simplified HTTP logs at the prompt, extracting only the methods and the url from
 * the argument. Each log is prefixed with a locally formatted timestamp.
 * @param {Object} req an object with the keys "method" and "url"
 * @param {string} req.method  the HTTP method
 * @param {string} req.url the URL
 */
const printHTTPLogs = (req) => {
  const now = new Date();
  logger.log(
    `${grey("[ ")}${grey(now.toDateString())} ${grey(
      now.toLocaleTimeString()
    )}${grey(" ]")} ${green(req.method)} ${cyan(req.url)}`
  );
};

module.exports = {
  displayErrorMessages,
  printHTTPLogs,
};
