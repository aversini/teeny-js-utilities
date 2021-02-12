const { blue, green, grey, red } = require("kleur");
const path = require("path");
const Table = require("cli-table3");
const { upperFirst } = require("./strings");

/**
 *
 * Automatic Helper constructor for https://github.com/sindresorhus/meow
 *
 * Example:
 *
 * const { helpText, options } = meowOptionsHelper({
 *   examples: [
 *     {
 *       command: 'my-cli --command "chmod +x" bin',
 *       comment: '## Make all files executable in the "bin" folder',
 *     },
 *   ],
 *   flags: {
 *     command: {
 *       alias: "c",
 *       description: "Command to execute over each node (ex: chmod +x)",
 *       type: "string",
 *     },
 *     help: {
 *       alias: "h",
 *       description: "Display help instructions",
 *       type: "boolean",
 *     },
 *     version: {
 *       alias: "v",
 *       description: "Output the current version",
 *       type: "boolean",
 *     },
 *   },
 *   parameters: {
 *     path: {
 *       default: "current folder",
 *       description: "the path where to search for files",
 *     },
 *   },
 *   usage: "my-cli [options] [path]",
 * });
 *
 * const cli = meow(helpText, options);
 *
 */
const meowOptionsHelper = ({ usage, flags, parameters, examples }) => {
  let helpText = "",
    usageText = "";
  const commandPrefix = "> ";
  const options = {
    allowUnknownFlags: false,
    autoHelp: false,
    autoVersion: false,
    description: false,
    flags,
  };
  const commonTableConfiguration = {
    chars: {
      bottom: "",
      "bottom-left": "",
      "bottom-mid": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      middle: "",
      right: "",
      "right-mid": "",
      top: "",
      "top-left": "",
      "top-mid": "",
      "top-right": "",
    },
    style: {
      "padding-left": 0,
      "padding-right": 2,
    },
    wordWrap: true,
  };

  if (usage) {
    if (typeof usage === "string") {
      const optionalParameters = usage.match(/\[(.*?)\]/g);
      const requiredParameters = usage.match(/<(.*?)>/g);
      if (optionalParameters) {
        optionalParameters.forEach((item) => {
          usage = usage.replace(item, `${green(item)}`);
        });
      }
      if (requiredParameters) {
        requiredParameters.forEach((item) => {
          usage = usage.replace(item, `${red(item)}`);
        });
      }
      usageText = `  Usage:\n    ${commandPrefix}${usage}`;
    }
    if (typeof usage === "boolean") {
      const processName = path.basename(process.argv[1]);
      usageText = ` Usage:\n    ${commandPrefix}${processName}`;
      if (flags) {
        usageText += green(" [options]");
      }
    }
  }

  if (flags) {
    const flagsTable = new Table(commonTableConfiguration);
    helpText += "\n\n  Options:\n";

    Object.keys(flags)
      .sort()
      .forEach((item) => {
        const flag = flags[item];
        const aliasCell = flag.alias
          ? `    ${blue(`-${flag.alias}, --${item}`)}`
          : `    ${blue(`    --${item}`)}`;
        const defaultCell =
          typeof flag.default !== "undefined"
            ? `${grey(`(default: ${flag.default})`)}`
            : "";
        flagsTable.push([aliasCell, flag.description, defaultCell]);
      });
    helpText += flagsTable.toString();
  }

  if (parameters) {
    const parametersTable = new Table(commonTableConfiguration);
    helpText += "\n\n";

    Object.keys(parameters)
      .sort()
      .forEach((item) => {
        const parameter = parameters[item];
        const headerCell = `  ${upperFirst(item)}:`;
        const defaultCell =
          typeof parameter.default !== "undefined"
            ? `${grey(`(default: ${parameter.default})`)}`
            : "";
        parametersTable.push([headerCell, parameter.description, defaultCell]);
        if (typeof usage === "boolean") {
          usageText += ` ${green(`[${item}]`)}`;
        }
      });
    helpText += parametersTable.toString();
  }

  if (examples) {
    helpText += "\n\n  Examples:\n";
    examples.forEach((item) => {
      helpText += `\n    ${grey(`${item.comment}`)}\n`;
      helpText += `    ${blue(`${commandPrefix}${item.command}`)}\n`;
    });
  }

  return {
    helpText: `\n${usageText}${helpText}`,
    options,
  };
};

/**
 *
 * Automatic Helper parser for https://github.com/sindresorhus/meow
 *
 * Example:
 *
 * const cli = meow(helpText, options);
 * meowParserHelper({
 *   cli,
 *   restrictions: [
 *    {
 *      exit: 1,
 *      message: (flag) => `Error: option '${flag.type}' is invalid`,
 *      test: (flag) => flag.type !== "d" && flag.type !== "f"
 *    }
 *  ]
 * });
 *
 */
const meowParserHelper = ({ cli, restrictions }) => {
  try {
    if (cli.flags.help) {
      cli.showHelp();
      process.exit(0);
    }
  } catch (e) {
    // nothing to declare officer
  }

  try {
    if (cli.flags.version) {
      cli.showVersion();
      process.exit(0);
    }
  } catch (e) {
    // nothing to declare officer
  }

  if (restrictions && restrictions.length) {
    restrictions.forEach((rule) => {
      if (rule.test(cli.flags)) {
        // eslint-disable-next-line no-console
        console.error(rule.message(cli.flags));
        process.exit(rule.exit);
      }
    });
  }
};

module.exports = {
  meowOptionsHelper,
  meowParserHelper,
};
