const _ = require("lodash");
const { cyan, green, grey, red } = require("kleur");
const ora = require("ora");
const TeenyLogger = require("teeny-logger");
const util = require("util");

const exec = util.promisify(require("child_process").exec);
const deepEqual = require("./deepEqual");
const logger = new TeenyLogger({
  boring: process.env.NODE_ENV === "test",
});
const ONE_SECOND = 1000;

/* istanbul ignore next */
class Spinner {
  constructor(msg) {
    this.spinner = ora({
      isSilent: process.env.NODE_ENV === "test",
    });
    this.spinner.start(msg);
  }

  set text(msg) {
    this.spinner.text = msg;
  }

  start(msg) {
    this.spinner.start(msg);
  }

  fail(msg) {
    this.spinner.fail(msg);
  }

  succeed(msg) {
    setTimeout(() => {
      this.spinner.succeed(msg);
    }, ONE_SECOND);
  }
}

const upperFirst = (str) => str[0].toUpperCase() + str.slice(1);

const displayErrorMessages = (errorMsg, exitStatus = 0) => {
  if (errorMsg && errorMsg.length) {
    logger.log();
    errorMsg.forEach(function (msg) {
      logger.error(msg);
    });
    logger.log();

    if (typeof exitStatus === "number") {
      process.exit(exitStatus);
    }
  }
};

const runCommand = async (
  command,
  { verbose: verbose, ignoreError: ignoreError } = {
    verbose: false,
    ignoreError: false,
  }
) => {
  try {
    const { stdout, stderr } = await exec(command);
    return verbose
      ? { stdout: stdout.replace(/\n$/, ""), stderr }
      : stdout.replace(/\n$/, "");
  } catch (err) {
    if (!ignoreError) {
      throw new Error(red(err));
    }
  }
};

/**
 *
 * WARNING: this method is nasty! It will alter the original
 * objects... This needs to be fixed, but for now, it's what it is.
 *
 */
const shallowMerge = (defaultConfig, customConfig) =>
  _.merge(defaultConfig, customConfig);

const printHTTPLogs = (req) => {
  const now = new Date();
  logger.log(
    `${grey("[ ")}${grey(now.toDateString())} ${grey(
      now.toLocaleTimeString()
    )}${grey(" ]")} ${green(req.method)} ${cyan(req.url)}`
  );
};

module.exports = {
  // constants
  ONE_SECOND,
  // public methods
  deepEqual,
  displayErrorMessages,
  printHTTPLogs,
  runCommand,
  shallowMerge,
  Spinner,
  upperFirst,
};
