const { kebabCase } = require("lodash");

/**
 * Converts the first character of string to upper case
 * @param {string} str the string to convert
 * @returns {string} the converted string
 */
const upperFirst = (str) => str[0].toUpperCase() + str.slice(1);

/**
 * Converts the first character of string to upper case and
 * the remaining to lower case.
 * @param {string} str the string to convert
 * @returns {string} the converted string
 */
const capitalize = (str) => upperFirst(str.toLowerCase());

/**
 * Converts a camelcase or space-separated string
 * to a dash-separated string.
 * @param {string} str the string to convert
 * @returns {string} the converted string
 */
const _kebabCase = (str) => kebabCase(str);

module.exports = {
  capitalize,
  kebabCase: _kebabCase,
  upperFirst,
};
