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

module.exports = {
  capitalize,
  upperFirst,
};
