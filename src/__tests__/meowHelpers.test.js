const { meowOptionsHelper, meowParserHelper } = require("../index");

describe("when testing for meowHelpers with no logging side-effects", () => {
  it("should return the right helpText and valid options for meow", async () => {
    const { helpText, options } = meowOptionsHelper({
      examples: [
        {
          command: 'my-cli --type f --pattern=".sh$" --command "chmod +x"',
          comment:
            '## Find files with the extension ".jsx" in the "src" folder',
        },
        {
          command: 'my-cli --type f --pattern=".sh$" --command "chmod +x"',
          comment:
            '## Change the permissions to executable for all the files with extension ".sh" found under the "bin" folder',
        },
        {
          command: 'my-cli --type f --pattern ".md$" --grep "Table of Content"',
          comment:
            '## Search in all the markdown files under the `src` folder for the keywords "Table of Content"',
        },
      ],
      flags: {
        boring: {
          alias: "b",
          default: false,
          description: "Do not use color output",
          type: "boolean",
        },
        command: {
          alias: "c",
          description: "Command to execute over each node (ex: chmod +x)",
          type: "string",
        },
        dot: {
          default: false,
          description: "Show hidden files and directories",
          type: "boolean",
        },
        grep: {
          alias: "g",
          description:
            "A regular expression to match the content of the files found",
          type: "string",
        },
        help: {
          alias: "h",
          description: "Display help instructions",
          type: "boolean",
        },
        ignoreCase: {
          alias: "i",
          default: false,
          description: "Ignore case when searching",
          type: "boolean",
        },
        pattern: {
          alias: "p",
          description: "A regular expression to match file or folder names",
          type: "string",
        },
        short: {
          default: false,
          description: "Short listing format (equivalent to ls)",
          type: "boolean",
        },
        stats: {
          alias: "s",
          default: false,
          description: "Display some statistics",
          type: "boolean",
        },
        type: {
          alias: "t",
          description: "Search for files (f) or directories (d)",
          type: "string",
        },
        version: {
          alias: "v",
          description: "Output the current version",
          type: "boolean",
        },
      },
      parameters: {
        folder: {
          description: "some folder out of nowhere",
        },
        path: {
          default: "current folder",
          description: "the path where to search for files or directories",
        },
      },
      usage: "my-cli [options] <command> [path]",
    });

    expect(options).toStrictEqual({
      allowUnknownFlags: false,
      autoHelp: false,
      autoVersion: false,
      description: false,
      flags: {
        boring: {
          alias: "b",
          default: false,
          description: "Do not use color output",
          type: "boolean",
        },
        command: {
          alias: "c",
          description: "Command to execute over each node (ex: chmod +x)",
          type: "string",
        },
        dot: {
          default: false,
          description: "Show hidden files and directories",
          type: "boolean",
        },
        grep: {
          alias: "g",
          description:
            "A regular expression to match the content of the files found",
          type: "string",
        },
        help: {
          alias: "h",
          description: "Display help instructions",
          type: "boolean",
        },
        ignoreCase: {
          alias: "i",
          default: false,
          description: "Ignore case when searching",
          type: "boolean",
        },
        pattern: {
          alias: "p",
          description: "A regular expression to match file or folder names",
          type: "string",
        },
        short: {
          default: false,
          description: "Short listing format (equivalent to ls)",
          type: "boolean",
        },
        stats: {
          alias: "s",
          default: false,
          description: "Display some statistics",
          type: "boolean",
        },
        type: {
          alias: "t",
          description: "Search for files (f) or directories (d)",
          type: "string",
        },
        version: {
          alias: "v",
          description: "Output the current version",
          type: "boolean",
        },
      },
    });
    expect(helpText).toEqual(expect.stringContaining("  Usage:"));
    expect(helpText).toEqual(
      expect.stringContaining("> my-cli [options] <command> [path]")
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        "  -b, --boring      Do not use color output                                       (default: false)"
      )
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        "  -c, --command     Command to execute over each node (ex: chmod +x)"
      )
    );
    expect(helpText).toEqual(
      expect.stringContaining("  Folder:  some folder out of nowhere")
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        "  Path:    the path where to search for files or directories  (default: current folder)"
      )
    );
    expect(helpText).toEqual(expect.stringContaining("  Examples:"));
    expect(helpText).toEqual(
      expect.stringContaining(
        '   ## Find files with the extension ".jsx" in the "src" folder'
      )
    );
    expect(helpText).toEqual(
      expect.stringContaining(
        '   > my-cli --type f --pattern=".sh$" --command "chmod +x"'
      )
    );
  });

  it("should return the right helpText for meow with no usage", async () => {
    const { helpText } = meowOptionsHelper({});
    expect(helpText).not.toEqual(expect.stringContaining("Usage:"));
  });

  it("should return the right helpText for meow with usage but no optional params", async () => {
    const { helpText } = meowOptionsHelper({
      usage: "my-cli <command>",
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(expect.stringContaining("> my-cli <command>"));
  });

  it("should return the right helpText for meow with usage but no required params", async () => {
    const { helpText } = meowOptionsHelper({
      usage: "my-cli [options]",
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(expect.stringContaining("> my-cli [options]"));
  });

  it("should return the right helpText for meow with auto-usage, no options and no params", async () => {
    const { helpText } = meowOptionsHelper({
      usage: true,
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(expect.stringContaining("> processChild.js"));
    expect(helpText).not.toEqual(expect.stringContaining("[options]"));
  });

  it("should return the right helpText for meow with auto-usage, with options and no params", async () => {
    const { helpText } = meowOptionsHelper({
      flags: {
        help: true,
      },
      usage: true,
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(
      expect.stringContaining("> processChild.js [options]")
    );
    expect(helpText).not.toEqual(expect.stringContaining("[path]"));
  });

  it("should return the right helpText for meow with auto-usage, with params and no options", async () => {
    const { helpText } = meowOptionsHelper({
      parameters: {
        path: {
          description: "some description",
        },
      },
      usage: true,
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(
      expect.stringContaining("> processChild.js [path]")
    );
    expect(helpText).not.toEqual(expect.stringContaining("[options]"));
  });

  it("should return the right helpText for meow with auto-usage, with options and params", async () => {
    const { helpText } = meowOptionsHelper({
      flags: {
        help: true,
      },
      parameters: {
        pathOne: {
          description: "some description",
        },
        pathTwo: {
          description: "some other description",
        },
      },
      usage: true,
    });
    expect(helpText).toEqual(expect.stringContaining("Usage:"));
    expect(helpText).toEqual(
      expect.stringContaining("> processChild.js [options] [pathOne] [pathTwo]")
    );
  });
});

/**
 * Some utilities have logging capabilities that needs to be
 * tested a little bit differently:
 * - mocking process.exit
 * - console.log
 * - inquirer.prompt
 */
let mockLog,
  mockLogError,
  mockLogWarning,
  spyExit,
  spyLog,
  spyLogError,
  spyLogWarning,
  mockExit;
describe("when testing for utilities with logging side-effects", () => {
  beforeEach(() => {
    mockExit = jest.fn();
    mockLog = jest.fn();
    mockLogError = jest.fn();
    mockLogWarning = jest.fn();

    spyExit = jest.spyOn(process, "exit").mockImplementation(mockExit);
    spyLog = jest.spyOn(console, "log").mockImplementation(mockLog);
    spyLogError = jest.spyOn(console, "error").mockImplementation(mockLogError);
    spyLogWarning = jest
      .spyOn(console, "warn")
      .mockImplementation(mockLogWarning);
  });
  afterEach(() => {
    spyExit.mockRestore();
    spyLog.mockRestore();
    spyLogError.mockRestore();
    spyLogWarning.mockRestore();
  });

  it("should display the proper help message and exit with 0", async () => {
    meowParserHelper({
      cli: {
        flags: {
          help: true,
        },
        // eslint-disable-next-line no-console
        showHelp: () => console.log("showing help"),
      },
      restrictions: [],
    });
    expect(mockLog).toHaveBeenCalledWith("showing help");
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should display the proper version and exit with 0", async () => {
    meowParserHelper({
      cli: {
        flags: {
          version: true,
        },
        // eslint-disable-next-line no-console
        showVersion: () => console.log("6.6.6"),
      },
      restrictions: [],
    });
    expect(mockLog).toHaveBeenCalledWith("6.6.6");
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it("should display the error message and exit with 666", async () => {
    meowParserHelper({
      cli: {
        flags: {
          type: "s",
        },
      },
      restrictions: [
        {
          exit: 666,
          message: (flag) => `Error: option '${flag.type}' is invalid`,
          test: (flag) => flag.type !== "d",
        },
      ],
    });
    expect(mockLogError).toHaveBeenCalledWith("Error: option 's' is invalid");
    // eslint-disable-next-line no-magic-numbers
    expect(mockExit).toHaveBeenCalledWith(666);
  });

  it("should NOT display the error message and should not exit with 666", async () => {
    meowParserHelper({
      cli: {
        flags: {
          type: "d",
        },
      },
      restrictions: [
        {
          exit: 666,
          message: (flag) => `Error: option '${flag.type}' is invalid`,
          test: (flag) => flag.type !== "d",
        },
      ],
    });
    expect(mockLogError).not.toHaveBeenCalled();
    // eslint-disable-next-line no-magic-numbers
    expect(mockExit).not.toHaveBeenCalled();
  });
});
