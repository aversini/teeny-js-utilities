const _ = require("lodash");
const execa = require("execa");
const { red } = require("kleur");
const ora = require("ora");

const ONE_SECOND = 1000;

/* istanbul ignore next */
/**
 * Spinner is an "elegant terminal spinner", relying behind the scenes
 * on the excellent [ora](https://github.com/sindresorhus/ora)
 */
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

/**
 * Runs a shell command asynchronously and depending on the options,
 * returns `stdout` as a string, or both `stdout` and `stderr` as an object
 * if the `option.verbose` flag is true.
 * If the command fails to run (invalid command or the commands status is
 * anything but 0), the call will throw an exception. The exception can be
 * ignored if the `options.ignoreError` flag is true.
 *
 * @async
 * @param {string} command the command to execute
 * @param {object} options
 * @param {boolean} options.verbose flag to indicate if the result should be
 * an object with {stdout, stderr} or a simple stdout string
 * @param {boolean} options.ignoreError flag to indicate ignore any exception
 *
 * @returns {Promise<string> | Promise<object>}
 */
const runCommand = async (
  command,
  { verbose: verbose, ignoreError: ignoreError } = {
    ignoreError: false,
    verbose: false,
  }
) => {
  try {
    const { stdout, stderr } = await execa.command(command, {
      /**
       * For some reason, a command with a " or ' in execa.command() will
       * fail, but it works if shell is set to true... It would work if
       * the command() API is not used:
       * execa("git", ["commit", "-m", "some message"]);
       * Same problems with && and ||.
       */
      shell:
        command.includes('"') ||
        command.includes("'") ||
        command.includes("&&") ||
        command.includes("||"),
    });
    return verbose
      ? { stderr, stdout: stdout.replace(/\n$/, "") }
      : stdout.replace(/\n$/, "");
  } catch (err) {
    if (!ignoreError) {
      throw new Error(red(err));
    } else {
      return {
        exitCode: typeof err.exitCode === "undefined" ? 1 : err.exitCode,
        shortMessage: err.shortMessage,
      };
    }
  }
};

/**
 * Wrapper method for lodash `merge()` and `mergeWith()` methods.
 *
 * Without the `customizer` function, this method recursively merges own and inherited
 * enumerable string keyed properties of source objects into the destination object.
 * Source properties that resolve to undefined are skipped if a destination value exists.
 * Array and plain object properties are merged recursively. Other objects and value
 * types are overridden by assignment. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * With the `customizer` function, the behavior is the same except that `customizer` is
 * invoked to produce the merged values of the destination and source properties.
 * If customizer returns undefined, merging is handled by the `shallowMerge` instead.
 * The customizer is invoked with six arguments: `(objValue, srcValue, key, object,
 * source, stack)`
 * @param {object} objA
 * @param {object} objB
 * @param {function} customizer
 * @returns {object}
 *
 * !! WARNING: this method will mutate objA
 */
const shallowMerge = (objA, objB, customizer) => {
  if (typeof customizer === "function") {
    return _.mergeWith(objA, objB, customizer);
  } else {
    return _.merge(objA, objB);
  }
};

const isScopedPackage = (name) => {
  const regex = "@[a-z\\d][\\w-.]+/[a-z\\d][\\w-.]*";
  return new RegExp(`^${regex}$`, "i").test(name);
};

/**
 * Generate a random number to append to an `id` string.
 *
 * NOTE: we are still using the good old lodash uniqueId when
 * the code is not in production, so that the results are a
 * little bit more consistent tests after test instead of
 * being completely random, so that they do not break
 * potential snapshot tests.
 *
 * @param {String} prefix - When a prefix is provided, the
 *                          function will return a random
 *                          number appended to the provided
 *                          prefix.
 *
 * @returns {String} - Returns a string with random numbers.
 */
const uniqueID = (prefix) => {
  if (process.env.NODE_ENV !== "production") {
    return _.uniqueId(prefix);
  }
  // Extract the decimal part
  const randomNumber = `${Math.random()}`.split(".")[1];
  return prefix ? `${prefix}${randomNumber}` : randomNumber;
};

module.exports = {
  Spinner,
  isScopedPackage,
  runCommand,
  shallowMerge,
  uniqueID,
};
